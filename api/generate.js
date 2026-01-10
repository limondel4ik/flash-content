export default async function handler(req, res) {
  // Дозволяємо лише POST запити для безпеки
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не дозволений' });
  }

  const { prompt } = req.body;
  
  // Ключ береться безпечно з налаштувань Vercel Environment Variables
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API ключ не налаштовано у Vercel" });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'Ти професійний український копірайтер. Пиши рекламні пости чітко, з емодзі та закликом до дії.' 
          },
          { 
            role: 'user', 
            content: `Напиши рекламний пост про: ${prompt}` 
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Повертаємо чистий текст для твоєї сторінки
    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: "Сталася помилка при генерації тексту" });
  }
}
