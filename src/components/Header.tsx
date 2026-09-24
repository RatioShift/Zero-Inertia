import React from 'react';
import { Mission, MissionStats } from '../types';
import { AlertTriangle, Trophy, LogIn, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  mission: Mission;
  stats: MissionStats;
  activeTab: 'cockpit' | 'matrix' | 'analytics' | 'sop' | 'missions';
  setActiveTab: (tab: 'cockpit' | 'matrix' | 'analytics' | 'sop' | 'missions') => void;
  onOpenEmergency: () => void;
  onOpenMissionManager: () => void;
  onOpenResetGuide: () => void;
  onOpenGamification: () => void;
  onOpenAuth: () => void;
  unlockedBadgesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mission,
  stats,
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenMissionManager,
  onOpenResetGuide,
  onOpenGamification,
  onOpenAuth,
  unlockedBadgesCount,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper/95 backdrop-blur-md w-full">
      {/* 24-Hour Reset Alert Banner */}
      {stats.is24hResetWarning && (
        <div className="bg-[#fff7ed] border-b border-[#fed7aa] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs text-[#9a3412]">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
            <span className="font-bold tracking-wide shrink-0">24H RESET:</span>
            <span className="text-[#7c2d12] truncate">
              Yesterday unrecorded. Execute 2-min MVO now.
            </span>
          </div>
          <button
            onClick={onOpenResetGuide}
            className="text-signal-blue hover:underline font-semibold cursor-pointer shrink-0 text-[11px] sm:text-xs"
          >
            Recover →
          </button>
        </div>
      )}

      {/* Main Top Navigation Bar */}
      <div className="max-w-[1200px] mx-auto px-2.5 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden">
        {/* Brand Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
          <img
            src="/logo.svg"
            alt="Zero Inertia"
            className="h-7 sm:h-9 w-auto shrink-0"
            style={{ maxWidth: '48px' }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-xs sm:text-sm lg:text-base tracking-tight text-ink-navy whitespace-nowrap">
                Zero Inertia
              </span>
              <span className="pill-badge text-[8px] sm:text-[9px] py-0 px-1 leading-tight hidden min-[320px]:inline">
                OS
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-gray">
              <span className="font-semibold text-signal-blue shrink-0 tabular-nums">
                D{stats.dayInMission}/{mission.totalDays}
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 bg-pebble border border-hairline rounded-[8px]">
          {(['cockpit', 'matrix', 'analytics', 'sop', 'missions'] as const).map((tab) => {
            const labels: Record<string, string> = {
              cockpit: 'Cockpit',
              matrix: 'Chain Matrix',
              analytics: 'Telemetry',
              sop: 'SOP Rules',
              missions: 'Missions',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-[6px] transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-paper text-signal-blue shadow-xs'
                    : 'text-slate-gray hover:text-ink-navy'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </nav>

        {/* Action Controls — these shrink cleanly on very small screens */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Emergency Breaker Button */}
          <button
            onClick={onOpenEmergency}
            className="btn-dark text-[10px] sm:text-xs py-1 px-1.5 sm:py-1.5 sm:px-2.5 gap-0.5 sm:gap-1 shrink-0"
            title="Launch 120-Second Emergency Friction Breaker"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-signal-blue fill-signal-blue shrink-0" />
            <span className="hidden sm:inline font-semibold">Break</span>
            <span className="font-mono font-bold text-sky-cyan text-[9px] sm:text-[10px]">2m</span>
          </button>

          {/* Gamification Badges Button */}
          <button
            onClick={onOpenGamification}
            title="Milestone Badges & Leaderboard"
            className="btn-outline text-[10px] sm:text-xs py-1 px-1.5 sm:py-1.5 sm:px-2 gap-0.5 sm:gap-1 shrink-0"
          >
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
            <span className="font-bold text-ink-navy text-[10px] sm:text-xs">{unlockedBadgesCount}</span>
          </button>

          {/* User Auth — on smallest screens show only icon */}
          {user ? (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-paper border border-hairline rounded-[8px] px-1 sm:px-2 py-0.5 sm:py-1 shadow-xs shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" title="Cloud Synced" />
              <span className="text-[9px] sm:text-xs font-bold text-ink-navy hidden sm:block truncate max-w-[60px] sm:max-w-[90px]">
                {user.displayName || 'Op'}
              </span>
              <button
                onClick={() => logout()}
                title="Log Out"
                className="p-0.5 sm:p-1 hover:bg-pebble text-slate-gray hover:text-rose-600 rounded-[4px] transition-colors cursor-pointer"
              >
                <LogOut className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary text-[10px] sm:text-xs py-1 px-1.5 sm:py-1.5 sm:px-2.5 gap-0.5 sm:gap-1 shrink-0"
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {/* Only show text on 480px+ */}
              <span className="hidden min-[480px]:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
