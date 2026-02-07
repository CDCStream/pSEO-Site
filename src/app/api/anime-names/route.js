import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { gender, style, meaning } = await request.json();

    const genderInfo = gender ? `Gender: ${gender} names only.` : 'Any gender.';
    const styleInfo = style ? `Style preference: ${style}.` : '';
    const meaningInfo = meaning ? `Consider meanings related to: ${meaning}.` : '';

    const prompt = `Generate 12 unique Japanese anime-style character names.

${genderInfo}
${styleInfo}
${meaningInfo}

Requirements:
- Create authentic Japanese names that would fit in anime/manga
- Include both first names and surnames where appropriate
- Mix common and unique anime name styles
- Names should be romanized (not in Japanese characters)
- Include a variety: traditional, modern, fantasy-inspired
- Format: Just the name (e.g., "Sakura Haruno", "Naruto", "Mikasa Ackerman")

Return ONLY the 12 names, one per line, without numbering, explanations, or meanings.`;

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
      .slice(0, 12);

    return Response.json({ names });

  } catch (error) {
    console.error('Anime Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate anime names. Please try again.' },
      { status: 500 }
    );
  }
}

