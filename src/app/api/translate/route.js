import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: 'Please provide text to translate.' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return Response.json(
        { error: 'Text is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional translator. Translate the following text from ${from} to ${to}.

Rules:
- Provide ONLY the translated text, nothing else
- Maintain the original formatting (line breaks, paragraphs)
- Keep proper nouns unchanged unless they have a standard translation
- Preserve the tone and style of the original text
- If the text contains idioms or cultural expressions, translate them to their natural equivalent in the target language
- If some parts are already in the target language, keep them as-is

Text to translate:
"""
${text.trim()}
"""`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const translation = message.content[0].text.trim();

    return Response.json({ translation });

  } catch (error) {
    console.error('Translate API Error:', error);
    return Response.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
}
