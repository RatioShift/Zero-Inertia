import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio dev server strictly runs on port 3000
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * 1. AI Micro-MVO Generator
 * Decomposes daily target into 2-min frictionless MVO, standard, and max levels.
 */
app.post('/api/mvo-breakdown', async (req, res) => {
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
4. Provide a 1-sentence cognitive friction diagnosis (why the brain is resisting and how the 2-minute MVO bypasses the limbic system).
5. Suggest 1 novelty injection (a micro-change in environment, lighting, tools, or posture to reignite dopamine without distraction).
6. Give a 1-line tactical command mantra.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            microMvo: {
              type: Type.STRING,
              description: 'The exact frictionless 2-minute micro action to start immediately.',
            },
            standardTarget: {
              type: Type.STRING,
              description: 'The 70% standard accomplishment milestone.',
            },
            maxTarget: {
              type: Type.STRING,
              description: 'The 100% full focus target accomplishment.',
            },
            frictionDiagnosis: {
              type: Type.STRING,
              description: 'Cognitive diagnosis explaining how this lowers the activation energy barrier.',
            },
            noveltyInjection: {
              type: Type.STRING,
              description: 'A physical or environmental novelty tweak (e.g. ambient lighting, standing posture, music).',
            },
            commandMantra: {
              type: Type.STRING,
              description: 'A sharp, powerful one-sentence executive command.',
            },
          },
          required: ['microMvo', 'standardTarget', 'maxTarget', 'frictionDiagnosis', 'noveltyInjection', 'commandMantra'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating MVO breakdown:', error);
    // Provide a solid fail-safe response if API fails
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
});

/**
 * 2. Instant 2-Minute Inertia Emergency Coach
 * Ultra low-latency response using gemini-3.1-flash-lite for instant response during panic/laziness.
 */
app.post('/api/emergency-coach', async (req, res) => {
  try {
    const { taskName, resistanceType } = req.body;

    const prompt = `System: Project Zero Inertia Emergency Protocol.
User is experiencing acute behavioral resistance / laziness right now.
Task at hand: "${taskName || 'Unspecified Critical Task'}".
Resistance state: "${resistanceType || 'Lethargy / Procrastination loop'}".

Deliver a rapid tactical 3-step action protocol for the immediate 120-second window.
Each step must be hyper-concrete, physical, and requiring zero decision-making:
- Step 1 (0-30s): Physical workspace adjustment / file open.
- Step 2 (30-90s): Micro-action that takes 1 keystroke or single movement.
- Step 3 (90-120s): Sustaining the momentum click.
Include a brief neuro-reframe and a 20-word voice script.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
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

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating emergency protocol:', error);
    return res.json({
      success: true,
      data: {
        title: 'Emergency 120-Second Friction Breaker',
        step1: 'Take a deep breath, sit straight, and bring your hands onto your keyboard or workspace.',
        step2: 'Open only the single required file and write 1 line or read 1 paragraph. Nothing else.',
        step3: 'Keep your hands moving for 60 seconds without checking notifications.',
        neuroReframe: 'Inertia is mechanical resistance, not lack of willpower. Once the wheel turns 2 minutes, momentum takes over.',
        speechScript: 'Inertia breaker initiated. Do not negotiate. Open the workspace now and touch the keys for one hundred and twenty seconds.',
      },
    });
  }
});

/**
 * 3. Text-to-Speech (TTS) Endpoint
 * Uses gemini-3.8-flash-tts as explicitly instructed by user.
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, speaker = 'Puck', style = 'Focused tactical executive coach' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required for TTS.' });
    }

    const cleanText = text.slice(0, 400); // Keep focused for rapid audio delivery

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: speaker },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({ success: true, audio: base64Audio, mimeType: 'audio/mp3' });
    } else {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS.' });
    }
  } catch (error: any) {
    console.warn('Gemini TTS model error, notifying client for Web Speech fallback:', error?.message);
    return res.status(503).json({ error: error?.message || 'TTS generation unavailable', fallbackWebSpeech: true });
  }
});

/**
 * 4. 24-Hour Reset & Dopamine Recovery Advisor
 * Handles fail-safe recovery when a day is missed or dopamine crashes.
 */
app.post('/api/fail-safe-reset', async (req, res) => {
  try {
    const { missedDays, reason, missionName } = req.body;

    const prompt = `System: Project Zero Inertia - 24-Hour Reset & Recovery Protocol.
Mission: ${missionName || 'Unbound'}.
Missed Days: ${missedDays || 1}.
Reported reason/feeling: "${reason || 'Mental fatigue / lost momentum'}".

Explain:
1. Why 1 missed day is an anomaly, but 2 missed days is the beginning of a new negative habit (The 24-Hour Reset Rule).
2. Exact 3-point Emergency Protocol for today to resurrect the chain immediately.
3. Dopamine Crash protocol (tactical steps to restore baseline dopamine without cheap thrills).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resetMotto: { type: Type.STRING },
            recoverySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            dopamineRegimen: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            encouragement: { type: Type.STRING },
          },
          required: ['resetMotto', 'recoverySteps', 'dopamineRegimen', 'encouragement'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating fail-safe recovery:', error);
    return res.json({
      success: true,
      data: {
        resetMotto: 'A missed day is an accident; two missed days is a new habit. Reset within 24 hours.',
        recoverySteps: [
          'Execute the Minimum Viable Output (MVO) immediately—even just 2 minutes counts as a chain save.',
          'Zero guilt loop: eliminate retroactive rumination and focus strictly on the next 120 seconds.',
          'Log your status as MVO for today to lock the chain in local storage.',
        ],
        dopamineRegimen: [
          '20-minute physical walk with zero podcasts, reels, or music.',
          'Cold water splash to reset the parasympathetic nervous system.',
          'Delay all high-stimulation rewards until the daily MVO is logged.',
        ],
        encouragement: 'The mission is alive as long as you do not surrender day two. Execute MVO now.',
      },
    });
  }
});

// Mount Vite or static server
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Project: Zero Inertia] Tactical Console running on http://0.0.0.0:${PORT}`);
});
