import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface EmergencyBreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTaskName?: string;
  onSaveMvoComplete: (taskName: string) => void;
}

export const EmergencyBreakerModal: React.FC<EmergencyBreakerModalProps> = ({
  isOpen,
  onClose,
  defaultTaskName = '',
  onSaveMvoComplete,
}) => {
  const [taskName, setTaskName] = useState(defaultTaskName);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachData, setCoachData] = useState<{
    title: string;
    step1: string;
    step2: string;
    step3: string;
    neuroReframe: string;
    speechScript: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTaskName(defaultTaskName || 'Immediate Friction Breaker');
      setSecondsLeft(120);
      setIsRunning(true);
      setIsCompleted(false);
      fetchEmergencyCoach(defaultTaskName || 'Immediate Friction Breaker');
      audioEngine.playTone(880, 'triangle', 0.2);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      audioEngine.stop();
      setIsRunning(false);
      setIsPlayingAudio(false);
    }
  }, [isOpen, defaultTaskName]);

  const fetchEmergencyCoach = async (currentTask: string) => {
    setIsLoadingCoach(true);
    try {
      const res = await fetch('/api/emergency-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: currentTask,
          resistanceType: 'Acute behavioral friction and dopamine deficit',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCoachData(data.data);
      }
    } catch (e) {
      console.error(e);
      setCoachData({
        title: 'Emergency 120-Second Friction Breaker',
        step1: 'Sit down, plant both feet flat, and bring your hands onto your keyboard or workspace.',
        step2: 'Open only the single required file and read or write 1 line. No judgments.',
        step3: 'Keep your hands moving for 60 seconds without checking tabs or notifications.',
        neuroReframe: 'Inertia is mechanical friction, not lack of character. Turn the wheel 2 minutes and momentum takes over.',
        speechScript: 'Inertia breaker engaged. Do not negotiate with resistance. Touch your keyboard and do step one now.',
      });
    } finally {
      setIsLoadingCoach(false);
    }
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            audioEngine.playCompleteFanfare();
            return 0;
          }
          if (prev <= 10 || prev % 30 === 0) {
            audioEngine.playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPct = ((120 - secondsLeft) / 120) * 100;

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
      return;
    }

    if (!coachData) return;
    setIsPlayingAudio(true);
    const textToSpeak = `Inertia breaker initiated for ${taskName}. Step one: ${coachData.step1}. Step two: ${coachData.step2}. Remember: ${coachData.neuroReframe}. You have two minutes. Begin now.`;

    try {
      await audioEngine.playGeminiTTS(textToSpeak, 'Puck');
    } catch {
      // handled inside audio utility
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleReset = () => {
    setSecondsLeft(120);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handleSaveMvo = () => {
    onSaveMvoComplete(taskName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col bg-paper">
        {/* Top Header Bar */}
        <div className="bg-ink-navy text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal-blue"></span>
            </span>
            <div className="text-xs font-bold tracking-wider uppercase">
              Rule 1: Emergency 120-Second Friction Breaker
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          {/* Target Task Banner */}
          <div className="calendly-card-inner p-3.5 flex items-center justify-between gap-3">
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase text-slate-gray tracking-wider">
                Immediate Target Scope
              </span>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What is your immediate 2-minute action?"
                className="w-full bg-transparent text-sm font-bold text-ink-navy outline-none mt-0.5 focus:text-signal-blue"
              />
            </div>
            <button
              onClick={handleToggleAudio}
              className={`btn-outline text-xs py-2 px-3 gap-1.5 ${
                isPlayingAudio ? 'bg-signal-blue text-white border-signal-blue' : ''
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-signal-blue" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Mute Voice' : 'Voice SOP'}</span>
            </button>
          </div>

          {/* Central 120-Second Countdown Module */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e6edf5"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#006bff"
                  strokeWidth="8"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progressPct) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Time Display Inside Ring */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-bold text-4xl text-ink-navy tracking-tight tabular-nums">
                  {timeFormatted}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-gray mt-1">
                  {isCompleted ? 'Inertia 0.00' : isRunning ? 'Countdown' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="btn-outline text-xs py-2 px-4 gap-1.5"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current text-ink-navy" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-signal-blue" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="btn-outline text-xs py-2 px-3"
                title="Reset to 120s"
              >
                <RotateCcw className="w-4 h-4 text-slate-gray" />
              </button>
            </div>
          </div>

          {/* 3-Step Live Action Protocol */}
          {coachData && (
            <div className="calendly-card-inner p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-gray">
                <span className="font-bold text-ink-navy uppercase">
                  Tactical 120s Operating Sequence
                </span>
                <span className="pill-badge text-[11px]">Zero Guilt Protocol</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className={`p-3.5 rounded-[12px] border transition-all ${
                  secondsLeft > 90 ? 'bg-paper border-signal-blue shadow-xs' : 'bg-paper/60 border-hairline text-slate-gray'
                }`}>
                  <div className="font-bold text-signal-blue mb-1">01. Seconds 0–30</div>
                  <p className="leading-relaxed text-ink-navy">{coachData.step1}</p>
                </div>

                <div className={`p-3.5 rounded-[12px] border transition-all ${
                  secondsLeft <= 90 && secondsLeft > 30 ? 'bg-paper border-signal-blue shadow-xs' : 'bg-paper/60 border-hairline text-slate-gray'
                }`}>
                  <div className="font-bold text-signal-blue mb-1">02. Seconds 30–90</div>
                  <p className="leading-relaxed text-ink-navy">{coachData.step2}</p>
                </div>

                <div className={`p-3.5 rounded-[12px] border transition-all ${
                  secondsLeft <= 30 ? 'bg-paper border-signal-blue shadow-xs' : 'bg-paper/60 border-hairline text-slate-gray'
                }`}>
                  <div className="font-bold text-signal-blue mb-1">03. Seconds 90–120</div>
                  <p className="leading-relaxed text-ink-navy">{coachData.step3}</p>
                </div>
              </div>

              {/* Neuro Reframe Note */}
              <div className="pt-2 border-t border-hairline text-xs text-slate-gray italic flex items-center gap-1.5">
                <span className="text-signal-blue font-bold not-italic">Cognitive Reframe:</span>
                "{coachData.neuroReframe}"
              </div>
            </div>
          )}

          {/* Post-120s Resolution Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleSaveMvo}
              className="btn-outline w-full sm:w-auto text-xs py-2.5 px-4"
            >
              <CheckCircle2 className="w-4 h-4 text-deep-cobalt" />
              <span>Record 2-Min MVO & Save Chain</span>
            </button>

            <button
              onClick={() => {
                onSaveMvoComplete(taskName);
                onClose();
              }}
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Inertia Broken: Keep Flowing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
