import { Badge, Mission, DailyLog, MissionStats } from '../types';
import confetti from 'canvas-confetti';

export const BADGE_DEFINITIONS: Omit<Badge, 'isUnlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'badge-ignition',
    title: 'Ignition Spark',
    description: 'Broke initial inertia and logged your very first operational session.',
    icon: '⚡',
    tier: 'bronze',
    category: 'protocol',
    requirementText: 'Log 1 active day',
  },
  {
    id: 'badge-streak-3',
    title: 'Momentum Catalyst',
    description: 'Maintained 3 consecutive days of execution without friction relapse.',
    icon: '🔥',
    tier: 'bronze',
    category: 'streak',
    requirementText: 'Reach a 3-day active streak',
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Streak Vanguard',
    description: 'Conquered the critical 7-day neurological resistance barrier.',
    icon: '🛡️',
    tier: 'silver',
    category: 'streak',
    requirementText: 'Reach a 7-day active streak',
  },
  {
    id: 'badge-streak-14',
    title: 'Phase A Ignition Master',
    description: 'Completed 14 consecutive active days through the entire Adaptation Phase.',
    icon: '⚔️',
    tier: 'gold',
    category: 'streak',
    requirementText: 'Reach a 14-day active streak',
  },
  {
    id: 'badge-streak-30',
    title: 'Habit Lock Champion',
    description: 'Surpassed the 30-day dopamine plateau. Action is now automatic.',
    icon: '👑',
    tier: 'gold',
    category: 'streak',
    requirementText: 'Reach a 30-day active streak',
  },
  {
    id: 'badge-emergency-breaker',
    title: 'Limbic Slayer',
    description: 'Activated the Emergency 2-Minute Friction Breaker to shatter acute procrastination.',
    icon: '⏱️',
    tier: 'bronze',
    category: 'protocol',
    requirementText: 'Execute the 2-Minute Friction Breaker countdown',
  },
  {
    id: 'badge-mvo-save',
    title: 'Never Zero Savior',
    description: 'Successfully deployed an MVO session on a low-energy day to preserve the chain.',
    icon: '⚓',
    tier: 'silver',
    category: 'protocol',
    requirementText: 'Log at least 1 MVO chain-protection session',
  },
  {
    id: 'badge-novelty',
    title: 'Dopamine Alchemist',
    description: 'Applied Rule 4 (Novelty Injection) to reboot neurotransmitters in routine tasks.',
    icon: '🧪',
    tier: 'bronze',
    category: 'protocol',
    requirementText: 'Log an entry with a recorded Rule 4 novelty tweak',
  },
  {
    id: 'badge-first-unbound',
    title: 'First Unbound Mission',
    description: 'Commenced operation on the flagship 90-day Mission: Unbound campaign.',
    icon: '🚀',
    tier: 'bronze',
    category: 'mission',
    requirementText: 'Begin or progress in Mission: Unbound',
  },
  {
    id: 'badge-multi-mission',
    title: 'Fleet Commander',
    description: 'Designed and deployed multiple tactical missions across different life domains.',
    icon: '🧭',
    tier: 'silver',
    category: 'mission',
    requirementText: 'Create or manage 2 or more missions',
  },
  {
    id: 'badge-velocity-80',
    title: 'Hyperion Velocity',
    description: 'Maintained an elite average Momentum Score of 80% or higher.',
    icon: '💎',
    tier: 'gold',
    category: 'mastery',
    requirementText: 'Achieve an average Momentum Score >= 80 with 5+ days logged',
  },
  {
    id: 'badge-centurion-90',
    title: 'Zero Inertia Legend',
    description: 'Reached Day 90 with unbreakable behavioral rewiring and zero inertia.',
    icon: '🪐',
    tier: 'platinum',
    category: 'mastery',
    requirementText: 'Log 90 active campaign days',
  },
];

export function evaluateBadges(
  missions: Mission[],
  activeMission: Mission,
  logs: DailyLog[],
  stats: MissionStats
): Badge[] {
  const allActiveLogs = logs.filter((l) => l.level !== 'MISSED');
  const hasUsedBreaker = logs.some((l) => l.emergencyTriggered);
  const hasUsedMvo = logs.some((l) => l.level === 'MVO');
  const hasUsedNovelty = logs.some((l) => Boolean(l.noveltyUsed && l.noveltyUsed.trim()));
  const isUnboundActive = missions.some((m) => m.name.toLowerCase().includes('unbound'));

  return BADGE_DEFINITIONS.map((def) => {
    let isUnlocked = false;
    let progress = 0;

    switch (def.id) {
      case 'badge-ignition':
        isUnlocked = allActiveLogs.length >= 1;
        progress = Math.min(100, (allActiveLogs.length / 1) * 100);
        break;

      case 'badge-streak-3':
        isUnlocked = stats.longestStreak >= 3 || stats.currentStreak >= 3;
        progress = Math.min(100, (Math.max(stats.longestStreak, stats.currentStreak) / 3) * 100);
        break;

      case 'badge-streak-7':
        isUnlocked = stats.longestStreak >= 7 || stats.currentStreak >= 7;
        progress = Math.min(100, (Math.max(stats.longestStreak, stats.currentStreak) / 7) * 100);
        break;

      case 'badge-streak-14':
        isUnlocked = stats.longestStreak >= 14 || stats.currentStreak >= 14;
        progress = Math.min(100, (Math.max(stats.longestStreak, stats.currentStreak) / 14) * 100);
        break;

      case 'badge-streak-30':
        isUnlocked = stats.longestStreak >= 30 || stats.currentStreak >= 30;
        progress = Math.min(100, (Math.max(stats.longestStreak, stats.currentStreak) / 30) * 100);
        break;

      case 'badge-emergency-breaker':
        isUnlocked = hasUsedBreaker;
        progress = hasUsedBreaker ? 100 : 0;
        break;

      case 'badge-mvo-save':
        isUnlocked = hasUsedMvo;
        progress = hasUsedMvo ? 100 : 0;
        break;

      case 'badge-novelty':
        isUnlocked = hasUsedNovelty;
        progress = hasUsedNovelty ? 100 : 0;
        break;

      case 'badge-first-unbound':
        isUnlocked = isUnboundActive;
        progress = isUnboundActive ? 100 : 0;
        break;

      case 'badge-multi-mission':
        isUnlocked = missions.length >= 2;
        progress = Math.min(100, (missions.length / 2) * 100);
        break;

      case 'badge-velocity-80':
        isUnlocked = stats.totalActiveDays >= 5 && stats.averageMomentumScore >= 80;
        progress = Math.min(100, (stats.averageMomentumScore / 80) * 100);
        break;

      case 'badge-centurion-90':
        isUnlocked = stats.totalActiveDays >= 90;
        progress = Math.min(100, (stats.totalActiveDays / 90) * 100);
        break;

      default:
        isUnlocked = false;
        progress = 0;
    }

    return {
      ...def,
      isUnlocked,
      progress: Math.round(progress),
      unlockedAt: isUnlocked ? 'Unlocked' : undefined,
    };
  });
}

export function fireMilestoneConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'],
    });
  } catch {
    // Audio or canvas fallback
  }
}
