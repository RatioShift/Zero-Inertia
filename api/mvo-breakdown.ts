import type { VercelRequest, VercelResponse } from './types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { target, missionName, currentPhase, currentDay, energyLevel } = req.body;

    if (!target || typeof target !== 'string') {
      return res.status(400).json({ error: 'Target description is required.' });
    }

    const prompt = `You are the Tactical AI Engine for "Project: Zero Inertia" (Mission: ${missionName || 'Unbound'}, Phase: ${currentPhase || 'Phase A: Ignition'}, Day: ${currentDay || 1}).
User's energy/resistance level: ${energyLevel || 'normal'}.
User's target for today: "${target}".

Your objective:
1. Break this target down into an absolute Minimum Viable Output (MVO) that takes under 2 MINUTES to execute with ZERO cognitive friction.
2. Define the Standard Level (70% output).
3. Define the Max Level (100% full execution).
4. Provide a 1-sentence cognitive friction diagnosis.
5. Suggest 1 novelty injection (a micro-change in environment or posture to reignite dopamine).
6. Give a 1-line tactical command mantra.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            microMvo: { type: Type.STRING },
            standardTarget: { type: Type.STRING },
            maxTarget: { type: Type.STRING },
            frictionDiagnosis: { type: Type.STRING },
            noveltyInjection: { type: Type.STRING },
            commandMantra: { type: Type.STRING },
          },
          required: ['microMvo', 'standardTarget', 'maxTarget', 'frictionDiagnosis', 'noveltyInjection', 'commandMantra'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('MVO breakdown error:', error);
    return res.json({
      success: true,
      data: {
        microMvo: 'Open the primary document or workspace file and write/inspect just 3 lines without judgment.',
        standardTarget: 'Complete 30-45 minutes of focused work with no browser distractions.',
        maxTarget: 'Full 90-120 minute deep work completion of the main milestone.',
        frictionDiagnosis: 'Activation energy is currently high; starting for just 120 seconds resets dopamine baseline.',
        noveltyInjection: 'Change your desk position, switch to warm background light, or set a 15-minute standing timer.',
        commandMantra: 'Action creates motivation. Do not negotiate with inertia—execute the 2-minute trigger now.',
      },
    });
  }
}
