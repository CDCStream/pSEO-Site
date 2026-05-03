const MP3_HOST = process.env.RAPIDAPI_MP3_HOST || 'youtube-mp36.p.rapidapi.com';
const MP4_HOST = process.env.RAPIDAPI_MP4_HOST || 'ytstream-download-youtube-videos.p.rapidapi.com';

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const SHORTS_REGEX = /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;

function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(cleaned)) return cleaned;

  const shortsMatch = cleaned.match(SHORTS_REGEX);
  if (shortsMatch) return shortsMatch[1];

  const match = cleaned.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, options, maxRetries = 2) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      lastError = new Error(`Upstream ${res.status}`);
      lastError.status = res.status;
      if (res.status === 429 || res.status === 403) {
        await sleep(800 * (attempt + 1));
        continue;
      }
      if (res.status >= 500) {
        await sleep(500 * (attempt + 1));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      await sleep(500 * (attempt + 1));
    }
  }
  if (lastError) throw lastError;
  throw new Error('Request failed');
}

async function convertToMp3(videoId, apiKey) {
  const url = `https://${MP3_HOST}/dl?id=${encodeURIComponent(videoId)}`;
  const res = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': MP3_HOST,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (data.status === 'fail' || data.msg?.toLowerCase().includes('not found')) {
    throw new Error(data.msg || 'Video not available for conversion.');
  }

  if (data.status === 'processing') {
    return {
      processing: true,
      message: 'Conversion is still processing on the server. Please retry in a few seconds.',
      title: data.title || null,
      duration: data.duration || null,
    };
  }

  if (!data.link) {
    throw new Error(data.msg || 'No download link returned. The video may be unavailable, private, or age-restricted.');
  }

  return {
    processing: false,
    downloadUrl: data.link,
    title: data.title || 'YouTube Audio',
    duration: data.duration || null,
    filesize: data.filesize || null,
    format: 'mp3',
    quality: '128',
    expiresIn: '6 hours',
  };
}

function pickVideoFormat(formats, targetHeight) {
  if (!Array.isArray(formats) || formats.length === 0) return null;

  const withVideoAndAudio = formats.filter(
    (f) => f.url && f.height && (f.mimeType || '').includes('video') && (f.audioQuality || f.hasAudio)
  );

  const candidates = withVideoAndAudio.length > 0
    ? withVideoAndAudio
    : formats.filter((f) => f.url && f.height);

  if (candidates.length === 0) return null;

  const exact = candidates.find((f) => f.height === targetHeight);
  if (exact) return exact;

  const sorted = [...candidates].sort(
    (a, b) => Math.abs((a.height || 0) - targetHeight) - Math.abs((b.height || 0) - targetHeight)
  );
  return sorted[0];
}

async function convertToMp4(videoId, quality, apiKey) {
  const url = `https://${MP4_HOST}/dl?id=${encodeURIComponent(videoId)}`;
  const res = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': MP4_HOST,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (data.status === 'fail' || data.errorId) {
    throw new Error(data.reason || data.msg || 'Video not available for download.');
  }

  const allFormats = [
    ...(Array.isArray(data.formats) ? data.formats : []),
    ...(Array.isArray(data.adaptiveFormats) ? data.adaptiveFormats : []),
  ];

  if (allFormats.length === 0) {
    throw new Error('No downloadable formats found for this video.');
  }

  const targetHeight = parseInt(quality, 10) || 720;
  const picked = pickVideoFormat(allFormats, targetHeight);

  if (!picked || !picked.url) {
    throw new Error(`No video stream available at ${quality}p quality. Try a lower quality.`);
  }

  const thumbs = Array.isArray(data.thumbnail) ? data.thumbnail : [];
  const thumbnail = thumbs.length > 0 ? thumbs[thumbs.length - 1].url : null;

  const seconds = parseInt(data.lengthSeconds, 10);
  const duration = Number.isFinite(seconds)
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
    : null;

  return {
    processing: false,
    downloadUrl: picked.url,
    title: data.title || 'YouTube Video',
    duration,
    thumbnail,
    channel: data.channelTitle || data.author || null,
    format: 'mp4',
    quality: String(picked.height || quality),
    expiresIn: '6 hours',
  };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, format = 'mp3', quality } = body;

    if (!url || typeof url !== 'string') {
      return Response.json(
        { error: 'Please provide a YouTube URL.' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return Response.json(
        { error: 'Invalid YouTube URL. Please use a link like https://www.youtube.com/watch?v=... or https://youtu.be/...' },
        { status: 400 }
      );
    }

    const cleanFormat = format === 'mp4' ? 'mp4' : 'mp3';
    const cleanQuality = (() => {
      if (cleanFormat === 'mp3') {
        const allowed = ['128', '192', '320'];
        return allowed.includes(String(quality)) ? String(quality) : '128';
      }
      const allowed = ['360', '480', '720', '1080'];
      return allowed.includes(String(quality)) ? String(quality) : '720';
    })();

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'YouTube conversion service is not configured. The site owner needs to set the RAPIDAPI_KEY environment variable.',
          configError: true,
        },
        { status: 503 }
      );
    }

    let result;
    try {
      if (cleanFormat === 'mp3') {
        result = await convertToMp3(videoId, apiKey);
      } else {
        result = await convertToMp4(videoId, cleanQuality, apiKey);
      }
    } catch (err) {
      const status = err?.status || 502;
      const msg = err?.message || 'Conversion failed.';
      const isBlocked = status === 429 || status === 403 || /block|rate|limit/i.test(msg);

      return Response.json(
        {
          error: isBlocked
            ? 'YouTube briefly blocked this request. Please click "Try Again" in a few seconds.'
            : msg,
          retryable: true,
          videoId,
        },
        { status: isBlocked ? 429 : status }
      );
    }

    return Response.json({
      success: true,
      videoId,
      ...result,
    });
  } catch (error) {
    console.error('YouTube MP3 API Error:', error);
    return Response.json(
      { error: 'Conversion failed. Please try again.', retryable: true },
      { status: 500 }
    );
  }
}
