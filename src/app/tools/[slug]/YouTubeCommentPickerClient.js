'use client';

import { useState } from 'react';

export default function YouTubeCommentPickerClient({ config }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    setLoading(true);
    setError('');
    setComments([]);
    setWinner(null);

    try {
      const response = await fetch('/api/youtube-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: videoUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch comments');
      }

      setComments(data.comments);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickRandomWinner = () => {
    if (comments.length === 0) return;

    setPicking(true);
    setWinner(null);

    // Animation effect - shuffle through comments
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * comments.length);
      setWinner(comments[randomIndex]);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Final random selection
        const finalIndex = Math.floor(Math.random() * comments.length);
        setWinner(comments[finalIndex]);
        setPicking(false);
      }
    }, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-glass-dark rounded-2xl border border-white/10 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Pick a Random Comment Winner
      </h2>

      {/* URL Input */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube video URL here..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={fetchComments}
            disabled={loading || !videoUrl.trim()}
            className="px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Fetch
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Comments Loaded */}
      {comments.length > 0 && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{comments.length}</p>
                <p className="text-gray-400 text-sm">Comments Loaded</p>
              </div>
            </div>

            <button
              onClick={pickRandomWinner}
              disabled={picking}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 flex items-center gap-3 text-lg"
            >
              {picking ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Picking...
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Pick Winner!
                </>
              )}
            </button>
          </div>

          {/* Winner Display */}
          {winner && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6">
              {/* Confetti Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="absolute top-0 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fbbf24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-yellow-400">Winner!</h3>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={winner.authorImage}
                    alt={winner.author}
                    className="w-16 h-16 rounded-full border-2 border-yellow-500"
                  />
                  <div className="flex-1">
                    <a 
                      href={winner.authorChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-white hover:text-yellow-400 transition-colors"
                    >
                      {winner.author}
                    </a>
                    <p className="text-gray-300 mt-2 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: winner.text }} />
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        {winner.likeCount} likes
                      </span>
                      <span>{formatDate(winner.publishedAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={pickRandomWinner}
                  disabled={picking}
                  className="mt-6 w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                  Pick Another Winner
                </button>
              </div>
            </div>
          )}

          {/* Comment List Preview */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">All Comments ({comments.length})</h4>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {comments.slice(0, 50).map((comment, index) => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg border transition-colors ${
                    winner?.id === comment.id 
                      ? 'bg-yellow-500/20 border-yellow-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img src={comment.authorImage} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium text-white">{comment.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.publishedAt)}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2" dangerouslySetInnerHTML={{ __html: comment.text }} />
                </div>
              ))}
              {comments.length > 50 && (
                <p className="text-center text-gray-500 text-sm py-2">
                  +{comments.length - 50} more comments...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

