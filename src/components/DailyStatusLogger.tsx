import React, { useState } from 'react';
import { DailyLog, MomentumLevel } from '../types';
import { Check, Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface DailyStatusLoggerProps {
  currentDay: number;
  totalDays: number;
  existingLog?: DailyLog | null;
  onSaveLog: (log: Partial<DailyLog> & { level: MomentumLevel }) => void;
}

export const DailyStatusLogger: React.FC<DailyStatusLoggerProps> = ({
  currentDay,
  totalDays,
  existingLog,
  onSaveLog,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<MomentumLevel>(existingLog?.level || 'MAX');
  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [noveltyUsed, setNoveltyUsed] = useState(existingLog?.noveltyUsed || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectLevel = (level: MomentumLevel) => {
    setSelectedLevel(level);
    audioEngine.playTone(level === 'MAX' ? 659.25 : level === 'STANDARD' ? 523.25 : 440, 'sine', 0.1);
  };

  const handleCommitLog = () => {
    onSaveLog({
      dayNumber: currentDay,
      level: selectedLevel,
      notes: notes.trim() || undefined,
      noveltyUsed: noveltyUsed.trim() || undefined,
    });
    audioEngine.playCompleteFanfare();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="calendly-card p-4 sm:p-6 lg:p-7 space-y-5 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-3.5 sm:pb-4 border-b border-hairline">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-blue shrink-0"></span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-ink-navy tracking-tight leading-snug">
              Day {currentDay} Momentum Check-in & Chain Lock
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-gray mt-1 leading-relaxed">
            Classify today's execution. Under Rule 2 (Never Zero), an MVO day counts as 100% chain defense.
          </p>
        </div>

        {existingLog && (
          <div className="pill-badge shrink-0 self-start sm:self-auto text-xs py-1 px-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-signal-blue shrink-0" />
            <span>Day {currentDay} Locked ({existingLog.level})</span>
          </div>
        )}
      </div>

      {/* 3 Prominent 1-Click Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
        {/* Max Level Card */}
        <button
          type="button"
          onClick={() => handleSelectLevel('MAX')}
          className={`text-left p-3.5 sm:p-4 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
            selectedLevel === 'MAX'
              ? 'bg-[#f0f7ff] border-signal-blue ring-2 ring-signal-blue/20 shadow-sm'
              : 'bg-paper border-hairline hover:border-slate-gray/40 hover:bg-pebble/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Trophy className={`w-4 h-4 shrink-0 ${selectedLevel === 'MAX' ? 'text-signal-blue' : 'text-slate-gray'}`} />
                <span className="font-bold text-sm lg:text-base text-ink-navy truncate">Max Level</span>
              </div>
              <span className="pill-badge text-[10px] font-mono px-1.5 py-0.5 shrink-0">
                100% MS
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-gray mt-2 leading-relaxed">
              Full deep work sprint executed (90–120 mins). Major target conquered with pristine focus.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-hairline text-[11px] sm:text-xs text-slate-gray flex items-center justify-between gap-1">
            <span className="font-medium truncate">90–120m</span>
            {selectedLevel === 'MAX' && (
              <span className="text-signal-blue font-bold flex items-center gap-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
        </button>

        {/* Standard Level Card */}
        <button
          type="button"
          onClick={() => handleSelectLevel('STANDARD')}
          className={`text-left p-3.5 sm:p-4 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
            selectedLevel === 'STANDARD'
              ? 'bg-[#f0f3f8] border-ink-navy ring-2 ring-ink-navy/20 shadow-sm'
              : 'bg-paper border-hairline hover:border-slate-gray/40 hover:bg-pebble/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Award className={`w-4 h-4 shrink-0 ${selectedLevel === 'STANDARD' ? 'text-ink-navy' : 'text-slate-gray'}`} />
                <span className="font-bold text-sm lg:text-base text-ink-navy truncate">Standard</span>
              </div>
              <span className="pill-badge-neutral text-[10px] font-mono px-1.5 py-0.5 shrink-0">
                70% MS
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-gray mt-2 leading-relaxed">
              Solid session completed under standard constraints (45–60 mins). Kept velocity rolling cleanly.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-hairline text-[11px] sm:text-xs text-slate-gray flex items-center justify-between gap-1">
            <span className="font-medium truncate">45–60m</span>
            {selectedLevel === 'STANDARD' && (
              <span className="text-ink-navy font-bold flex items-center gap-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
        </button>

        {/* MVO Level Card */}
        <button
          type="button"
          onClick={() => handleSelectLevel('MVO')}
          className={`text-left p-3.5 sm:p-4 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
            selectedLevel === 'MVO'
              ? 'bg-[#e6f0ff] border-deep-cobalt ring-2 ring-deep-cobalt/20 shadow-sm'
              : 'bg-paper border-hairline hover:border-slate-gray/40 hover:bg-pebble/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className={`w-4 h-4 shrink-0 ${selectedLevel === 'MVO' ? 'text-deep-cobalt' : 'text-slate-gray'}`} />
                <span className="font-bold text-sm lg:text-base text-ink-navy truncate">MVO (Never Zero)</span>
              </div>
              <span className="pill-badge text-[10px] font-mono px-1.5 py-0.5 shrink-0">
                30% MS
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-gray mt-2 leading-relaxed">
              Exhaustion or rescue day. Completed 2–10 min micro-action to safeguard chain continuity.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-hairline text-[11px] sm:text-xs text-slate-gray flex items-center justify-between gap-1">
            <span className="font-medium truncate">2–10m (Rescue)</span>
            {selectedLevel === 'MVO' && (
              <span className="text-deep-cobalt font-bold flex items-center gap-0.5 shrink-0">
                <Check className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Optional Tactical Note & Novelty Reflection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        <div>
          <label className="block text-xs font-semibold text-ink-navy mb-1.5">
            Tactical Reflection / Progress Notes:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Overcame initial drag, reached deep flow smoothly..."
            className="calendly-input w-full text-xs sm:text-sm py-2 px-3"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-navy mb-1.5">
            Rule 4 Novelty Catalyst Used (if any):
          </label>
          <input
            type="text"
            value={noveltyUsed}
            onChange={(e) => setNoveltyUsed(e.target.value)}
            placeholder="E.g. Changed desk lighting, worked standing for 15 mins..."
            className="calendly-input w-full text-xs sm:text-sm py-2 px-3"
          />
        </div>
      </div>

      {/* Commit Check-in Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-gray">
          Locks output for Day {currentDay} and syncs with telemetry dashboard.
        </div>

        <button
          type="button"
          onClick={handleCommitLog}
          className="btn-primary min-h-[42px] w-full sm:w-auto px-5 text-xs sm:text-sm"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Momentum Locked!</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Lock Day {currentDay} Status</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
