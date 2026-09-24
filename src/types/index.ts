export type MomentumLevel = 'MAX' | 'STANDARD' | 'MVO' | 'MISSED';

export interface PhaseConfig {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  mindset: string;
  coreFocus: string;
  milestoneObjective: string;
}

export interface Mission {
  id: string;
  userId?: string;
  name: string;
  codename: string;
  totalDays: number;
  startDate: string; // YYYY-MM-DD
  description: string;
  phases: PhaseConfig[];
  coreRules?: string[];
  status: 'active' | 'completed' | 'paused' | 'archived';
  createdAt: string;
  completedAt?: string;
}

export interface MvoDeconstruction {
  microMvo: string;
  standardTarget: string;
  maxTarget: string;
  frictionDiagnosis: string;
  noveltyInjection: string;
  commandMantra: string;
}

export interface DailyLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  missionId: string;
  dayNumber: number;
  target: string;
  level: MomentumLevel;
  microMvo?: string;
  standardTarget?: string;
  maxTarget?: string;
  notes?: string;
  noveltyUsed?: string;
  emergencyTriggered?: boolean;
  loggedAt: string;
}

export interface MissionStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  maxDaysCount: number;
  standardDaysCount: number;
  mvoDaysCount: number;
  missedDaysCount: number;
  averageMomentumScore: number;
  is24hResetWarning: boolean;
  currentPhase: PhaseConfig;
  dayInMission: number;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  category: 'streak' | 'protocol' | 'mission' | 'mastery';
  requirementText: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0 to 100 percentage
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  momentumScore: number;
  currentStreak: number;
  totalActiveDays: number;
  badgeCount: number;
  activeMissionName: string;
  updatedAt: string;
}

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}
