import type { VercelRequest, VercelResponse } from './types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { taskName, resistanceType } = req.body;

    const prompt = `System: Project Zero Inertia Emergency Protocol.
User is experiencing acute behavioral resistance right now.
Task: "${taskName || 'Unspecified Critical Task'}". Resistance: "${resistanceType || 'Lethargy / Procrastination'}".
Deliver a rapid 3-step 120-second action protocol. Each step must be hyper-concrete and require zero decision-making.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            step1: { type: Type.STRING },
            step2: { type: Type.STRING },
            step3: { type: Type.STRING },
            neuroReframe: { type: Type.STRING },
            speechScript: { type: Type.STRING },
          },
          required: ['title', 'step1', 'step2', 'step3', 'neuroReframe', 'speechScript'],
        },
      },
    });

    return res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch {
    return res.json({
      success: true,
      data: {
        title: 'Emergency 120-Second Friction Breaker',
        step1: 'Sit straight, take a deep breath, and bring your hands onto your keyboard.',
        step2: 'Open only the single required file and write 1 line. Nothing else.',
        step3: 'Keep your hands moving for 60 seconds without checking notifications.',
        neuroReframe: 'Inertia is mechanical resistance, not lack of willpower. Once the wheel turns 2 minutes, momentum takes over.',
        speechScript: 'Inertia breaker initiated. Open the workspace now and touch the keys for one hundred and twenty seconds.',
      },
    });
  }
}
