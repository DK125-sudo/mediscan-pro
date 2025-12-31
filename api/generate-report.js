export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const p = req.body;

  const prompt = `
You are MediScan Pro, a wellness assistant.
Do NOT diagnose diseases.
Do NOT prescribe medicines.
Give only general lifestyle advice.
Always include a disclaimer.

Patient data:
Age: ${p.age}
Height: ${p.height}
Weight: ${p.weight}
Activity: ${p.activity}

Generate a simple wellness report.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ text: data.choices[0].message.content });
}
