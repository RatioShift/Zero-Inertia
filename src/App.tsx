import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mission,
  DailyLog,
  MomentumLevel,
  MvoDeconstruction,
  Badge,
  LeaderboardEntry,
} from './types';
import {
  getActiveMission,
  getStoredMissions,
  saveMissions,
  setActiveMissionId,
  getStoredDailyLogs,
  saveDailyLog,
  calculateMissionStats,
  fetchUserMissionsFromFirestore,
  saveMissionToFirestore,
  fetchMissionLogsFromFirestore,
  saveDailyLogToFirestore,
  syncUserProfileAndLeaderboard,
  fetchLeaderboardFromFirestore,
  DEFAULT_MISSION,
} from './utils/storage';
import { useAuth } from './context/AuthContext';
import { evaluateBadges, fireMilestoneConfetti } from './utils/gamification';
import { Header } from './components/Header';
import { TelemetryOverview } from './components/TelemetryOverview';
import { DailyTargetSection } from './components/DailyTargetSection';
import { DailyStatusLogger } from './components/DailyStatusLogger';
import { ChainMatrix } from './components/ChainMatrix';
import { MomentumAnalytics } from './components/MomentumAnalytics';
import { EmergencyBreakerModal } from './components/EmergencyBreakerModal';
import { MissionManagerModal } from './components/MissionManagerModal';
import { OperatingRulesDrawer } from './components/OperatingRulesDrawer';
import { FailSafeResetModal } from './components/FailSafeResetModal';
import { GamificationModal } from './components/GamificationModal';
import { AuthModal } from './components/AuthModal';
import {
  Trophy,
  Flame,
  Shield,
  Layers,
  Clock,
  ArrowRight,
  Plus,
  BookOpen,
  Activity,
  Zap,
  Compass,
} from 'lucide-react';

