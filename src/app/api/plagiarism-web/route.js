function extractSentences(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const rawSentences = cleaned.match(/[^.!?\n]+[.!?]+/g) || [cleaned];
  return rawSentences
    .map((s) => s.trim())
    .filter((s) => {
      const wordCount = s.split(/\s+/).length;
      return wordCount >= 6 && wordCount <= 40 && s.length <= 250;
    });
}

function pickDistinctiveSentences(sentences, maxCount = 7) {
  const scored = sentences.map((s) => {
    const words = s.split(/\s+/);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^\w]/g, '')));
    const score = uniqueWords.size + (words.length > 10 ? 5 : 0);
    return { sentence: s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxCount).map((x) => x.sentence);
}

async function searchBrave(query, apiKey) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(`"${query}"`)}&count=3&safesearch=moderate`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  });
  if (!res.ok) {
    return { results: [], error: `Brave API ${res.status}` };
  }
  const data = await res.json();
  const results = (data?.web?.results || []).slice(0, 3).map((r) => ({
    title: r.title || '',
    url: r.url || '',
    snippet: r.description || '',
  }));
  return { results };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: 'Please provide text to analyze.' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return Response.json(
        { error: 'Text is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      return Response.json({
        disabled: true,
        message: 'Web search is currently unavailable. AI analysis is still active.',
        matches: [],
        matchedSentences: 0,
        totalSentences: 0,
        webMatchScore: 0,
      });
    }

    const allSentences = extractSentences(text);
    if (allSentences.length === 0) {
      return Response.json({
        matches: [],
        matchedSentences: 0,
        totalSentences: 0,
        webMatchScore: 0,
        message: 'No suitable sentences found for web search.',
      });
    }

    const sentencesToCheck = pickDistinctiveSentences(allSentences, 7);
    const matches = [];
    let matchedCount = 0;

    for (let i = 0; i < sentencesToCheck.length; i++) {
      const sentence = sentencesToCheck[i];
      try {
        const { results } = await searchBrave(sentence, apiKey);
        if (results && results.length > 0) {
          matches.push({ sentence, sources: results });
          matchedCount++;
        } else {
          matches.push({ sentence, sources: [] });
        }
      } catch (err) {
        console.error('Brave search error for sentence:', sentence, err);
        matches.push({ sentence, sources: [] });
      }

      if (i < sentencesToCheck.length - 1) {
        await sleep(1100);
      }
    }

    const webMatchScore = sentencesToCheck.length > 0
      ? Math.round((matchedCount / sentencesToCheck.length) * 100)
      : 0;

    return Response.json({
      matches,
      matchedSentences: matchedCount,
      totalSentences: sentencesToCheck.length,
      webMatchScore,
    });

  } catch (error) {
    console.error('Plagiarism Web API Error:', error);
    return Response.json(
      { error: 'Web plagiarism check failed. Please try again.' },
      { status: 500 }
    );
  }
}
