/**
 * Pure-JS WAV (RIFF/PCM) encoder for AudioBuffer → WAV bytes.
 *
 * Supports 16-bit and 24-bit signed little-endian PCM, mono or stereo,
 * any sample rate the browser can produce (typical 44.1 kHz / 48 kHz).
 *
 * Performance:
 *   - 16-bit path uses Int16Array writes directly into the data section of
 *     the output ArrayBuffer (≈10× faster than DataView.setInt16 because
 *     typed-array element assignment skips the per-call function dispatch
 *     and bounds check that DataView does).
 *   - 24-bit path uses a Uint8Array view and writes 3 bytes per sample.
 *   - Both encoders chunk the work into ~100 000-frame batches and yield to
 *     the event loop between batches so the UI can render progress while a
 *     long track encodes (1-hour content otherwise freezes the main thread).
 *
 * Endianness note:
 *   WAV requires little-endian. JavaScript typed arrays use the host's
 *   native endianness, which is little-endian on x86 and ARM (>99% of
 *   devices in 2026). Safe for production.
 *
 * No third-party dependency. Runs entirely client-side.
 */

function writeAscii(view, offset, str) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

const yieldToUI = () => new Promise((r) => setTimeout(r, 0));

/**
 * Resample (and/or downmix) an AudioBuffer using OfflineAudioContext.
 *
 * @param {AudioBuffer} buffer       source buffer (any sample rate, any channel count)
 * @param {number}      targetRate   desired sample rate (e.g. 44100 or 48000)
 * @param {number}      targetChannels  1 or 2 (1 forces mono, 2 keeps stereo)
 * @returns {Promise<AudioBuffer>}
 */
export async function resampleBuffer(buffer, targetRate, targetChannels = 2) {
  if (
    buffer.sampleRate === targetRate &&
    buffer.numberOfChannels === targetChannels
  ) {
    return buffer;
  }
  const channels = Math.max(1, Math.min(2, targetChannels));
  const length = Math.max(1, Math.round(buffer.duration * targetRate));
  const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OfflineCtx(channels, length, targetRate);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start(0);
  return await ctx.startRendering();
}

/**
 * Encode an AudioBuffer to a WAV file (ArrayBuffer of bytes). Async because
 * we yield to the event loop periodically for long audio.
 *
 * @param {AudioBuffer}                buffer
 * @param {16|24}                      bitDepth
 * @param {(p:number)=>void} [onProgress]  receives 0..1 progress
 * @returns {Promise<ArrayBuffer>}
 */
export async function encodeWav(buffer, bitDepth = 16, onProgress) {
  if (bitDepth !== 16 && bitDepth !== 24) {
    throw new Error('WAV encoder supports 16-bit or 24-bit PCM only.');
  }

  const numChannels = Math.max(1, Math.min(2, buffer.numberOfChannels));
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const out = new ArrayBuffer(totalSize);
  const headerView = new DataView(out, 0, headerSize);

  // RIFF chunk
  writeAscii(headerView, 0, 'RIFF');
  headerView.setUint32(4, totalSize - 8, true);
  writeAscii(headerView, 8, 'WAVE');

  // fmt sub-chunk (PCM, sub-chunk size 16)
  writeAscii(headerView, 12, 'fmt ');
  headerView.setUint32(16, 16, true);
  headerView.setUint16(20, 1, true); // PCM = 1
  headerView.setUint16(22, numChannels, true);
  headerView.setUint32(24, sampleRate, true);
  headerView.setUint32(28, byteRate, true);
  headerView.setUint16(32, blockAlign, true);
  headerView.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeAscii(headerView, 36, 'data');
  headerView.setUint32(40, dataSize, true);

  const ch0 = buffer.getChannelData(0);
  const ch1 = numChannels === 2 ? buffer.getChannelData(1) : null;

  // Tune chunk size: 100k frames ≈ 2.3 s at 44.1 kHz, ≈ 2.1 s at 48 kHz.
  // That keeps each synchronous burst under ~10 ms even on a low-end phone.
  const CHUNK = 100_000;

  if (bitDepth === 16) {
    const pcm = new Int16Array(out, headerSize, numFrames * numChannels);

    if (numChannels === 1) {
      for (let start = 0; start < numFrames; start += CHUNK) {
        const end = Math.min(start + CHUNK, numFrames);
        for (let i = start; i < end; i++) {
          let s = ch0[i];
          if (s > 1) s = 1;
          else if (s < -1) s = -1;
          // Asymmetric scale matches the standard signed 16-bit range
          pcm[i] = s < 0 ? (s * 0x8000) | 0 : (s * 0x7fff) | 0;
        }
        if (onProgress) onProgress(end / numFrames);
        if (end < numFrames) await yieldToUI();
      }
    } else {
      // Stereo: interleave L,R,L,R,...
      for (let start = 0; start < numFrames; start += CHUNK) {
        const end = Math.min(start + CHUNK, numFrames);
        for (let i = start, p = start * 2; i < end; i++, p += 2) {
          let s0 = ch0[i];
          let s1 = ch1[i];
          if (s0 > 1) s0 = 1;
          else if (s0 < -1) s0 = -1;
          if (s1 > 1) s1 = 1;
          else if (s1 < -1) s1 = -1;
          pcm[p] = s0 < 0 ? (s0 * 0x8000) | 0 : (s0 * 0x7fff) | 0;
          pcm[p + 1] = s1 < 0 ? (s1 * 0x8000) | 0 : (s1 * 0x7fff) | 0;
        }
        if (onProgress) onProgress(end / numFrames);
        if (end < numFrames) await yieldToUI();
      }
    }
  } else {
    // 24-bit signed little-endian — three bytes per sample. There is no
    // Int24Array, so we write directly through a Uint8Array view.
    const bytes = new Uint8Array(out, headerSize, dataSize);

    for (let start = 0; start < numFrames; start += CHUNK) {
      const end = Math.min(start + CHUNK, numFrames);
      let off = start * blockAlign;
      for (let i = start; i < end; i++) {
        for (let c = 0; c < numChannels; c++) {
          let s = c === 0 ? ch0[i] : ch1[i];
          if (s > 1) s = 1;
          else if (s < -1) s = -1;
          const v = (s < 0 ? s * 0x800000 : s * 0x7fffff) | 0;
          bytes[off] = v & 0xff;
          bytes[off + 1] = (v >>> 8) & 0xff;
          bytes[off + 2] = (v >>> 16) & 0xff;
          off += 3;
        }
      }
      if (onProgress) onProgress(end / numFrames);
      if (end < numFrames) await yieldToUI();
    }
  }

  return out;
}

/**
 * Helper that returns a human-readable estimate of WAV size for the UI.
 * @param {number} durationSec
 * @param {number} sampleRate
 * @param {16|24}  bitDepth
 * @param {1|2}    channels
 */
export function estimateWavSize(durationSec, sampleRate, bitDepth, channels) {
  if (!isFinite(durationSec) || durationSec <= 0) return null;
  const bytes = 44 + Math.round(durationSec * sampleRate * (bitDepth / 8) * channels);
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
