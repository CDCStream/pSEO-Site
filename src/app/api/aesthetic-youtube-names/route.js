import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { aesthetic, contentType, keywords } = await request.json();

    const aestheticInfo = aesthetic ? `Aesthetic style: ${aesthetic}.` : '';
    const contentInfo = contentType ? `Content type: ${contentType}.` : '';
    const keywordInfo = keywords ? `Include themes/words related to: "${keywords}"` : '';

    const prompt = `Generate 12 aesthetic YouTube channel names.

${aestheticInfo}
${contentInfo}
${keywordInfo}

Requirements:
- Create soft, artistic, visually pleasing names
- Names should evoke the chosen aesthetic
- Use lowercase for that aesthetic vibe when appropriate
- Include symbols or special formatting sparingly (✿, ☁, ♡, ☾, ✧)
- Some with "with [name]", "by [name]" format
- Mix English with occasional French/Japanese words for aesthetic feel
- Keep names memorable and searchable
- Suitable for YouTube branding

Aesthetic styles to match:
- Cottagecore: nature, cozy, soft, pastoral
- Dark Academia: literary, mysterious, vintage
- Minimalist: clean, simple, zen
- Soft/Pastel: dreamy, gentle, kawaii
- Vintage: retro, nostalgic, classic
- Ethereal: magical, celestial, airy

Return ONLY the 12 names, one per line, without numbering or explanations.`;

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
    console.error('Aesthetic YouTube Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate names. Please try again.' },
      { status: 500 }
    );
  }
}

