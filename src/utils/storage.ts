import { Mission, DailyLog, MissionStats, PhaseConfig, LeaderboardEntry } from '../types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

export const DEFAULT_MISSION: Mission = {
  id: 'mission-unbound-90',
  name: 'Mission: Unbound',
  codename: 'ZERO-INERTIA-ALPHA',
  totalDays: 90,
  startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Started 6 days ago
  description: '90-day neuro-cognitive protocol to permanently eradicate starting friction, bypass dopamine crashes, and construct an unbreakable deep work momentum engine.',
  status: 'active',
  createdAt: new Date().toISOString(),
  coreRules: [
    'Rule 1: The 2-Minute Friction Killer (Start for only 120s)',
    'Rule 2: Never Zero Standard (MVO backup on low-energy days)',
    'Rule 3: Dopamine Regulation (Zero cheap dopamine before deep work)',
    'Rule 4: Novelty Injection (Micro-tweak environment to reset dopamine)',
  ],
  phases: [
    {
      id: 'phase-a',
      name: 'Phase A: Ignition & Adaptation',
      startDay: 1,
      endDay: 14,
      mindset: 'Output is secondary. Building the starting instinct is the sole objective.',
      coreFocus: 'Master the 2-Minute Friction Killer and sit at the workstation without hesitation.',
      milestoneObjective: 'Inertia Breakdown: 14 consecutive active days with 0% skips using MVO backups.',
    },
    {
      id: 'phase-b',
      name: 'Phase B: Stabilization & Habit Lock',
      startDay: 15,
      endDay: 45,
      mindset: 'Overcome the novelty drop with structured variations and micro-rewards.',
      coreFocus: 'Routine automation. Under zero circumstances allow two consecutive failed days.',
      milestoneObjective: 'Dopamine Resistance: Maintain chain through mid-mission boredom dip.',
    },
    {
      id: 'phase-c',
      name: 'Phase C: Unbound Scale & Mastery',
      startDay: 46,
      endDay: 90,
      mindset: 'Zero inertia is now default state. Resistance is dissolved.',
      coreFocus: 'Scale deep work sessions to 90–120 minutes with zero cognitive drag.',
      milestoneObjective: 'Unbound Execution: Effortless flow state entry on high-stakes tasks.',
    },
  ],
};

const STORAGE_KEYS = {
  MISSIONS: 'zero_inertia_missions',
  ACTIVE_MISSION_ID: 'zero_inertia_active_mission_id',
  DAILY_LOGS: 'zero_inertia_daily_logs',
  TODAY_MVO_CACHE: 'zero_inertia_today_mvo_cache',
};

// ================= LOCAL STORAGE HELPERS ================= //

export const getStoredMissions = (): Mission[] => {
  if (typeof window === 'undefined') return [DEFAULT_MISSION];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify([DEFAULT_MISSION]));
      return [DEFAULT_MISSION];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure Mission: Unbound remains the first or present mission
      const hasUnbound = parsed.some((m) => m.id === DEFAULT_MISSION.id || m.name === DEFAULT_MISSION.name);
      if (!hasUnbound) {
        parsed.unshift(DEFAULT_MISSION);
      }
      return parsed;
    }
    return [DEFAULT_MISSION];
  } catch {
    return [DEFAULT_MISSION];
  }
};

export const saveMissions = (missions: Mission[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
};

export const getActiveMission = (): Mission => {
  const missions = getStoredMissions();
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_MISSION_ID);
  const found = missions.find((m) => m.id === activeId && m.status !== 'archived');
  return found || missions[0] || DEFAULT_MISSION;
};

export const setActiveMissionId = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MISSION_ID, id);
};

export const getStoredDailyLogs = (missionId: string): DailyLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (!raw) return [];
    const allLogs: DailyLog[] = JSON.parse(raw);
    return allLogs.filter((l) => l.missionId === missionId);
  } catch {
    return [];
  }
};

export const saveDailyLog = (log: DailyLog) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    let allLogs: DailyLog[] = raw ? JSON.parse(raw) : [];
    const index = allLogs.findIndex((l) => l.missionId === log.missionId && l.dayNumber === log.dayNumber);
    if (index >= 0) {
      allLogs[index] = log;
    } else {
      allLogs.push(log);
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  } catch (e) {
    console.error('Error saving daily log:', e);
  }
};

export const deleteDailyLog = (missionId: string, dayNumber: number) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (!raw) return;
    let allLogs: DailyLog[] = JSON.parse(raw);
    allLogs = allLogs.filter((l) => !(l.missionId === missionId && l.dayNumber === dayNumber));
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  } catch (e) {
    console.error('Error deleting daily log:', e);
  }
};

// ================= FIRESTORE PERSISTENCE HELPERS ================= //

export async function fetchUserMissionsFromFirestore(userId: string): Promise<Mission[]> {
  try {
    const colRef = collection(db, 'users', userId, 'missions');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed default mission for new user in Firestore
      const initialMission: Mission = { ...DEFAULT_MISSION, userId };
      await setDoc(doc(db, 'users', userId, 'missions', initialMission.id), initialMission);
      return [initialMission];
    }
    const missions: Mission[] = [];
    snap.forEach((d) => {
      missions.push(d.data() as Mission);
    });
    // Ensure Mission: Unbound remains the initial mission
    const hasUnbound = missions.some((m) => m.id === DEFAULT_MISSION.id || m.name === DEFAULT_MISSION.name);
    if (!hasUnbound) {
      const initialMission: Mission = { ...DEFAULT_MISSION, userId };
      missions.unshift(initialMission);
    }
    return missions;
  } catch (err) {
    console.warn('Firestore fetchUserMissions error, falling back to local storage:', err);
    return getStoredMissions();
  }
}

