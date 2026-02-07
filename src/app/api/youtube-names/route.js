import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { accountType, category, description } = await request.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `Generate 8 unique, creative, and catchy YouTube channel names for a ${accountType} account in the ${category} category.
${description ? `Channel description/keywords: ${description}` : ''}

Requirements:
- Names should be memorable and brandable
- Mix of creative wordplay, alliteration, and catchy phrases
- Suitable for ${category} content
- Easy to spell and remember
- No special characters or numbers unless creative

Return ONLY the channel names, one per line. No numbering, no explanations, no quotes.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const names = message.content[0].text
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0 && n.length < 50);

    return Response.json({ names, success: true });
  } catch (error) {
    console.error('YouTube Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate names', success: false },
      { status: 500 }
    );
  }
}

