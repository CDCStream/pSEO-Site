import { readFileSync } from 'fs';
import { join } from 'path';

const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, crime, alias, reward, lastSeen, photo } = body;

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Please provide a name' }, { status: 400 });
    }

    const templatePath = join(process.cwd(), 'public', 'memes', 'wanted-poster-templete.png');
    const templateBase64 = readFileSync(templatePath).toString('base64');

    const parts = [];

    let prompt = `You are given a wanted poster template image. Edit this poster by replacing the existing placeholder text with the following custom information. Keep the EXACT same poster design, layout, decorative elements, borders, wood background, parchment texture, and vintage western style. Only change the text content.

Replace these fields on the poster:
- Replace "AARON LOEB" with: "${name.trim().toUpperCase()}"`;

    if (crime) prompt += `\n- Replace "FOR CRIMES OF FUN AND MISCHIEF" with: "FOR ${crime.trim().toUpperCase()}"`;
    else prompt += `\n- Remove the "FOR CRIMES OF FUN AND MISCHIEF" text completely`;

    if (alias) prompt += `\n- Replace 'A.K.A. "THE BURGER BANDIT"' with: 'A.K.A. "${alias.trim().toUpperCase()}"'`;
    else prompt += `\n- Remove the A.K.A. text completely`;

    if (reward) prompt += `\n- Replace "A FRONT-ROW SEAT AT THE BBQ AND UNLIMITED RIBS" with: "${reward.trim().toUpperCase()}"`;
    else prompt += `\n- Remove the reward description text (keep the "REWARD" label)`;

    if (lastSeen) prompt += `\n- Replace "LAST SEEN: SNEAKING EXTRA HOT DOGS AT THE BBQ PARTY" with: "LAST SEEN: ${lastSeen.trim().toUpperCase()}"`;
    else prompt += `\n- Remove the "LAST SEEN" text completely`;

    prompt += `\n\nKeep everything else exactly the same: the "WANTED!" header, the "RONCELLE NEWS" text, the stars, the ornamental frame, the wood plank background, the parchment paper texture, and the "REPORT SIGHTINGS TO" section.`;

    if (photo) {
      prompt += `\n\nAlso replace the empty photo frame area in the center of the poster with the provided person's photo. Fit the photo naturally inside the ornamental frame.`;
    }

    parts.push({ text: prompt });
    parts.push({
      inlineData: { mimeType: 'image/png', data: templateBase64 }
    });

    if (photo) {
      const photoMatch = photo.match(/^data:image\/(.*?);base64,(.*)$/);
      if (photoMatch) {
        parts.push({
          inlineData: { mimeType: `image/${photoMatch[1]}`, data: photoMatch[2] }
        });
      }
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return Response.json({ error: 'Image generation failed' }, { status: 500 });
    }

    const geminiData = await geminiRes.json();

    const candidates = geminiData.candidates;
    if (!candidates || candidates.length === 0) {
      return Response.json({ error: 'No image generated' }, { status: 500 });
    }

    const resultParts = candidates[0].content?.parts || [];
    const imagePart = resultParts.find(p => p.inlineData);

    if (!imagePart) {
      return Response.json({ error: 'No image in response' }, { status: 500 });
    }

    return Response.json({
      image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
    });
  } catch (error) {
    console.error('Wanted Poster API Error:', error);
    return Response.json(
      { error: 'Failed to generate poster. Please try again.' },
      { status: 500 }
    );
  }
}
