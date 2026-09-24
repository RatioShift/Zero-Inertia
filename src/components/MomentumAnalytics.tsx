import React, { useState } from 'react';
import { Mission, DailyLog, MissionStats } from '../types';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';

interface MomentumAnalyticsProps {
  mission: Mission;
  stats: MissionStats;
  logs: DailyLog[];
  variant?: 'sidebar' | 'full';
}

export const MomentumAnalytics: React.FC<MomentumAnalyticsProps> = ({
  mission,
  stats,
  logs,
  variant = 'full',
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    day: number;
    score: number;
    level: string;
    target?: string;
  } | null>(null);

  // Build a day-indexed map of logs
  const logMap = new Map<number, DailyLog>();
  logs.forEach((l) => logMap.set(l.dayNumber, l));

  // Determine scores for each day up to current day (or total days)
  const totalDays = mission.totalDays;
  const currentDay = Math.max(1, stats.dayInMission);
  const displayDaysCount = Math.min(totalDays, Math.max(14, currentDay));

  const dayData: Array<{ day: number; score: number; level: string; target?: string }> = [];
  for (let d = 1; d <= displayDaysCount; d++) {
    const log = logMap.get(d);
    let score = 0;
    let level = 'UNLOGGED';
    if (log) {
      level = log.level;
      if (log.level === 'MAX') score = 100;
      else if (log.level === 'STANDARD') score = 70;
      else if (log.level === 'MVO') score = 30;
      else if (log.level === 'MISSED') score = 0;
    } else if (d < currentDay) {
      level = 'MISSED';
      score = 0;
    } else if (d === currentDay) {
      level = 'PENDING';
      score = 50;
    } else {
      level = 'UPCOMING';
      score = 0;
    }
    dayData.push({ day: d, score, level, target: log?.target });
  }

  // SVG Chart Geometry
  const chartWidth = 700;
  const chartHeight = 180;
  const padLeft = 36;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 26;

  const innerWidth = chartWidth - padLeft - padRight;
  const innerHeight = chartHeight - padTop - padBottom;

  const points = dayData.map((d, index) => {
    const x = padLeft + (index / Math.max(1, dayData.length - 1)) * innerWidth;
    const y = padTop + innerHeight - (d.score / 100) * innerHeight;
    return { x, y, ...d };
  });

  // Construct SVG path for spline line and gradient fill area
  const linePath = points.length > 1
    ? points.reduce((acc, pt, idx) => {
        if (idx === 0) return `M ${pt.x},${pt.y}`;
        return `${acc} L ${pt.x},${pt.y}`;
      }, '')
    : '';

  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x},${padTop + innerHeight} L ${points[0].x},${padTop + innerHeight} Z`
    : '';

  const frictionCoefficient = Math.max(0, (1 - stats.averageMomentumScore / 100)).toFixed(2);

  const totalLogged = Math.max(1, stats.totalActiveDays);
  const maxPct = Math.round((stats.maxDaysCount / totalLogged) * 100);
  const stdPct = Math.round((stats.standardDaysCount / totalLogged) * 100);
  const mvoPct = Math.round((stats.mvoDaysCount / totalLogged) * 100);

  const isSidebar = variant === 'sidebar';

  return (
    <div className="calendly-card p-4 sm:p-6 lg:p-7 space-y-5 sm:space-y-6 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 blob-cyan rounded-full pointer-events-none opacity-30" />

      {/* Header Section */}
      <div className="flex flex-col min-[520px]:flex-row min-[520px]:items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-hairline relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-signal-blue shrink-0" />
            <h2 className="text-base sm:text-xl font-bold text-ink-navy tracking-tight leading-snug">
              Momentum Telemetry & Trajectory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-gray mt-1 leading-relaxed">
            Real-time neuro-friction tracking and performance trajectory.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-semibold self-start min-[520px]:self-auto shrink-0 bg-pebble px-2.5 py-1 rounded-[6px] border border-hairline">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-signal-blue"></span>
            <span className="text-slate-gray">Friction:</span>
            <span className="text-ink-navy font-bold">{frictionCoefficient}</span>
          </div>
          <div className="text-hairline">|</div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-deep-cobalt"></span>
            <span className="text-slate-gray">Velocity:</span>
            <span className="text-signal-blue font-bold">{stats.averageMomentumScore}%</span>
          </div>
        </div>
      </div>

      {/* Dynamic Grid: Stacks cleanly in sidebar mode, or splits in full width */}
      <div className={`gap-5 sm:gap-6 relative z-10 ${
        isSidebar ? 'flex flex-col' : 'grid grid-cols-1 xl:grid-cols-3'
      }`}>
        {/* Main Chart Area */}
        <div className={`space-y-2.5 sm:space-y-3 ${isSidebar ? 'w-full' : 'xl:col-span-2'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink-navy">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-signal-blue" />
              <span>Momentum Trajectory Curve</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-gray font-medium flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-1 bg-signal-blue rounded-full inline-block"></span>
                <span>Trend</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-1 bg-mist-gray rounded-full inline-block"></span>
                <span>Baseline</span>
              </span>
            </div>
          </div>

          {/* Clean SVG Telemetry Curve */}
          <div className="relative calendly-card-sm p-2.5 sm:p-3 bg-paper border border-hairline overflow-hidden shadow-xs">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-32 sm:h-40 md:h-44 select-none"
            >
              <defs>
                <linearGradient id="calendlyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006bff" stopOpacity="0.2" />
                  <stop offset="70%" stopColor="#006bff" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#006bff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="calendlyLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#006bff" />
                  <stop offset="70%" stopColor="#004eba" />
                  <stop offset="100%" stopColor="#0b3558" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[100, 70, 30, 0].map((val) => {
                const y = padTop + innerHeight - (val / 100) * innerHeight;
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartWidth - padRight}
                      y2={y}
                      stroke={val === 70 ? '#b8d5ff' : '#d4e0ed'}
                      strokeWidth={val === 70 ? '1.5' : '1'}
                      strokeDasharray={val === 70 ? '4 3' : 'none'}
                    />
                    <text
                      x={padLeft - 8}
                      y={y + 3}
                      fill="#476788"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="Manrope"
                      textAnchor="end"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              {areaPath && (
                <path d={areaPath} fill="url(#calendlyAreaGradient)" />
              )}

              {/* Trajectory Stroke */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#calendlyLineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt) => {
                const isCurrent = pt.day === currentDay;
                const isHovered = hoveredDay?.day === pt.day;

                return (
                  <g
                    key={pt.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDay(pt)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {isCurrent && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="7"
                        fill="#006bff"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : isCurrent ? 5 : 3.5}
                      fill={
                        pt.level === 'MAX'
                          ? '#0b3558'
                          : pt.level === 'STANDARD'
                          ? '#006bff'
                          : pt.level === 'MVO'
                          ? '#004eba'
                          : isCurrent
                          ? '#006bff'
                          : '#a6bbd1'
                      }
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {points
                .filter((_, idx) => idx % Math.ceil(points.length / 8) === 0 || idx === points.length - 1)
                .map((pt) => (
                  <text
                    key={`label-${pt.day}`}
                    x={pt.x}
                    y={chartHeight - 6}
                    fill="#476788"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Manrope"
                    textAnchor="middle"
                  >
                    Day {pt.day}
                  </text>
                ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredDay && (
              <div className="absolute top-2 right-2 bg-paper border border-hairline p-2 rounded-[6px] shadow-md text-xs space-y-0.5 pointer-events-none z-20">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-signal-blue font-bold">Day {hoveredDay.day}</span>
                  <span className="text-ink-navy font-bold">{hoveredDay.score}% MS</span>
                </div>
                <div className="text-slate-gray text-[11px]">
                  Status: <span className="font-semibold text-ink-navy">{hoveredDay.level}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Execution Distribution Breakdown */}
        <div className={`space-y-3 ${isSidebar ? 'w-full' : 'xl:col-span-1'}`}>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink-navy">
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-signal-blue" />
            <span>Output Distribution</span>
          </div>

          <div className="calendly-card-inner p-3.5 sm:p-4 space-y-3">
            <div className="w-full bg-pebble h-2 rounded-full flex overflow-hidden border border-hairline">
              <div
                style={{ width: `${maxPct}%` }}
                className="bg-ink-navy h-full transition-all"
                title={`Max: ${maxPct}%`}
              />
              <div
                style={{ width: `${stdPct}%` }}
                className="bg-signal-blue h-full transition-all"
                title={`Standard: ${stdPct}%`}
              />
              <div
                style={{ width: `${mvoPct}%` }}
                className="bg-[#004eba] h-full transition-all"
                title={`MVO: ${mvoPct}%`}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-ink-navy shrink-0"></span>
                  <span className="font-medium text-slate-gray truncate">Max (90–120m)</span>
                </div>
                <span className="font-bold text-ink-navy shrink-0">
                  {stats.maxDaysCount}d ({maxPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-signal-blue shrink-0"></span>
                  <span className="font-medium text-slate-gray truncate">Standard (45–60m)</span>
                </div>
                <span className="font-bold text-signal-blue shrink-0">
                  {stats.standardDaysCount}d ({stdPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#004eba] shrink-0"></span>
                  <span className="font-medium text-slate-gray truncate">Rule 2 MVO (2–10m)</span>
                </div>
                <span className="font-bold text-deep-cobalt shrink-0">
                  {stats.mvoDaysCount}d ({mvoPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="calendly-card-inner p-2.5 sm:p-3 text-center">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-gray uppercase">Longest Chain</div>
              <div className="text-lg sm:text-xl font-bold text-ink-navy mt-0.5">{stats.longestStreak} Days</div>
            </div>
            <div className="calendly-card-inner p-2.5 sm:p-3 text-center">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-gray uppercase">MVO Rescues</div>
              <div className="text-lg sm:text-xl font-bold text-deep-cobalt mt-0.5">{stats.mvoDaysCount} Saves</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
