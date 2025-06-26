export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { text } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Summarize the following in bullet points:\n\n${text}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || 'No summary found.';

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
