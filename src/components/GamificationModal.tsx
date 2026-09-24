import React, { useState } from 'react';
import { Badge, LeaderboardEntry, MissionStats, UserAccount } from '../types';
import { Trophy, Award, Flame, Zap, Sparkles, Users, Crown, Medal, X } from 'lucide-react';
import { fireMilestoneConfetti } from '../utils/gamification';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  currentUser: UserAccount | null;
  stats: MissionStats;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  isOpen,
  onClose,
  badges,
  leaderboard,
  currentUser,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');
  const [tierFilter, setTierFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const filteredBadges = badges.filter((b) => {
    if (tierFilter === 'unlocked') return b.isUnlocked;
    if (tierFilter === 'locked') return !b.isUnlocked;
    return true;
  });

  const getTierColor = (tier: Badge['tier']) => {
    switch (tier) {
      case 'platinum':
        return {
          border: 'border-purple-200',
          bg: 'bg-purple-50/50',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
        };
      case 'gold':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50/50',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'silver':
        return {
          border: 'border-slate-300',
          bg: 'bg-slate-50',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      default: // bronze
        return {
          border: 'border-amber-200',
          bg: 'bg-orange-50/40',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl bg-paper">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-pebble shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-paper border border-hairline text-amber-500 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-ink-navy">
                  Zero Inertia Gamification & Intel
                </h2>
                <span className="pill-badge">
                  {unlockedCount}/{badges.length} Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-gray mt-0.5">
                Rewarding behavioral consistency, friction eradication, and neuro-momentum.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-slate-gray hover:text-ink-navy hover:bg-paper transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 border-b border-hairline bg-paper flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('badges')}
              className={`text-xs font-semibold py-2 px-3.5 rounded-[8px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'badges'
                  ? 'bg-signal-blue text-white shadow-sm'
                  : 'text-slate-gray hover:text-ink-navy hover:bg-pebble'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Milestone Badges ({unlockedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`text-xs font-semibold py-2 px-3.5 rounded-[8px] transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-signal-blue text-white shadow-sm'
                  : 'text-slate-gray hover:text-ink-navy hover:bg-pebble'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Operative Leaderboard</span>
            </button>
          </div>

          {activeTab === 'badges' && (
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                  tierFilter === 'all' ? 'bg-pebble text-ink-navy border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTierFilter('unlocked')}
                className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                  tierFilter === 'unlocked' ? 'bg-pebble text-signal-blue border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                }`}
              >
                Unlocked
              </button>
              <button
                onClick={() => setTierFilter('locked')}
                className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                  tierFilter === 'locked' ? 'bg-pebble text-ink-navy border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                }`}
              >
                Locked
              </button>
              <button
                onClick={() => fireMilestoneConfetti()}
                title="Celebrate Progress"
                className="btn-outline text-xs py-1 px-3 ml-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Salute</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-cloud">
          {activeTab === 'badges' ? (
            /* BADGES GRID */
            <div>
              {/* Operative Tier Summary Banner */}
              <div className="p-5 rounded-[16px] calendly-card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-signal-blue to-deep-cobalt flex items-center justify-center text-2xl font-bold text-white shadow-md shrink-0">
                    {unlockedCount >= 10 ? '🪐' : unlockedCount >= 6 ? '👑' : unlockedCount >= 3 ? '🛡️' : '⚡'}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-ink-navy flex items-center gap-2">
                      <span>Callsign: {currentUser?.displayName || 'Tactical Operative'}</span>
                      <span className="pill-badge text-[11px]">
                        {unlockedCount >= 10 ? 'Centurion Elite' : unlockedCount >= 6 ? 'Vanguard Veteran' : unlockedCount >= 3 ? 'Active Catalyst' : 'Ignition Cadet'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-gray mt-1">
                      Current Streak: <span className="text-signal-blue font-bold">{stats.currentStreak} Days</span> · Momentum Score: <span className="text-ink-navy font-bold">{stats.averageMomentumScore}%</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="calendly-card-inner px-4 py-2 rounded-[12px] text-center">
                    <div className="text-[10px] font-bold text-slate-gray uppercase">Unlocked</div>
                    <div className="text-sm font-bold text-ink-navy">{unlockedCount} / {badges.length}</div>
                  </div>
                  <div className="calendly-card-inner px-4 py-2 rounded-[12px] text-center">
                    <div className="text-[10px] font-bold text-slate-gray uppercase">Mastery</div>
                    <div className="text-sm font-bold text-signal-blue">{Math.round((unlockedCount / badges.length) * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Badges Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBadges.map((badge) => {
                  const colors = getTierColor(badge.tier);
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-[16px] border p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                        badge.isUnlocked
                          ? `${colors.bg} ${colors.border} shadow-sm`
                          : 'bg-paper/70 border-hairline opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{badge.icon}</span>
                            <div>
                              <h4 className="font-bold text-sm text-ink-navy">
                                {badge.title}
                              </h4>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                                {badge.tier}
                              </span>
                            </div>
                          </div>

                          {badge.isUnlocked ? (
                            <span className="pill-badge text-[10px]">
                              ✓ Earned
                            </span>
                          ) : (
                            <span className="pill-badge-neutral text-[10px]">
                              Locked
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-gray mt-3 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>

                      {/* Requirement & Progress */}
                      <div className="mt-4 pt-3 border-t border-hairline/70">
                        <div className="flex items-center justify-between text-[11px] text-slate-gray mb-1">
                          <span className="font-semibold">Criterion:</span>
                          <span className="text-ink-navy font-medium">{badge.requirementText}</span>
                        </div>

                        {!badge.isUnlocked && (
                          <div className="w-full bg-pebble h-1.5 rounded-full overflow-hidden mt-2 border border-hairline">
                            <div
                              className="bg-signal-blue h-full rounded-full transition-all duration-500"
                              style={{ width: `${badge.progress || 0}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* LEADERBOARD VIEW */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 calendly-card-inner rounded-[16px] text-xs">
                <div className="flex items-center gap-2 text-ink-navy font-medium">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Community Leaderboard:</strong> Live synchronization powered by Firebase Firestore.
                  </span>
                </div>
                <div className="text-slate-gray text-[11px] font-semibold">
                  Ranked by Momentum Velocity & Streak Continuity
                </div>
              </div>

              <div className="border border-hairline rounded-[16px] overflow-hidden bg-paper shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-pebble border-b border-hairline text-[11px] font-semibold text-slate-gray uppercase">
                        <th className="py-3.5 px-4">Rank</th>
                        <th className="py-3.5 px-4">Operative Callsign</th>
                        <th className="py-3.5 px-4">Active Mission</th>
                        <th className="py-3.5 px-4 text-center">Momentum</th>
                        <th className="py-3.5 px-4 text-center">Streak</th>
                        <th className="py-3.5 px-4 text-center">Badges</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {leaderboard.map((entry, idx) => {
                        const isMe = currentUser && (entry.userId === currentUser.uid || entry.displayName === currentUser.displayName);
                        return (
                          <tr
                            key={entry.userId || idx}
                            className={`transition-colors ${
                              isMe
                                ? 'bg-[#f0f7ff] font-semibold'
                                : 'hover:bg-pebble/60'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-ink-navy">
                              {idx === 0 ? (
                                <span className="flex items-center gap-1 text-amber-600 font-bold">
                                  🥇 #1
                                </span>
                              ) : idx === 1 ? (
                                <span className="flex items-center gap-1 text-slate-600 font-bold">
                                  🥈 #2
                                </span>
                              ) : idx === 2 ? (
                                <span className="flex items-center gap-1 text-amber-700 font-bold">
                                  🥉 #3
                                </span>
                              ) : (
                                <span className="text-slate-gray">#{idx + 1}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-ink-navy">
                                  {entry.displayName}
                                </span>
                                {isMe && (
                                  <span className="pill-badge text-[10px]">
                                    You
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-gray text-xs">
                              {entry.activeMissionName || 'Mission: Unbound'}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="font-bold text-signal-blue">
                                {entry.momentumScore}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 font-bold text-ink-navy">
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                {entry.currentStreak}d
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-deep-cobalt font-semibold">
                                <Medal className="w-3.5 h-3.5" />
                                {entry.badgeCount}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
