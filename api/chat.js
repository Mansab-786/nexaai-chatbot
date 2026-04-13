export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 500 }
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw:", JSON.stringify(data));

    if (data.error) {
      return res.status(200).json({ content: [{ text: "Error: " + data.error.message }] });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    return res.status(200).json({ content: [{ text }] });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
