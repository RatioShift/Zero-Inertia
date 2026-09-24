import React, { useState } from 'react';
import { Mission, PhaseConfig, MvoDeconstruction } from '../types';
import { Sparkles, Play, Volume2, VolumeX, RefreshCw, Lightbulb, Brain } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface DailyTargetSectionProps {
  mission: Mission;
  currentPhase: PhaseConfig;
  dayInMission: number;
  initialTarget?: string;
  initialMvo?: MvoDeconstruction | null;
  onSaveMvoDeconstruction: (target: string, deconstruction: MvoDeconstruction) => void;
  onTriggerEmergencyWithTask: (taskName: string) => void;
}

export const DailyTargetSection: React.FC<DailyTargetSectionProps> = ({
  mission,
  currentPhase,
  dayInMission,
  initialTarget = '',
  initialMvo = null,
  onSaveMvoDeconstruction,
  onTriggerEmergencyWithTask,
}) => {
  const [targetInput, setTargetInput] = useState(initialTarget);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'normal' | 'high'>('low');
  const [isLoading, setIsLoading] = useState(false);
  const [deconstruction, setDeconstruction] = useState<MvoDeconstruction | null>(initialMvo);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeconstruct = async () => {
    if (!targetInput.trim()) {
      setErrorMsg('Please enter your primary target for today.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/mvo-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetInput.trim(),
          missionName: mission.name,
          currentPhase: currentPhase.name,
          currentDay: dayInMission,
          energyLevel,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setDeconstruction(result.data);
        onSaveMvoDeconstruction(targetInput.trim(), result.data);
      } else {
        throw new Error(result.error || 'Failed to generate MVO deconstruction.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Operating with offline neuro-friction protocol.');
      const fallbackMvo: MvoDeconstruction = {
        microMvo: `Open your workspace and draft the first 3 lines of ${targetInput.slice(0, 32)} without judging quality.`,
        standardTarget: `Complete 45 minutes of unbroken focus on ${targetInput.slice(0, 40)}.`,
        maxTarget: `Finish the full scope of ${targetInput} with thorough review.`,
        frictionDiagnosis: 'Cognitive drag occurs when facing an abstract goal. The 2-minute MVO lowers activation energy to zero.',
        noveltyInjection: 'Switch seating posture or relocate to a clean desk for the first 20 minutes.',
        commandMantra: 'Do not negotiate with initial resistance. Step 1 takes only 120 seconds.',
      };
      setDeconstruction(fallbackMvo);
      onSaveMvoDeconstruction(targetInput.trim(), fallbackMvo);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoiceBriefing = async () => {
    if (!deconstruction) return;

    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const spokenText = `Commander, here is your Day ${dayInMission} directive. Today's primary target is ${targetInput}. Your 2-minute Micro MVO is: ${deconstruction.microMvo}. Remember, ${deconstruction.commandMantra}. Break inertia immediately.`;

    try {
      await audioEngine.playGeminiTTS(spokenText, 'Puck');
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="calendly-card p-6 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Decorative Warm Blob behind card */}
      <div className="absolute top-1/2 -right-16 w-48 h-48 blob-cyan rounded-full -translate-y-1/2" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-blue"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-ink-navy tracking-tight">
              Day {dayInMission} Target & 2-Minute Friction Breaker
            </h2>
          </div>
          <p className="text-sm text-slate-gray mt-1">
            Turn any heavy objective into a frictionless 120-second start.
          </p>
        </div>

        {/* Energy Level Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-pebble border border-hairline rounded-[8px] self-start sm:self-auto shrink-0">
          <span className="text-xs font-semibold text-slate-gray px-2">Energy:</span>
          <button
            type="button"
            onClick={() => setEnergyLevel('low')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              energyLevel === 'low'
                ? 'bg-paper text-signal-blue shadow-sm border border-hairline'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Low
          </button>
          <button
            type="button"
            onClick={() => setEnergyLevel('normal')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              energyLevel === 'normal'
                ? 'bg-paper text-signal-blue shadow-sm border border-hairline'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => setEnergyLevel('high')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              energyLevel === 'high'
                ? 'bg-paper text-signal-blue shadow-sm border border-hairline'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            High
          </button>
        </div>
      </div>

      {/* Target Input Box & Main Action */}
      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <input
          type="text"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDeconstruct()}
          placeholder="What is your primary focus or work objective today?"
          className="calendly-input flex-1 min-h-[46px] text-base placeholder:text-mist-gray"
        />

        <button
          type="button"
          onClick={handleDeconstruct}
          disabled={isLoading}
          className="btn-primary min-h-[46px] px-5 text-sm shrink-0"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Deconstructing...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Generate 2-Min MVO</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="text-xs text-ink-navy bg-pebble border border-hairline p-3 rounded-[8px]">
          {errorMsg}
        </div>
      )}

      {/* Deconstructed Results Section */}
      {deconstruction && (
        <div className="space-y-4 pt-2 relative z-10">
          {/* Primary Micro MVO Banner */}
          <div className="calendly-card-sm p-5 sm:p-6 bg-gradient-to-r from-[#f0f7ff] to-paper border border-[#c3daf5] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="pill-badge">
                  Rule 1: 120-Second Activation
                </span>
                <span className="text-xs text-slate-gray">Zero-guilt permission to quit after 2 minutes</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-ink-navy leading-snug">
                "{deconstruction.microMvo}"
              </p>
              <p className="text-xs text-slate-gray italic">
                Mantra: {deconstruction.commandMantra}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={handlePlayVoiceBriefing}
                className="btn-outline text-xs py-2 px-3"
                title="Play vocal audio directive"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-signal-blue animate-pulse" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-signal-blue" />
                    <span>Voice Directive</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onTriggerEmergencyWithTask(deconstruction.microMvo)}
                className="btn-dark text-xs py-2 px-3 sm:px-4"
              >
                <Play className="w-3.5 h-3.5 fill-current text-signal-blue" />
                <span>Start 120s Timer</span>
              </button>
            </div>
          </div>

          {/* 3-Tier Execution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Micro MVO Card */}
            <div className="calendly-card-sm p-4 bg-paper space-y-1.5 border border-hairline">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-signal-blue">Minimum Viable (30%)</span>
                <span className="font-mono text-slate-gray text-[11px]">2–10 Mins</span>
              </div>
              <p className="text-xs text-ink-navy leading-relaxed font-medium">
                {deconstruction.microMvo}
              </p>
            </div>

            {/* Standard Pace Card */}
            <div className="calendly-card-sm p-4 bg-paper space-y-1.5 border border-hairline">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink-navy">Standard Pace (70%)</span>
                <span className="font-mono text-slate-gray text-[11px]">45–60 Mins</span>
              </div>
              <p className="text-xs text-ink-navy leading-relaxed font-medium">
                {deconstruction.standardTarget}
              </p>
            </div>

            {/* Max Output Card */}
            <div className="calendly-card-sm p-4 bg-paper space-y-1.5 border border-hairline">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-deep-cobalt">Max Deep Work (100%)</span>
                <span className="font-mono text-slate-gray text-[11px]">90–120 Mins</span>
              </div>
              <p className="text-xs text-ink-navy leading-relaxed font-medium">
                {deconstruction.maxTarget}
              </p>
            </div>
          </div>

          {/* Friction Diagnosis & Rule 4 Novelty Injection */}
          {(deconstruction.frictionDiagnosis || deconstruction.noveltyInjection) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {deconstruction.frictionDiagnosis && (
                <div className="calendly-card-inner p-3.5">
                  <div className="font-bold text-ink-navy mb-1 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-signal-blue" />
                    <span>Neuro Diagnosis:</span>
                  </div>
                  <p className="leading-relaxed text-slate-gray">{deconstruction.frictionDiagnosis}</p>
                </div>
              )}
              {deconstruction.noveltyInjection && (
                <div className="calendly-card-inner p-3.5">
                  <div className="font-bold text-ink-navy mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Rule 4 Novelty Catalyst:</span>
                  </div>
                  <p className="leading-relaxed text-slate-gray">{deconstruction.noveltyInjection}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
