import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { target, style, beef, tone } = await request.json();

    if (!target || target.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a target name' },
        { status: 400 }
      );
    }

    const styleInfo = style ? `in the style of ${style}` : '';
    const beefInfo = beef ? `The specific beef/reason: ${beef}.` : '';
    const toneInfo = tone || 'aggressive but playful';

    const prompt = `Write an original, creative diss track/rap ${styleInfo} targeting someone named "${target}". 

${beefInfo}

Tone: ${toneInfo}

Requirements:
- Create 2 verses and a hook
- Include [Verse 1], [Hook], [Verse 2], and [Outro] labels
- Make it clever with wordplay, metaphors, and punchlines
- Add ad-libs in parentheses like (uh!), (yeah!), (let's go!) sparingly
- Keep it fun and entertaining, not genuinely hurtful or offensive
- No profanity or slurs
- Make the rhymes tight and the flow smooth
- Around 20-25 lines total

Format the output as just the lyrics, nothing else.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const lyrics = message.content[0].text;

    return Response.json({ lyrics });

  } catch (error) {
    console.error('Diss Track API Error:', error);
    return Response.json(
      { error: 'Failed to generate diss track. Please try again.' },
      { status: 500 }
    );
  }
}

