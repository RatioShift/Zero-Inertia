import React from 'react';
import { Mission, MissionStats } from '../types';
import { Compass, Flame, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface TelemetryOverviewProps {
  mission: Mission;
  stats: MissionStats;
}

export const TelemetryOverview: React.FC<TelemetryOverviewProps> = ({ mission, stats }) => {
  const currentPhase = stats.currentPhase;
  const phaseDaysTotal = currentPhase.endDay - currentPhase.startDay + 1;
  const dayInCurrentPhase = Math.max(1, Math.min(phaseDaysTotal, stats.dayInMission - currentPhase.startDay + 1));
  const phaseProgressPct = Math.round((dayInCurrentPhase / phaseDaysTotal) * 100);
  const overallProgressPct = Math.round((stats.dayInMission / mission.totalDays) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 w-full">
      {/* 1. Active Mission Phase */}
      <div className="calendly-card p-3 sm:p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute -top-8 -right-8 w-24 h-24 blob-cyan rounded-full pointer-events-none opacity-40" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-gray min-w-0">
              <Compass className="w-3.5 h-3.5 text-signal-blue shrink-0" />
              <span className="truncate">Phase</span>
            </div>
            <span className="pill-badge shrink-0 text-[10px] sm:text-xs px-2 py-0.5">
              {phaseProgressPct}%
            </span>
          </div>

          <div className="text-sm sm:text-base lg:text-lg font-bold text-ink-navy tracking-tight leading-snug line-clamp-2">
            {currentPhase.name.replace(/Phase [ABC]:\s*/, '')}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-gray mt-1 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            "{currentPhase.mindset}"
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] sm:text-xs text-slate-gray relative z-10">
          <span>Window</span>
          <span className="font-semibold text-ink-navy">
            D{currentPhase.startDay}–{currentPhase.endDay}
          </span>
        </div>
      </div>

      {/* 2. Mission Timeline & Day Counter */}
      <div className="calendly-card p-3 sm:p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-gray min-w-0">
              <Activity className="w-3.5 h-3.5 text-signal-blue shrink-0" />
              <span className="truncate">Timeline</span>
            </div>
            <span className="pill-badge-neutral text-[10px] sm:text-xs shrink-0 px-2 py-0.5 whitespace-nowrap">
              {mission.totalDays - stats.dayInMission}d left
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink-navy tabular-nums tracking-tight">
              Day {stats.dayInMission}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-gray">
              /{mission.totalDays}
            </span>
          </div>

          {/* Timeline Bar */}
          <div className="w-full bg-pebble h-1.5 sm:h-2 rounded-full mt-2 sm:mt-2.5 overflow-hidden border border-hairline">
            <div
              className="bg-signal-blue h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgressPct)}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] sm:text-xs text-slate-gray relative z-10">
          <span>Completion</span>
          <span className="font-bold text-signal-blue">{overallProgressPct}%</span>
        </div>
      </div>

      {/* 3. Never-Zero Streak & Chain Integrity */}
      <div className="calendly-card p-3 sm:p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute -top-8 -right-8 w-24 h-24 blob-magenta rounded-full pointer-events-none opacity-30" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-gray min-w-0">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Streak</span>
            </div>
            <span className="pill-badge text-[10px] sm:text-xs shrink-0 flex items-center gap-1 px-2 py-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
              <span>Intact</span>
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink-navy tabular-nums tracking-tight">
              {stats.currentStreak}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-gray">Days Solid</span>
          </div>

          <div className="text-[11px] sm:text-xs text-slate-gray mt-1 flex flex-wrap items-center gap-1">
            <span>Peak: <strong className="text-ink-navy">{stats.longestStreak}d</strong></span>
            <span className="text-mist-gray">·</span>
            <span className="text-signal-blue font-semibold">{stats.mvoDaysCount} saves</span>
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] sm:text-xs text-slate-gray relative z-10">
          <span>Chain</span>
          <span className="font-bold text-emerald-600">100% Intact</span>
        </div>
      </div>

      {/* 4. Average Momentum Score */}
      <div className="calendly-card p-3 sm:p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-gray min-w-0">
              <Zap className="w-3.5 h-3.5 text-signal-blue shrink-0" />
              <span className="truncate">Momentum</span>
            </div>
            <span className="pill-badge-neutral text-[10px] sm:text-xs shrink-0 px-2 py-0.5">
              {stats.totalActiveDays} Logs
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-signal-blue tabular-nums tracking-tight">
              {stats.averageMomentumScore}%
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-gray">Velocity</span>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs font-medium mt-1 text-slate-gray">
            <span className="text-ink-navy font-semibold">{stats.maxDaysCount} Max</span>
            <span className="text-mist-gray">/</span>
            <span className="text-signal-blue font-semibold">{stats.standardDaysCount} Std</span>
            <span className="text-mist-gray">/</span>
            <span className="text-deep-cobalt font-semibold">{stats.mvoDaysCount} MVO</span>
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] sm:text-xs text-slate-gray relative z-10">
          <span>Tier</span>
          <span className="font-bold text-ink-navy truncate ml-1 text-right">
            {stats.averageMomentumScore >= 80 ? 'High' : stats.averageMomentumScore >= 60 ? 'Standard' : 'Ignition'}
          </span>
        </div>
      </div>
    </div>
  );
};
