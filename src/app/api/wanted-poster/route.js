import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a name' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Generate funny wanted poster content for someone named "${name.trim()}". Return ONLY a valid JSON object with these exact keys:
- "crime": a humorous crime (max 8 words, e.g. "STEALING ALL THE PIZZA SLICES")
- "alias": a funny nickname (max 4 words, e.g. "THE SNACK BANDIT")
- "reward": a funny reward amount or prize (max 8 words, e.g. "$10,000 AND A FREE TACO")
- "lastSeen": a funny last seen location/activity (max 10 words, e.g. "RAIDING THE FRIDGE AT 3AM")

Keep it PG-13 and humorous. All text should be uppercase. Return only the JSON, no explanation.`,
        },
      ],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: 'AI response parsing failed' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);

    return Response.json(result);
  } catch (error) {
    console.error('Wanted Poster API Error:', error);
    return Response.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
