/**
 * Pure-JS WAV (RIFF/PCM) encoder for AudioBuffer → WAV bytes.
 *
 * Supports 16-bit and 24-bit signed little-endian PCM, mono or stereo,
 * any sample rate the browser can produce (typical 44.1 kHz / 48 kHz).
 *
 * Used by the YouTube → WAV converter: we fetch an MP3 stream, decode it
 * with the browser's AudioContext, optionally resample via OfflineAudioContext,
 * then emit a standard PCM WAVE file the user can drop into Audacity, Logic,
 * Ableton, FL Studio, Pro Tools, Reaper, DaVinci Resolve, etc.
 *
 * No third-party dependency. Runs entirely client-side.
 */

function writeAscii(view, offset, str) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

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
 * Encode an AudioBuffer to a WAV file (ArrayBuffer of bytes).
 *
 * @param {AudioBuffer} buffer
 * @param {16|24}       bitDepth
 * @returns {ArrayBuffer}
 */
export function encodeWav(buffer, bitDepth = 16) {
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
  const view = new DataView(out);

  // RIFF chunk
  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true); // file size minus first 8 bytes
  writeAscii(view, 8, 'WAVE');

  // fmt sub-chunk (PCM, sub-chunk size 16)
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Pull channel data once; buffer.getChannelData() is cheap but called
  // repeatedly for every frame would be wasteful for long audio.
  const channels = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = headerSize;
  if (bitDepth === 16) {
    for (let i = 0; i < numFrames; i++) {
      for (let c = 0; c < numChannels; c++) {
        let s = channels[c][i];
        if (s > 1) s = 1;
        else if (s < -1) s = -1;
        view.setInt16(offset, s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), true);
        offset += 2;
      }
    }
  } else {
    // 24-bit signed little-endian — three bytes per sample
    for (let i = 0; i < numFrames; i++) {
      for (let c = 0; c < numChannels; c++) {
        let s = channels[c][i];
        if (s > 1) s = 1;
        else if (s < -1) s = -1;
        const v = (s < 0 ? Math.round(s * 0x800000) : Math.round(s * 0x7fffff)) | 0;
        view.setUint8(offset, v & 0xff);
        view.setUint8(offset + 1, (v >> 8) & 0xff);
        view.setUint8(offset + 2, (v >> 16) & 0xff);
        offset += 3;
      }
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
