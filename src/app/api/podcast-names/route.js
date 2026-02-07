import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { description, audience, likedPodcasts, includeWords, excludeWords } = await request.json();

    if (!description || description.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a podcast description' },
        { status: 400 }
      );
    }

    const audienceInfo = audience ? `Target audience: ${audience}.` : '';
    const likedInfo = likedPodcasts ? `Podcasts they like for inspiration (match the style/vibe): ${likedPodcasts}.` : '';
    const includeInfo = includeWords ? `Must include these words if possible: ${includeWords}.` : '';
    const excludeInfo = excludeWords ? `Avoid using these words: ${excludeWords}.` : '';

    const prompt = `Generate 10 creative and catchy podcast name ideas based on this description:

"${description}"

${audienceInfo}
${likedInfo}
${includeInfo}
${excludeInfo}

Requirements:
- Create unique, memorable podcast names
- Names should be catchy and easy to remember
- Consider SEO-friendliness (searchable terms)
- Mix different styles: clever wordplay, straightforward, punny, professional
- Each name should feel like a real podcast you'd find on Spotify or Apple Podcasts
- Keep names concise (1-5 words typically)

Return ONLY the 10 podcast names, one per line, without numbering or explanations.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    const names = responseText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0 && !name.match(/^\d+[\.\)]/))
      .slice(0, 10);

    return Response.json({ names });

  } catch (error) {
    console.error('Podcast Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate podcast names. Please try again.' },
      { status: 500 }
    );
  }
}