export default function App() {
  const { user } = useAuth();

  // Initialize with synchronous local storage to render instantly and prevent preview timeouts
  const [missions, setMissions] = useState<Mission[]>(() => getStoredMissions());
  const [activeMission, setActiveMission] = useState<Mission>(() => getActiveMission());
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const initialMission = getActiveMission();
    return getStoredDailyLogs(initialMission.id);
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'matrix' | 'analytics' | 'sop' | 'missions'>('cockpit');

  // Modals & Drawers
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyTaskName, setEmergencyTaskName] = useState('');
  const [isMissionManagerOpen, setIsMissionManagerOpen] = useState(false);
  const [isSopDrawerOpen, setIsSopDrawerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Selected Day for logging (defaults to current mission day)
  const [dayToLog, setDayToLog] = useState<number>(() => {
    const m = getActiveMission();
    const l = getStoredDailyLogs(m.id);
    const s = calculateMissionStats(m, l);
    return s.dayInMission;
  });
  const [cachedMvo, setCachedMvo] = useState<{ target: string; mvo: MvoDeconstruction } | null>(null);

  // Milestone Celebration Notification
  const [newBadgeNotification, setNewBadgeNotification] = useState<string | null>(null);
  const previousUnlockedCount = useRef<number>(0);

  // Load missions and logs (Firestore if logged in, otherwise local)
  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      try {
        if (user && !user.isAnonymous) {
          // Load from Firestore
          const userMissions = await fetchUserMissionsFromFirestore(user.uid);
          if (!isSubscribed) return;

          if (userMissions.length > 0) {
            setMissions(userMissions);
            const storedActiveId = localStorage.getItem('zero_inertia_active_mission_id');
            const current = userMissions.find((m) => m.id === storedActiveId) || userMissions[0] || DEFAULT_MISSION;
            setActiveMission(current);

            const missionLogs = await fetchMissionLogsFromFirestore(user.uid, current.id);
            if (!isSubscribed) return;
            setLogs(missionLogs);

            const currentStats = calculateMissionStats(current, missionLogs);
            setDayToLog(currentStats.dayInMission);
          }
        } else {
          // Local storage mode
          const loadedMissions = getStoredMissions();
          setMissions(loadedMissions);
          const current = getActiveMission();
          setActiveMission(current);
          const missionLogs = getStoredDailyLogs(current.id);
          setLogs(missionLogs);

          const currentStats = calculateMissionStats(current, missionLogs);
          setDayToLog(currentStats.dayInMission);
        }

        // Load community leaderboard
        const lb = await fetchLeaderboardFromFirestore();
        if (isSubscribed) setLeaderboard(lb);
      } catch (err) {
        console.warn('Telemetry data load notice:', err);
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [user?.uid, user?.isAnonymous]);

  // Compute stats and evaluate badges dynamically with useMemo
  const stats = useMemo(() => {
    return activeMission
      ? calculateMissionStats(activeMission, logs)
      : calculateMissionStats(DEFAULT_MISSION, []);
  }, [activeMission, logs]);

  const badges = useMemo(() => {
    return activeMission
      ? evaluateBadges(missions, activeMission, logs, stats)
      : [];
  }, [missions, activeMission, logs, stats]);

  const unlockedCount = useMemo(() => {
    return badges.filter((b) => b.isUnlocked).length;
  }, [badges]);

  // Detect newly unlocked badge and trigger celebration fanfare
  useEffect(() => {
    if (unlockedCount > previousUnlockedCount.current && previousUnlockedCount.current > 0) {
      const newlyUnlocked = badges.find((b) => b.isUnlocked && !b.unlockedAt);
      if (newlyUnlocked) {
        setNewBadgeNotification(`🎖️ New Milestone Unlocked: ${newlyUnlocked.title}!`);
        fireMilestoneConfetti();
        const timer = setTimeout(() => setNewBadgeNotification(null), 5000);
        return () => clearTimeout(timer);
      }
    }
    previousUnlockedCount.current = unlockedCount;
  }, [unlockedCount, badges]);

  // Sync profile and leaderboard on status changes
  useEffect(() => {
    if (user && !user.isAnonymous && activeMission && stats.totalActiveDays > 0) {
      let isMounted = true;
      syncUserProfileAndLeaderboard(
        user.uid,
        user.displayName || 'Operative',
        stats,
        unlockedCount,
        activeMission.name
      ).then(() => {
        if (!isMounted) return;
        fetchLeaderboardFromFirestore().then((lb) => {
          if (isMounted) setLeaderboard(lb);
        });
      }).catch((e) => {
        console.warn('Leaderboard sync notice:', e);
      });

      return () => {
        isMounted = false;
      };
    }
  }, [
    user?.uid,
    user?.displayName,
    activeMission?.id,
    activeMission?.name,
    stats.totalActiveDays,
    stats.currentStreak,
    stats.averageMomentumScore,
    unlockedCount,
  ]);

  if (!activeMission) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center text-slate-gray">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-signal-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-ink-navy text-sm">Calibrating system telemetry...</span>
        </div>
      </div>
    );
  }

  const todayLog = logs.find((l) => l.dayNumber === dayToLog);

  // Handlers for switching missions
  const handleSelectMission = (missionId: string) => {
    setActiveMissionId(missionId);
    const m = missions.find((x) => x.id === missionId);
    if (m) {
      setActiveMission(m);
      if (user && !user.isAnonymous) {
        fetchMissionLogsFromFirestore(user.uid, m.id).then((l) => {
          setLogs(l);
          const currentStats = calculateMissionStats(m, l);
          setDayToLog(currentStats.dayInMission);
        });
      } else {
        const l = getStoredDailyLogs(m.id);
        setLogs(l);
        const currentStats = calculateMissionStats(m, l);
        setDayToLog(currentStats.dayInMission);
      }
    }
  };

  // Handlers for creating new missions
  const handleCreateMission = (newMissionData: Omit<Mission, 'id' | 'createdAt'>) => {
    const newMission: Mission = {
      ...newMissionData,
      id: `mission-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...missions, newMission];
    setMissions(updated);
    saveMissions(updated);
    if (user && !user.isAnonymous) {
      saveMissionToFirestore(user.uid, newMission);
    }
    handleSelectMission(newMission.id);
  };

  // Handle updating mission status
  const handleUpdateMissionStatus = (missionId: string, status: 'active' | 'completed' | 'archived') => {
    const updated = missions.map((m) => (m.id === missionId ? { ...m, status } : m));
    setMissions(updated);
    saveMissions(updated);
    if (activeMission.id === missionId) {
      setActiveMission({ ...activeMission, status });
    }
    if (user && !user.isAnonymous) {
      const target = updated.find((m) => m.id === missionId);
      if (target) saveMissionToFirestore(user.uid, target);
    }
  };

  // Handle saving AI MVO breakdown
  const handleSaveMvoDeconstruction = (target: string, deconstruction: MvoDeconstruction) => {
    setCachedMvo({ target, mvo: deconstruction });
    const newLog: DailyLog = {
      id: todayLog?.id || `log-${activeMission.id}-${dayToLog}`,
      missionId: activeMission.id,
      dayNumber: dayToLog,
      date: todayLog?.date || new Date().toISOString().split('T')[0],
      target,
      level: todayLog?.level || 'MVO',
      microMvo: deconstruction.microMvo,
      loggedAt: new Date().toISOString(),
    };
    saveDailyLog(newLog);
    if (user && !user.isAnonymous) {
      saveDailyLogToFirestore(user.uid, newLog);
    }
    setLogs(getStoredDailyLogs(activeMission.id));
  };

  // Handle committing log
  const handleSaveLog = (data: Partial<DailyLog> & { level: MomentumLevel }) => {
    const newLog: DailyLog = {
      id: todayLog?.id || `log-${activeMission.id}-${dayToLog}`,
      missionId: activeMission.id,
      dayNumber: dayToLog,
      date: todayLog?.date || new Date().toISOString().split('T')[0],
      target: todayLog?.target || cachedMvo?.target || 'Daily deep work session',
      level: data.level,
      microMvo: todayLog?.microMvo || cachedMvo?.mvo?.microMvo,
      notes: data.notes,
      noveltyUsed: data.noveltyUsed,
      loggedAt: new Date().toISOString(),
    };
    saveDailyLog(newLog);
    if (user && !user.isAnonymous) {
      saveDailyLogToFirestore(user.uid, newLog);
    }
    setLogs(getStoredDailyLogs(activeMission.id));
  };

  // Handle completing emergency 2-min friction breaker
  const handleEmergencyMvoComplete = (taskName: string) => {
    const newLog: DailyLog = {
      id: todayLog?.id || `log-${activeMission.id}-${dayToLog}`,
      missionId: activeMission.id,
      dayNumber: dayToLog,
      date: new Date().toISOString().split('T')[0],
      target: taskName,
      level: 'MVO',
      microMvo: taskName,
      notes: 'Executed 120-second Emergency Friction Breaker protocol. Never Zero chain preserved.',
      emergencyTriggered: true,
      loggedAt: new Date().toISOString(),
    };
    saveDailyLog(newLog);
    if (user && !user.isAnonymous) {
      saveDailyLogToFirestore(user.uid, newLog);
    }
    setLogs(getStoredDailyLogs(activeMission.id));
    fireMilestoneConfetti();
  };

  const handleLaunchEmergencyWithTask = (taskName: string) => {
    setEmergencyTaskName(taskName);
    setIsEmergencyOpen(true);
  };

  return (
    <div className="min-h-screen bg-cloud text-ink-navy flex flex-col font-sans selection:bg-signal-blue/15 selection:text-ink-navy relative">
      {/* Subtle Background Decorative Atmosphere Blobs */}
      <div className="fixed top-20 left-10 w-96 h-96 blob-cyan rounded-full z-0 opacity-40 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 blob-magenta rounded-full z-0 opacity-30 pointer-events-none" />

      {/* Global Navigation Header */}
      <Header
        mission={activeMission}
        stats={stats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => {
          setEmergencyTaskName('');
          setIsEmergencyOpen(true);
        }}
        onOpenMissionManager={() => setIsMissionManagerOpen(true)}
        onOpenResetGuide={() => setIsResetModalOpen(true)}
        onOpenGamification={() => setIsGamificationOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        unlockedBadgesCount={unlockedCount}
      />

      {/* Floating Milestone Banner */}
      {newBadgeNotification && (
        <div className="bg-[#e6f0ff] border-b border-[#b8d5ff] text-deep-cobalt px-4 py-2.5 text-center text-xs font-bold tracking-wide shadow-xs relative z-20">
          {newBadgeNotification}
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 pb-36 lg:pb-12 space-y-5 sm:space-y-8 relative z-10">
        {/* Top 4 Telemetry Overview Cards */}
        <TelemetryOverview mission={activeMission} stats={stats} />

        {/* Tab 1: Cockpit Dashboard */}
        {activeTab === 'cockpit' && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            {/* Row 1: Daily Target & AI MVO Generator (Full Width) */}
            <DailyTargetSection
              mission={activeMission}
              currentPhase={stats.currentPhase}
              dayInMission={stats.dayInMission}
              initialTarget={todayLog?.target || cachedMvo?.target || ''}
              initialMvo={cachedMvo?.mvo || null}
              onSaveMvoDeconstruction={handleSaveMvoDeconstruction}
              onTriggerEmergencyWithTask={handleLaunchEmergencyWithTask}
            />

            {/* Row 2: Check-in (left) + Telemetry & Badges (right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Check-in column — 7/12 on xl */}
              <div className="xl:col-span-7">
                <DailyStatusLogger
                  currentDay={dayToLog}
                  totalDays={activeMission.totalDays}
                  existingLog={todayLog}
                  onSaveLog={handleSaveLog}
                />
              </div>

              {/* Right column — Telemetry + Badges — 5/12 on xl */}
              <div className="xl:col-span-5 space-y-5 sm:space-y-6">
                {/* Momentum Trajectory Visualization */}
                <MomentumAnalytics
                  mission={activeMission}
                  stats={stats}
                  logs={logs}
                  variant="sidebar"
                />

                {/* Behavioral Badges & Milestone Progress Card */}
                <div className="calendly-card p-5 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-[8px] bg-pebble border border-hairline text-amber-500 shadow-xs">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink-navy block leading-tight">Milestones & Badges</span>
                        <span className="text-[11px] font-medium text-slate-gray">
                          {unlockedCount} of {badges.length} Unlocked
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsGamificationOpen(true)}
                      className="btn-outline text-xs py-1 px-2.5 gap-1"
                    >
                      <span>Leaderboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Badges preview row */}
                  <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        title={`${b.title} (${b.isUnlocked ? 'Unlocked' : 'Locked'})`}
                        className={`w-10 h-10 shrink-0 rounded-[10px] border flex items-center justify-center text-lg transition-transform hover:scale-110 cursor-pointer ${
                          b.isUnlocked
                            ? 'bg-paper border-signal-blue ring-2 ring-signal-blue/20 shadow-xs'
                            : 'bg-pebble border-hairline opacity-40 grayscale'
                        }`}
                        onClick={() => setIsGamificationOpen(true)}
                      >
                        {b.icon}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-gray leading-relaxed">
                    Consistent execution solidifies neuro-identity. Every 2-min MVO defends your chain.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3: Full Width 90-Day Visual Chain Matrix */}
            <ChainMatrix
              mission={activeMission}
              logs={logs}
              currentDay={stats.dayInMission}
              onSelectDayToLog={(day) => setDayToLog(day)}
            />
          </div>
        )}

        {/* Tab 2: Full 90-Day Chain Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <ChainMatrix
              mission={activeMission}
              logs={logs}
              currentDay={stats.dayInMission}
              onSelectDayToLog={(day) => {
                setDayToLog(day);
                setActiveTab('cockpit');
              }}
            />

            {/* Tactical Principle Card */}
            <div className="calendly-card p-6 sm:p-7 text-sm text-slate-gray space-y-2">
              <div className="flex items-center gap-2 text-ink-navy font-bold text-base">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>The Mathematical Power of the Unbroken Chain</span>
              </div>
              <p className="leading-relaxed text-xs sm:text-sm">
                Neuroplasticity research demonstrates that new behavioral scripts are solidified by continuous reinforcement frequency rather than prolonged session duration. When you log even a 2-minute <strong className="text-deep-cobalt">MVO</strong> on your lowest energy day, your cognitive identity ("I execute every single day") remains 100% intact.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Telemetry & Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <MomentumAnalytics
              mission={activeMission}
              stats={stats}
              logs={logs}
              variant="full"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="calendly-card p-6">
                <div className="text-xs font-semibold text-slate-gray uppercase mb-1">
                  Active Friction Coefficient
                </div>
                <div className="text-3xl font-bold text-signal-blue tabular-nums">
                  {(1 - stats.averageMomentumScore / 100).toFixed(2)}
                </div>
                <p className="text-xs text-slate-gray mt-2">
                  Target is 0.00 friction. Current velocity neutralizes cognitive startup resistance.
                </p>
              </div>

              <div className="calendly-card p-6">
                <div className="text-xs font-semibold text-slate-gray uppercase mb-1">
                  Peak Unbroken Streak
                </div>
                <div className="text-3xl font-bold text-ink-navy tabular-nums">
                  {stats.longestStreak} Days
                </div>
                <p className="text-xs text-slate-gray mt-2">
                  Longest continuous momentum chain maintained without a single lapse.
                </p>
              </div>

              <div className="calendly-card p-6">
                <div className="text-xs font-semibold text-slate-gray uppercase mb-1">
                  MVO Chain Rescue Rate
                </div>
                <div className="text-3xl font-bold text-deep-cobalt tabular-nums">
                  {stats.mvoDaysCount} Saves
                </div>
                <p className="text-xs text-slate-gray mt-2">
                  Days where Rule 2 execution prevented catastrophic zero-day regression.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Operating SOP */}
        {activeTab === 'sop' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <div className="calendly-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink-navy tracking-tight">
                    Project Zero Inertia — Operational Constitution
                  </h2>
                  <p className="text-sm text-slate-gray mt-1">
                    The non-negotiable behavioral laws engineered to systematically drive inertia to 0.00.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSopDrawerOpen(true)}
                  className="btn-outline text-xs py-2 px-4 self-start sm:self-auto"
                >
                  Open Interactive Drawer
                </button>
              </div>

              {/* 4 Core Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="calendly-card-inner p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink-navy text-base">
                    <span className="pill-badge text-[11px]">RULE 01</span>
                    <span>The 2-Minute Friction Killer</span>
                  </div>
                  <p className="text-xs text-slate-gray leading-relaxed">
                    When procrastination strikes, state: "I will do this task for only 2 minutes, then I am free to quit without guilt." In 90% of instances, this overcomes initial inertia and pulls you into deep flow.
                  </p>
                </div>

                <div className="calendly-card-inner p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink-navy text-base">
                    <span className="pill-badge text-[11px]">RULE 02</span>
                    <span>Never Zero Standard (The MVO Metric)</span>
                  </div>
                  <p className="text-xs text-slate-gray leading-relaxed">
                    Zero days are strictly prohibited. Every project has a Minimum Viable Output (MVO) requiring 2 to 10 minutes. Executing the MVO preserves the chain and halts retroactive guilt loops.
                  </p>
                </div>

                <div className="calendly-card-inner p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink-navy text-base">
                    <span className="pill-badge text-[11px]">RULE 03</span>
                    <span>Dopamine Regulation Protocol</span>
                  </div>
                  <p className="text-xs text-slate-gray leading-relaxed">
                    No hyper-stimulating digital content (reels, shorts, gaming) prior to work sessions. Dopamine rushes are strictly earned as rewards following task completion.
                  </p>
                </div>

                <div className="calendly-card-inner p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink-navy text-base">
                    <span className="pill-badge text-[11px]">RULE 04</span>
                    <span>Novelty Injection in Routine Tasks</span>
                  </div>
                  <p className="text-xs text-slate-gray leading-relaxed">
                    Combat mid-mission boredom by rotating micro-variables: change lighting, work standing for 20 minutes, or relocate workstation to reboot dopamine pathways without distraction.
                  </p>
                </div>
              </div>

              {/* The 24-Hour Reset Rule */}
              <div className="p-5 rounded-[16px] bg-[#fff7ed] border border-[#fed7aa] space-y-3">
                <div className="flex items-center gap-2 text-[#9a3412] font-bold text-base">
                  <Shield className="w-5 h-5 text-[#ea580c]" />
                  <span>The 24-Hour Reset Rule & Fail-Safe Protocol</span>
                </div>
                <p className="text-xs text-[#7c2d12] leading-relaxed">
                  Missing 1 day is an anomaly; missing 2 consecutive days is the birth of a new negative habit. The system mandates executing an emergency MVO within 24 hours of any lapse to immediately resurrect the momentum chain.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Open 24h Reset Recovery Protocol →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Mission Manager */}
        {activeTab === 'missions' && (
          <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-200">
            <div className="calendly-card p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-hairline">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink-navy tracking-tight">
                    Multi-Campaign Command Center
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-gray mt-1">
                    Manage operational campaigns with customized durations, phase calibrations, and core rules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMissionManagerOpen(true)}
                  className="btn-primary text-xs py-2 px-3.5 sm:px-4 self-start sm:self-auto shrink-0 gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Define New Mission</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {missions.map((m, index) => {
                  const isActive = m.id === activeMission.id;
                  const isFoundational = index === 0 || m.name.toLowerCase().includes('unbound');

                  return (
                    <div
                      key={m.id}
                      className={`p-4 sm:p-6 rounded-[16px] border transition-all flex flex-col justify-between overflow-hidden ${
                        isActive
                          ? 'bg-[#f0f7ff] border-signal-blue shadow-sm ring-1 ring-signal-blue/20'
                          : m.status === 'completed'
                          ? 'bg-pebble/60 border-hairline'
                          : 'bg-paper border-hairline hover:border-slate-gray/40 shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Header: Title, Codename & Status */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base sm:text-lg text-ink-navy break-words min-w-0">
                              {m.name}
                            </h3>
                            <div className="shrink-0">
                              {isActive && (
                                <span className="pill-badge text-[10px] sm:text-[11px] bg-emerald-100 text-emerald-800 whitespace-nowrap">
                                  Active
                                </span>
                              )}
                              {m.status === 'completed' && (
                                <span className="pill-badge-neutral text-[10px] sm:text-[11px] whitespace-nowrap">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="pill-badge text-[10px] sm:text-[11px] whitespace-nowrap">
                              {m.codename}
                            </span>
                            {isFoundational && (
                              <span className="pill-badge-neutral text-[10px] sm:text-[11px] inline-flex">
                                ⭐ Foundational Campaign
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-gray mt-2.5 leading-relaxed break-words">
                          {m.description}
                        </p>

                        {/* Strategic Phases */}
                        <div className="mt-3.5 space-y-1.5 text-xs text-slate-gray">
                          <div className="text-[10px] sm:text-[11px] font-bold text-ink-navy uppercase tracking-wider">
                            Strategic Phases:
                          </div>
                          {m.phases.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between gap-2 text-xs bg-pebble px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-[8px] border border-hairline"
                            >
                              <span className="text-ink-navy font-medium truncate text-xs">
                                {p.name}
                              </span>
                              <span className="font-semibold text-signal-blue shrink-0 text-[10px] sm:text-xs bg-paper px-2 py-0.5 rounded border border-hairline whitespace-nowrap">
                                Days {p.startDay}–{p.endDay}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-gray flex items-center gap-1.5 font-medium text-xs">
                          <Clock className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                          <span>{m.totalDays} Days Campaign</span>
                        </span>

                        <div>
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => handleSelectMission(m.id)}
                              className="btn-primary text-xs py-1.5 px-3 shrink-0"
                            >
                              Activate Mission →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-paper/95 backdrop-blur-md border-t border-hairline px-3 py-2 flex items-center justify-around shadow-lg"
      >
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-all cursor-pointer min-h-[44px] justify-center ${
            activeTab === 'cockpit'
              ? 'bg-pebble text-signal-blue font-bold shadow-xs'
              : 'text-slate-gray hover:text-ink-navy'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Cockpit</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-all cursor-pointer min-h-[44px] justify-center ${
            activeTab === 'matrix'
              ? 'bg-pebble text-signal-blue font-bold shadow-xs'
              : 'text-slate-gray hover:text-ink-navy'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Chain</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-all cursor-pointer min-h-[44px] justify-center ${
            activeTab === 'analytics'
              ? 'bg-pebble text-signal-blue font-bold shadow-xs'
              : 'text-slate-gray hover:text-ink-navy'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-all cursor-pointer min-h-[44px] justify-center ${
            activeTab === 'sop'
              ? 'bg-pebble text-signal-blue font-bold shadow-xs'
              : 'text-slate-gray hover:text-ink-navy'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] font-semibold">SOP</span>
        </button>

        <button
          onClick={() => setActiveTab('missions')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-[8px] transition-all cursor-pointer min-h-[44px] justify-center ${
            activeTab === 'missions'
              ? 'bg-pebble text-signal-blue font-bold shadow-xs'
              : 'text-slate-gray hover:text-ink-navy'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Missions</span>
        </button>
      </nav>

      {/* Global Modals */}
      <GamificationModal
        isOpen={isGamificationOpen}
        onClose={() => setIsGamificationOpen(false)}
        badges={badges}
        leaderboard={leaderboard}
        currentUser={user}
        stats={stats}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <EmergencyBreakerModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        defaultTaskName={emergencyTaskName}
        onSaveMvoComplete={handleEmergencyMvoComplete}
      />

      <MissionManagerModal
        isOpen={isMissionManagerOpen}
        onClose={() => setIsMissionManagerOpen(false)}
        missions={missions}
        activeMissionId={activeMission.id}
        onSelectMission={handleSelectMission}
        onCreateMission={handleCreateMission}
        onUpdateMissionStatus={handleUpdateMissionStatus}
      />

      <OperatingRulesDrawer
        isOpen={isSopDrawerOpen}
        onClose={() => setIsSopDrawerOpen(false)}
        onLaunchEmergency={() => {
          setIsSopDrawerOpen(false);
          setIsEmergencyOpen(true);
        }}
      />

      <FailSafeResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        mission={activeMission}
        onExecuteMvoRecovery={() => {
          handleEmergencyMvoComplete('Emergency 24-Hour Reset MVO');
        }}
      />

      {/* Professional Footer */}
      <footer className="border-t border-hairline bg-paper text-xs text-slate-gray hidden lg:block mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-6 border-b border-hairline">
            {/* Brand Column */}
            <div className="space-y-2.5 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-pebble border border-hairline flex items-center justify-center text-signal-blue font-bold text-xs shadow-xs">
                  ZI
                </div>
                <span className="font-bold text-ink-navy text-base tracking-tight">Project: Zero Inertia</span>
              </div>
              <p className="text-xs text-slate-gray leading-relaxed">
                A 90-day neuro-cognitive operating system engineered to permanently eliminate starting friction and build an unbreakable deep work momentum engine.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-gray">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Firebase Sync Active</span>
                <span className="text-mist-gray">·</span>
                <span className="font-semibold text-signal-blue">{activeMission.name}</span>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-4 text-xs">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-ink-navy uppercase tracking-wider">Navigation</div>
                {(['cockpit', 'matrix', 'analytics', 'sop', 'missions'] as const).map((tab) => {
                  const labels: Record<string, string> = {
                    cockpit: 'Cockpit Dashboard',
                    matrix: 'Chain Matrix',
                    analytics: 'Telemetry',
                    sop: 'SOP Rules',
                    missions: 'Mission Manager',
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="block text-slate-gray hover:text-signal-blue transition-colors cursor-pointer text-left"
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-ink-navy uppercase tracking-wider">System</div>
                <button onClick={() => setIsGamificationOpen(true)} className="block text-slate-gray hover:text-signal-blue transition-colors cursor-pointer text-left">Milestone Badges</button>
                <button onClick={() => setIsSopDrawerOpen(true)} className="block text-slate-gray hover:text-signal-blue transition-colors cursor-pointer text-left">Operating Rules Drawer</button>
                <button onClick={() => setIsResetModalOpen(true)} className="block text-slate-gray hover:text-signal-blue transition-colors cursor-pointer text-left">24h Fail-Safe Recovery</button>
                <button onClick={() => { setEmergencyTaskName(''); setIsEmergencyOpen(true); }} className="block text-slate-gray hover:text-signal-blue transition-colors cursor-pointer text-left">Emergency Friction Breaker</button>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-ink-navy uppercase tracking-wider">Mission Core Rules</div>
                <span className="block text-slate-gray">Rule 1: 2-Minute Friction Killer</span>
                <span className="block text-slate-gray">Rule 2: Never Zero Standard</span>
                <span className="block text-slate-gray">Rule 3: Dopamine Regulation</span>
                <span className="block text-slate-gray">Rule 4: Novelty Injection</span>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-gray">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span>© {new Date().getFullYear()}</span>
              <span className="font-bold text-ink-navy">RatioShift</span>
              <span className="text-mist-gray">·</span>
              <span>All rights reserved</span>
              <span className="text-mist-gray">·</span>
              <span>Developer: <span className="font-semibold text-ink-navy">Abdullah Al Azmain</span></span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-gray">
              <span className="pill-badge text-[10px]">v1.0.0</span>
              <span className="text-mist-gray">·</span>
              <span>Powered by Gemini AI</span>
              <span className="text-mist-gray">·</span>
              <a href="https://github.com/RatioShift/Zero-Inertia" target="_blank" rel="noopener noreferrer" className="hover:text-signal-blue transition-colors font-medium">GitHub ↗</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
