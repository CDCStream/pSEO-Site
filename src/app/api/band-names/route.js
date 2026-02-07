import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { description, genre, vibe, includeWords, excludeWords } = await request.json();

    if (!description || description.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a band description' },
        { status: 400 }
      );
    }

    const genreInfo = genre ? `Genre: ${genre}.` : '';
    const vibeInfo = vibe ? `Vibe/Tone: ${vibe}.` : '';
    const includeInfo = includeWords ? `Try to incorporate these words or themes: ${includeWords}.` : '';
    const excludeInfo = excludeWords ? `Avoid using these words: ${excludeWords}.` : '';

    const prompt = `Generate 10 creative and unique band name ideas based on this description:

"${description}"

${genreInfo}
${vibeInfo}
${includeInfo}
${excludeInfo}

Requirements:
- Create memorable, catchy band names
- Names should feel authentic to the genre and vibe
- Mix different styles: single words, two-word combos, abstract concepts, references
- Consider how the name would look on album covers and merchandise
- Names should be easy to search online and remember
- Avoid generic or overused band name patterns

Return ONLY the 10 band names, one per line, without numbering or explanations.`;

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
    console.error('Band Names API Error:', error);
    return Response.json(
      { error: 'Failed to generate band names. Please try again.' },
      { status: 500 }
    );
  }
}

