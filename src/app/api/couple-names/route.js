import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { firstName, secondName } = await request.json();

    if (!firstName || !secondName) {
      return Response.json(
        { error: 'Please provide both names' },
        { status: 400 }
      );
    }

    const prompt = `Generate 10 creative couple name combinations (ship names) for these two people:

Person 1: ${firstName}
Person 2: ${secondName}

Requirements:
- Create unique mashups combining parts of both names
- Mix different styles: romantic, cute, creative, clever wordplay
- Some should blend the beginning of one name with the ending of another
- Some can be creative portmanteaus
- Some can include fun variations or puns
- Make them sound natural and memorable
- Consider how fans would use these as hashtags

Return ONLY the 10 couple names, one per line, without numbering or explanations.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
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
    console.error('Couple Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate couple names. Please try again.' },
      { status: 500 }
    );
  }
}