export async function saveMissionToFirestore(userId: string, mission: Mission): Promise<void> {
  try {
    const mDoc = doc(db, 'users', userId, 'missions', mission.id);
    await setDoc(mDoc, { ...mission, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveMission error:', err);
  }
}

export async function fetchMissionLogsFromFirestore(userId: string, missionId: string): Promise<DailyLog[]> {
  try {
    const logsRef = collection(db, 'users', userId, 'missions', missionId, 'logs');
    const snap = await getDocs(logsRef);
    if (snap.empty) {
      const localLogs = getStoredDailyLogs(missionId);
      // If we have local seed logs, sync them up
      for (const log of localLogs) {
        await setDoc(doc(logsRef, `log-${log.dayNumber}`), { ...log, userId, missionId });
      }
      return localLogs;
    }
    const logs: DailyLog[] = [];
    snap.forEach((d) => {
      logs.push(d.data() as DailyLog);
    });
    return logs.sort((a, b) => a.dayNumber - b.dayNumber);
  } catch (err) {
    console.warn('Firestore fetchMissionLogs error, using local logs:', err);
    return getStoredDailyLogs(missionId);
  }
}

export async function saveDailyLogToFirestore(userId: string, log: DailyLog): Promise<void> {
  try {
    const logRef = doc(db, 'users', userId, 'missions', log.missionId, 'logs', `log-${log.dayNumber}`);
    await setDoc(logRef, { ...log, userId, loggedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveDailyLog error:', err);
  }
}

export async function syncUserProfileAndLeaderboard(
  userId: string,
  displayName: string,
  stats: MissionStats,
  badgeCount: number,
  activeMissionName: string
): Promise<void> {
  try {
    // 1. Update user document
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        displayName,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        totalActiveDays: stats.totalActiveDays,
        momentumScore: stats.averageMomentumScore,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 2. Update community leaderboard document
    const leaderRef = doc(db, 'leaderboard', userId);
    const entry: LeaderboardEntry = {
      userId,
      displayName: displayName || 'Tactical Operative',
      momentumScore: stats.averageMomentumScore,
      currentStreak: stats.currentStreak,
      totalActiveDays: stats.totalActiveDays,
      badgeCount,
      activeMissionName,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(leaderRef, entry, { merge: true });
  } catch (err) {
    console.warn('Leaderboard sync notice:', err);
  }
}

export async function fetchLeaderboardFromFirestore(): Promise<LeaderboardEntry[]> {
  try {
    const col = collection(db, 'leaderboard');
    const q = query(col, orderBy('momentumScore', 'desc'), limit(25));
    const snap = await getDocs(q);
    const results: LeaderboardEntry[] = [];
    snap.forEach((d) => {
      results.push(d.data() as LeaderboardEntry);
    });

    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    console.warn('Firestore fetchLeaderboard error:', err);
  }

  // No dummy data — leaderboard populates with real users only
  return [];
}

// ================= STATS CALCULATION ================= //

export const calculateMissionStats = (mission: Mission, logs: DailyLog[]): MissionStats => {
  const startDate = new Date(mission.startDate);
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const calculatedDay = Math.max(1, Math.min(mission.totalDays, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

  // Find current phase
  const currentPhase: PhaseConfig =
    mission.phases.find((p) => calculatedDay >= p.startDay && calculatedDay <= p.endDay) ||
    mission.phases[mission.phases.length - 1] ||
    DEFAULT_MISSION.phases[0];

  // Count levels
  let maxCount = 0;
  let standardCount = 0;
  let mvoCount = 0;
  let missedCount = 0;

  logs.forEach((log) => {
    if (log.level === 'MAX') maxCount++;
    else if (log.level === 'STANDARD') standardCount++;
    else if (log.level === 'MVO') mvoCount++;
    else if (log.level === 'MISSED') missedCount++;
  });

  const totalActiveDays = maxCount + standardCount + mvoCount;

  // Streak calculation (continuous days from day 1 up to today without MISSED or missing days)
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedLogs = [...logs].sort((a, b) => a.dayNumber - b.dayNumber);
  const logMap = new Map<number, DailyLog>();
  sortedLogs.forEach((l) => logMap.set(l.dayNumber, l));

  for (let d = 1; d <= calculatedDay; d++) {
    const log = logMap.get(d);
    if (log && (log.level === 'MAX' || log.level === 'STANDARD' || log.level === 'MVO')) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      if (d === calculatedDay) {
        // Today is not logged yet, streak remains what it was yesterday
        continue;
      }
      tempStreak = 0;
    }
  }
  const currentStreak = tempStreak;

  // Average Momentum Score (Max = 100, Standard = 70, MVO = 30)
  let totalScorePoints = 0;
  if (totalActiveDays > 0) {
    totalScorePoints = maxCount * 100 + standardCount * 70 + mvoCount * 30;
  }
  const averageMomentumScore = totalActiveDays > 0 ? Math.round(totalScorePoints / totalActiveDays) : 100;

  // 24-hour reset warning: Check if yesterday was missed
  const yesterday = calculatedDay - 1;
  const yesterdayLog = logMap.get(yesterday);
  const is24hResetWarning = yesterday >= 1 && (!yesterdayLog || yesterdayLog.level === 'MISSED');

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
    maxDaysCount: maxCount,
    standardDaysCount: standardCount,
    mvoDaysCount: mvoCount,
    missedDaysCount: missedCount,
    averageMomentumScore,
    is24hResetWarning,
    currentPhase,
    dayInMission: calculatedDay,
  };
};

// Dummy seed data removed — all logs are real user data only.
