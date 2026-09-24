import React, { useState } from 'react';
import { Mission, DailyLog } from '../types';
import { Calendar, Trophy, Award, Sparkles, ArrowRight } from 'lucide-react';

interface ChainMatrixProps {
  mission: Mission;
  logs: DailyLog[];
  currentDay: number;
  onSelectDayToLog?: (day: number) => void;
}

export const ChainMatrix: React.FC<ChainMatrixProps> = ({
  mission,
  logs,
  currentDay,
  onSelectDayToLog,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(currentDay);
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'phase-a' | 'phase-b' | 'phase-c'>('all');

  const logMap = new Map<number, DailyLog>();
  logs.forEach((l) => logMap.set(l.dayNumber, l));

  const selectedLog = logMap.get(selectedDayNumber);

  // Helper to determine day's phase
  const getDayPhase = (day: number) => {
    return mission.phases.find((p) => day >= p.startDay && day <= p.endDay) || mission.phases[0];
  };

  // Helper to determine day appearance based on Calendly theme
  const getDayColor = (day: number) => {
    const log = logMap.get(day);
    if (!log) {
      if (day === currentDay) {
        return 'bg-paper border-2 border-signal-blue text-signal-blue ring-4 ring-signal-blue/15 font-bold shadow-sm';
      }
      if (day < currentDay) {
        return 'bg-pebble border-hairline text-slate-gray/60 hover:border-slate-gray/40';
      }
      return 'bg-paper border-hairline text-slate-gray/80 hover:border-signal-blue/50';
    }

    switch (log.level) {
      case 'MAX':
        return 'bg-ink-navy border-ink-navy text-white font-bold shadow-sm';
      case 'STANDARD':
        return 'bg-signal-blue border-signal-blue text-white font-bold shadow-sm';
      case 'MVO':
        return 'bg-[#e6f0ff] border-[#b8d5ff] text-deep-cobalt font-bold shadow-xs';
      case 'MISSED':
        return 'bg-rose-50 border-rose-300 text-rose-700';
      default:
        return 'bg-paper border-hairline text-slate-gray';
    }
  };

  const daysArray = Array.from({ length: mission.totalDays }, (_, i) => i + 1);

  const filteredDays = daysArray.filter((day) => {
    if (phaseFilter === 'all') return true;
    const phase = getDayPhase(day);
    return phase.id === phaseFilter;
  });

  return (
    <div className="calendly-card p-6 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -top-12 -right-12 w-48 h-48 blob-magenta rounded-full" />

      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-signal-blue" />
            <h2 className="text-xl sm:text-2xl font-bold text-ink-navy tracking-tight">
              {mission.name} — Visual Chain Matrix ({mission.totalDays} Days)
            </h2>
          </div>
          <p className="text-sm text-slate-gray mt-1">
            Visual neuro-chain: Jerry Seinfeld's "Don't Break The Chain" engineered with Rule 2 Never-Zero backup.
          </p>
        </div>

        {/* Phase Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-pebble border border-hairline rounded-[8px] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setPhaseFilter('all')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              phaseFilter === 'all' ? 'bg-paper text-signal-blue shadow-sm border border-hairline' : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('phase-a')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              phaseFilter === 'phase-a' ? 'bg-paper text-signal-blue shadow-sm border border-hairline' : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Phase A
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('phase-b')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              phaseFilter === 'phase-b' ? 'bg-paper text-signal-blue shadow-sm border border-hairline' : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Phase B
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('phase-c')}
            className={`min-h-[34px] px-3 py-1 text-xs rounded-[6px] font-semibold transition-all cursor-pointer ${
              phaseFilter === 'phase-c' ? 'bg-paper text-signal-blue shadow-sm border border-hairline' : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Phase C
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-gray relative z-10">
        <span className="font-semibold text-ink-navy">Chain Code:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-ink-navy inline-block"></span>
          <span className="font-medium">Max (100%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-signal-blue inline-block"></span>
          <span className="font-medium">Std (70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-[#e6f0ff] border border-[#b8d5ff] inline-block"></span>
          <span className="font-medium text-deep-cobalt">MVO (30%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-paper border-2 border-signal-blue inline-block"></span>
          <span className="font-medium">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-rose-100 border border-rose-300 inline-block"></span>
          <span className="font-medium text-rose-700">Missed</span>
        </div>
      </div>

      {/* 90-Day Visual Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1 relative z-10">
        {filteredDays.map((day) => {
          const log = logMap.get(day);
          const isSelected = selectedDayNumber === day;
          const isToday = day === currentDay;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDayNumber(day)}
              className={`min-h-[50px] rounded-[10px] border flex flex-col items-center justify-center p-1 relative transition-all cursor-pointer ${getDayColor(
                day
              )} ${isSelected ? 'ring-2 ring-signal-blue scale-105 z-20 shadow-md' : 'hover:scale-102'}`}
            >
              <span className="font-mono text-xs sm:text-sm font-bold tabular-nums leading-none">
                {day}
              </span>
              <span className="text-[9px] font-mono tracking-tight opacity-90 mt-1">
                {log ? log.level : isToday ? 'TODAY' : ''}
              </span>

              {isToday && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal-blue"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector */}
      <div className="calendly-card-inner p-5 sm:p-6 mt-4 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-bold text-sm sm:text-base text-ink-navy bg-paper px-3 py-1 rounded-[8px] border border-hairline shadow-xs">
              Day {selectedDayNumber}
            </span>
            <span className="text-xs sm:text-sm text-signal-blue font-semibold">
              {getDayPhase(selectedDayNumber).name}
            </span>
            {selectedDayNumber === currentDay && (
              <span className="pill-badge text-xs">
                Current Day
              </span>
            )}
          </div>

          {onSelectDayToLog && (
            <button
              type="button"
              onClick={() => onSelectDayToLog(selectedDayNumber)}
              className="text-xs text-signal-blue hover:underline font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Log or Edit Day {selectedDayNumber}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {selectedLog ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
            <div className="p-4 rounded-[12px] bg-paper border border-hairline space-y-2 shadow-xs">
              <div className="text-slate-gray flex items-center justify-between">
                <span>Momentum Tier</span>
                <span className="font-bold text-ink-navy">
                  {selectedLog.level === 'MAX' ? '100% MS' : selectedLog.level === 'STANDARD' ? '70% MS' : '30% MS'}
                </span>
              </div>
              <div className="font-bold text-base text-ink-navy flex items-center gap-2">
                {selectedLog.level === 'MAX' ? (
                  <Trophy className="w-5 h-5 text-signal-blue" />
                ) : selectedLog.level === 'STANDARD' ? (
                  <Award className="w-5 h-5 text-ink-navy" />
                ) : (
                  <Sparkles className="w-5 h-5 text-deep-cobalt" />
                )}
                <span>Level {selectedLog.level}</span>
              </div>
              {selectedLog.emergencyTriggered && (
                <div className="pill-badge text-xs mt-1">
                  ⚡ Saved via 2-Min Friction Protocol
                </div>
              )}
            </div>

            <div className="p-4 rounded-[12px] bg-paper border border-hairline md:col-span-2 flex flex-col justify-between space-y-2 shadow-xs">
              <div>
                <div className="text-slate-gray font-semibold mb-1">Target Executed:</div>
                <div className="text-ink-navy text-sm font-semibold">{selectedLog.target || 'Daily deep work session'}</div>
                {selectedLog.notes && (
                  <div className="mt-2 text-slate-gray italic text-xs">
                    "{selectedLog.notes}"
                  </div>
                )}
              </div>

              {selectedLog.noveltyUsed && (
                <div className="pt-2 border-t border-hairline text-xs text-slate-gray flex items-center gap-2">
                  <span className="text-signal-blue font-bold">Rule 4 Novelty:</span>
                  <span className="text-ink-navy">{selectedLog.noveltyUsed}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-[12px] bg-paper border border-hairline text-center shadow-xs">
            <p className="text-xs sm:text-sm text-slate-gray">
              {selectedDayNumber > currentDay
                ? `Day ${selectedDayNumber} is scheduled for future execution in ${getDayPhase(selectedDayNumber).name}.`
                : `Day ${selectedDayNumber} has not been recorded yet. Check in to log output and protect the chain.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
