import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { keyword } = await request.json();

    const keywordInfo = keyword ? `Theme/keyword to incorporate: "${keyword}"` : 'Generate random creative usernames.';

    const prompt = `Generate 12 unique Roblox usernames.

${keywordInfo}

Requirements:
- Usernames must be 3-20 characters
- Use only letters, numbers, and underscores
- Mix different styles:
  - Aesthetic names (soft, artistic vibe)
  - Cool names (edgy, powerful)
  - Funny names (playful, humorous)
  - OG names (simple, short, classic)
  - Gaming names (competitive, skilled)
  - Cute names (adorable, friendly)
- Use leetspeak variations (3 for E, 1 for I, 0 for O, etc.)
- Some should be short (3-8 chars), some medium (8-12), some longer
- Make them memorable and easy to type
- No spaces allowed

Return in this exact format (one per line):
USERNAME|CATEGORY

Where CATEGORY is one of: Aesthetic, Cool, Funny, OG, Gaming, Cute

Example:
xXDarkKnightXx|Cool
l33tToyz|Aesthetic`;

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
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.match(/^\d+[\.\)]/)) return null;
        
        const parts = trimmed.split('|');
        if (parts.length >= 2) {
          return {
            name: parts[0].trim().replace(/^@/, ''),
            category: parts[1].trim()
          };
        }
        // Fallback for lines without category
        return {
          name: trimmed.replace(/^@/, ''),
          category: 'Creative'
        };
      })
      .filter(item => item && item.name.length > 0)
      .slice(0, 12);

    return Response.json({ names });

  } catch (error) {
    console.error('Roblox Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate usernames. Please try again.' },
      { status: 500 }
    );
  }
}

