import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { description } = await request.json();

    if (!description || description.trim().length < 3) {
      return Response.json(
        { error: 'Please provide a channel description' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `Based on this channel concept: "${description}"

Generate 6 unique YouTube channel ideas with the following for each:
1. Channel Name (catchy and memorable)
2. Niche/Category
3. Content Ideas (3-4 specific video ideas)
4. Target Audience
5. Monetization Potential (Low/Medium/High)

Format each idea as:
IDEA [number]
Name: [channel name]
Niche: [category]
Content: [video idea 1], [video idea 2], [video idea 3]
Audience: [target demographic]
Potential: [monetization level]

Be creative and think of unique angles that haven't been overdone. Focus on trending topics in 2025/2026 and emerging niches.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    
    // Parse the response into structured ideas
    const ideas = parseChannelIdeas(responseText);

    return Response.json({ ideas, raw: responseText });
  } catch (error) {
    console.error('YouTube Ideas API Error:', error);
    return Response.json(
      { error: 'Failed to generate ideas. Please try again.' },
      { status: 500 }
    );
  }
}

function parseChannelIdeas(text) {
  const ideas = [];
  const ideaBlocks = text.split(/IDEA \d+/i).filter(block => block.trim());
  
  for (const block of ideaBlocks) {
    const nameMatch = block.match(/Name:\s*(.+)/i);
    const nicheMatch = block.match(/Niche:\s*(.+)/i);
    const contentMatch = block.match(/Content:\s*(.+)/i);
    const audienceMatch = block.match(/Audience:\s*(.+)/i);
    const potentialMatch = block.match(/Potential:\s*(.+)/i);
    
    if (nameMatch) {
      ideas.push({
        name: nameMatch[1].trim(),
        niche: nicheMatch ? nicheMatch[1].trim() : '',
        content: contentMatch ? contentMatch[1].trim() : '',
        audience: audienceMatch ? audienceMatch[1].trim() : '',
        potential: potentialMatch ? potentialMatch[1].trim() : 'Medium',
      });
    }
  }
  
  return ideas;
}

