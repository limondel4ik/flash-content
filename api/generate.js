export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { prompt } = await req.json();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ти професійний ШІ-маркетолог. Пиши привабливі рекламні пости українською мовою з використанням емодзі та закликів до дії." },
          { role: "user", content: "Напиши пост про: " + prompt }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
