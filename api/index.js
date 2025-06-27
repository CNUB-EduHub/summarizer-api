export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST requests are allowed" }), {
      status: 405,
    });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing 'text' in request body" }), {
        status: 400,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OpenAI API key in environment variables" }), {
        status: 500,
      });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      })
    });

    const openaiData = await openaiRes.json();

    if (openaiData.error) {
      return new Response(JSON.stringify({ error: openaiData.error.message || "OpenAI API error" }), {
        status: 500
      });
    }

    const summary = openaiData.choices?.[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
    });
  }
}
