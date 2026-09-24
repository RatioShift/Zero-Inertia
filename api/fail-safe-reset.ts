import type { VercelRequest, VercelResponse } from './types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { missedDays, reason, missionName } = req.body;
    const prompt = `System: Project Zero Inertia - 24-Hour Reset & Recovery.
Mission: ${missionName || 'Unbound'}. Missed Days: ${missedDays || 1}.
Reason: "${reason || 'Mental fatigue'}".
Provide: 1) Why missing day 2 starts a new negative habit. 2) 3-point Emergency Protocol. 3) Dopamine Crash protocol.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resetMotto: { type: Type.STRING },
            recoverySteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            dopamineRegimen: { type: Type.ARRAY, items: { type: Type.STRING } },
            encouragement: { type: Type.STRING },
          },
          required: ['resetMotto', 'recoverySteps', 'dopamineRegimen', 'encouragement'],
        },
      },
    });

    return res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch {
    return res.json({
      success: true,
      data: {
        resetMotto: 'A missed day is an accident; two missed days is a new habit. Reset within 24 hours.',
        recoverySteps: [
          'Execute MVO immediately—even just 2 minutes counts as a chain save.',
          'Zero guilt loop: eliminate retroactive rumination and focus on the next 120 seconds.',
          'Log your status as MVO for today to lock the chain.',
        ],
        dopamineRegimen: [
          '20-minute physical walk with zero podcasts or music.',
          'Cold water splash to reset the parasympathetic nervous system.',
          'Delay all high-stimulation rewards until the daily MVO is logged.',
        ],
        encouragement: 'The mission is alive as long as you do not surrender day two. Execute MVO now.',
      },
    });
  }
}
