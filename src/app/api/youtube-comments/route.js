export async function POST(request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return Response.json(
        { error: 'Please provide a YouTube video URL' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      return Response.json(
        { error: 'Invalid YouTube URL. Please provide a valid video link.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      );
    }

    // Fetch comments from YouTube Data API
    const comments = await fetchAllComments(videoId, apiKey);

    if (comments.length === 0) {
      return Response.json(
        { error: 'No comments found for this video. Comments might be disabled.' },
        { status: 404 }
      );
    }

    return Response.json({
      comments,
      totalCount: comments.length,
      videoId
    });

  } catch (error) {
    if (error.userError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error('YouTube Comments API Error:', error);
    return Response.json(
      { error: 'Failed to fetch comments. Please try again.' },
      { status: 500 }
    );
  }
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function fetchAllComments(videoId, apiKey, maxComments = 500) {
  const comments = [];
  let nextPageToken = null;

  while (comments.length < maxComments) {
    const url = new URL('https://www.googleapis.com/youtube/v3/commentThreads');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('videoId', videoId);
    url.searchParams.set('maxResults', '100');
    url.searchParams.set('order', 'relevance');
    url.searchParams.set('key', apiKey);

    if (nextPageToken) {
      url.searchParams.set('pageToken', nextPageToken);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      const msg = data.error.message || '';
      if (msg.includes('disabled comments') || msg.includes('commentsDisabled')) {
        throw { userError: true, message: 'This video has comments disabled. Please try a different video.' };
      }
      if (msg.includes('not found') || data.error.code === 404) {
        throw { userError: true, message: 'Video not found. Please check the URL and try again.' };
      }
      throw new Error(msg || 'YouTube API error');
    }

    if (!data.items || data.items.length === 0) {
      break;
    }

    for (const item of data.items) {
      const snippet = item.snippet.topLevelComment.snippet;
      comments.push({
        id: item.id,
        author: snippet.authorDisplayName,
        authorImage: snippet.authorProfileImageUrl,
        authorChannel: snippet.authorChannelUrl,
        text: snippet.textDisplay,
        likeCount: snippet.likeCount,
        publishedAt: snippet.publishedAt,
      });
    }

    nextPageToken = data.nextPageToken;

    if (!nextPageToken) {
      break;
    }
  }

  return comments;
}

