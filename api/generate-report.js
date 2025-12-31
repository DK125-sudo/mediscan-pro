export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { age, height, weight, activity } = req.body;

  const prompt = `
You are MediScan Pro, a wellness assistant.
Generate a simple patient health report including:
- BMI calculation
- BMI category
- Basic diet suggestions
- Lifestyle advice
Include a short disclaimer.
Patient data:
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
Activity level: ${activity}
`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();

    res.status(200).json({ text: data[0]?.generated_text || 'No response from AI.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating AI report.' });
  }
}


