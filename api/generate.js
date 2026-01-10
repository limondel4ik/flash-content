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
          { 
            role: "system", 
            content: `Ти — універсальний ШІ-маркетолог. 
            Твоє завдання: адаптувати текст під запит користувача.
            
            ПРАВИЛА:
            1. Якщо запит стосується соцмереж (Instagram, FB, TikTok) — використовуй емодзі, абзаци та додавай хештеги.
            2. Якщо запит стосується сайту або статті — пиши в діловому, переконливому стилі.
            3. Якщо запит про сценарій — розпиши план дій по секундах або кадрах.
            4. Завжди використовуй заклики до дії (CTA).
            
            МОВА: Тільки українська. СТИЛЬ: Професійний, чіткий, без води.` 
          },
          { role: "user", content: "Виконай завдання: " + prompt }
        ],
        temperature: 0.7,
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
