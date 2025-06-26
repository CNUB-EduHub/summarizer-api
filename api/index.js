// api/index.js

import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Only POST allowed' }), {
      status: 405,
    });
  }

  try {
    const { text } = await req.json();

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

    return new NextResponse(JSON.stringify({ summary }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
    });
  }
}
