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
            content: `Ти — геніальний копірайтер та маркетолог. 
            Твоє завдання: написати вогняний рекламний пост українською мовою.
            
            СТРУКТУРА ПОСТА:
            1. Чіпляючий заголовок, що б'є в біль або бажання клієнта.
            2. Основна частина за формулою AIDA (Attention, Interest, Desire, Action).
            3. Список переваг через емодзі.
            4. Потужний заклик до дії (CTA).
            
            СТИЛЬ: Дружній, енергійний, без "води". Використовуй емодзі, але в міру.` 
          },
          { role: "user", content: "Напиши професійний пост про: " + prompt }
        ],
        temperature: 0.7, // Додає креативності
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
