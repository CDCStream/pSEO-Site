import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { gameType, description, style } = await request.json();

    const gameInfo = gameType ? `Game type: ${gameType}.` : '';
    const descInfo = description ? `Player/game description: "${description}"` : '';
    const styleInfo = style ? `Preferred style: ${style}.` : '';

    const prompt = `Generate 12 unique gaming usernames/gamertags.

${gameInfo}
${descInfo}
${styleInfo}

Requirements:
- Create memorable, impactful gaming names
- Mix different styles based on the game type:
  - FPS/Shooter: tactical, military-themed, aggressive
  - MOBA/Strategy: clever, intimidating, strategic
  - RPG/MMO: fantasy, epic, character-like
  - Battle Royale: survivor, champion vibes
  - Racing: speed, adrenaline themed
  - Horror: dark, creepy, mysterious
- Use gaming conventions: numbers, underscores, x's
- Some short (4-8 chars), some medium (8-12), some stylized
- Include clan tag style variations [TAG]Name
- Make them easy to remember and type
- No spaces, only letters, numbers, underscores

Return in this format (one per line):
USERNAME|STYLE

Where STYLE is one of: Aggressive, Tactical, Legendary, Mysterious, Pro, Funny, Elite, Toxic

Example:
ShadowStrik3r|Aggressive
xX_Phantom_Xx|Mysterious`;

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
            name: parts[0].trim(),
            style: parts[1].trim()
          };
        }
        return {
          name: trimmed,
          style: 'Pro'
        };
      })
      .filter(item => item && item.name.length > 0)
      .slice(0, 12);

    return Response.json({ names });

  } catch (error) {
    console.error('Gaming Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate gaming names. Please try again.' },
      { status: 500 }
    );
  }
}

