import React, { useState } from 'react';
import { Mission, PhaseConfig } from '../types';
import { Layers, Plus, Check, Clock, CheckCircle, X } from 'lucide-react';
import { fireMilestoneConfetti } from '../utils/gamification';

interface MissionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: Mission[];
  activeMissionId: string;
  onSelectMission: (missionId: string) => void;
  onCreateMission: (newMission: Mission) => void;
  onUpdateMissionStatus?: (missionId: string, status: 'active' | 'completed' | 'archived') => void;
}

export const MissionManagerModal: React.FC<MissionManagerModalProps> = ({
  isOpen,
  onClose,
  missions,
  activeMissionId,
  onSelectMission,
  onCreateMission,
  onUpdateMissionStatus,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Form state
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [totalDays, setTotalDays] = useState(90);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  
  // Custom Phases
  const [phaseAFocus, setPhaseAFocus] = useState('Build the 2-minute starting habit. Output is secondary.');
  const [phaseBFocus, setPhaseBFocus] = useState('Stabilize consistency and overcome mid-point monotony.');
  const [phaseCFocus, setPhaseCFocus] = useState('Deep flow mastery and zero inertia default state.');

  // Core Rules
  const [coreRulesText, setCoreRulesText] = useState(
    '1. The 2-Minute Friction Killer\n2. Never Zero Standard (MVO Backup)\n3. Dopamine Regulation Protocol\n4. Novelty Injection in Routine'
  );

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate 3 balanced phases based on total days
    const phaseAEnd = Math.max(7, Math.round(totalDays * 0.16));
    const phaseBEnd = Math.max(phaseAEnd + 7, Math.round(totalDays * 0.5));

    const phases: PhaseConfig[] = [
      {
        id: 'phase-a',
        name: 'Phase A: Ignition & Adaptation',
        startDay: 1,
        endDay: phaseAEnd,
        mindset: 'Output is secondary. Starting instinct is the sole objective.',
        coreFocus: phaseAFocus.trim() || 'Master 2-minute friction killer.',
        milestoneObjective: '0% consecutive skips using MVO backups.',
      },
      {
        id: 'phase-b',
        name: 'Phase B: Stabilization & Habit Lock',
        startDay: phaseAEnd + 1,
        endDay: phaseBEnd,
        mindset: 'Overcome monotony with novelty injections.',
        coreFocus: phaseBFocus.trim() || 'Dopamine resistance. Never allow two consecutive zero days.',
        milestoneObjective: 'Mid-mission streak consistency.',
      },
      {
        id: 'phase-c',
        name: 'Phase C: Unbound Scale & Mastery',
        startDay: phaseBEnd + 1,
        endDay: totalDays,
        mindset: 'Zero inertia execution is the default reality.',
        coreFocus: phaseCFocus.trim() || 'Sustained frictionless deep work sessions.',
        milestoneObjective: 'Autonomous high-stakes flow state.',
      },
    ];

    const parsedRules = coreRulesText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      name: name.trim(),
      codename: codename.trim().toUpperCase() || 'ZERO-INERTIA-EXP',
      totalDays,
      startDate: startDate || new Date().toISOString().split('T')[0],
      description: description.trim() || 'Custom strategic execution mission powered by Project: Zero Inertia.',
      phases,
      coreRules: parsedRules.length > 0 ? parsedRules : undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onCreateMission(newMission);
    fireMilestoneConfetti();
    setName('');
    setCodename('');
    setDescription('');
    setIsCreating(false);
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === 'active') return m.status === 'active';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl bg-paper">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-pebble shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-paper border border-hairline text-signal-blue shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-ink-navy">
                Mission Command Center
              </h2>
              <p className="text-xs text-slate-gray">
                Manage operational campaigns, configure strategic phase windows, or deploy new targets.
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

        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 bg-cloud flex-1">
          {!isCreating ? (
            <>
              {/* Mission Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
                <div className="flex items-center gap-1.5 p-1 bg-pebble border border-hairline rounded-[8px] text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                      filter === 'all' ? 'bg-paper text-signal-blue shadow-xs border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                    }`}
                  >
                    All ({missions.length})
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                      filter === 'active' ? 'bg-paper text-signal-blue shadow-xs border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
                      filter === 'completed' ? 'bg-paper text-signal-blue shadow-xs border border-hairline' : 'text-slate-gray hover:text-ink-navy'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-primary text-xs py-2 px-4 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Define New Mission</span>
                </button>
              </div>

              {/* Mission Cards */}
              <div className="space-y-3.5">
                {filteredMissions.map((m, index) => {
                  const isActive = m.id === activeMissionId;
                  const isFoundational = index === 0 || m.name.toLowerCase().includes('unbound');

                  return (
                    <div
                      key={m.id}
                      className={`p-5 rounded-[16px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-[#f0f7ff] border-signal-blue shadow-sm ring-1 ring-signal-blue/20'
                          : m.status === 'completed'
                          ? 'bg-pebble/60 border-hairline'
                          : 'bg-paper border-hairline hover:border-slate-gray/40 shadow-xs'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-ink-navy">
                            {m.name}
                          </span>
                          <span className="pill-badge text-[11px]">
                            {m.codename}
                          </span>
                          {isFoundational && (
                            <span className="pill-badge-neutral text-[11px]">
                              ⭐ Foundational
                            </span>
                          )}
                          {isActive && (
                            <span className="pill-badge text-[11px] bg-emerald-100 text-emerald-800">
                              Active Campaign
                            </span>
                          )}
                          {m.status === 'completed' && (
                            <span className="pill-badge-neutral text-[11px]">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Completed
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-gray mt-2 leading-relaxed">
                          {m.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-gray mt-3">
                          <span className="flex items-center gap-1 font-semibold text-ink-navy">
                            <Clock className="w-3.5 h-3.5 text-signal-blue" />
                            {m.totalDays} Days
                          </span>
                          <span className="text-mist-gray">·</span>
                          <span>3 Strategic Phases</span>
                          <span className="text-mist-gray">·</span>
                          <span>Start: {m.startDate}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-hairline">
                        {m.status !== 'completed' && onUpdateMissionStatus && (
                          <button
                            onClick={() => onUpdateMissionStatus(m.id, 'completed')}
                            title="Mark Mission as Completed"
                            className="btn-outline text-xs py-1.5 px-3"
                          >
                            Mark Completed
                          </button>
                        )}

                        {m.status === 'completed' && onUpdateMissionStatus && (
                          <button
                            onClick={() => onUpdateMissionStatus(m.id, 'active')}
                            title="Re-activate Mission"
                            className="btn-outline text-xs py-1.5 px-3"
                          >
                            Reactivate
                          </button>
                        )}

                        {isActive ? (
                          <span className="px-3 py-1.5 text-xs text-signal-blue font-bold flex items-center gap-1">
                            <Check className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectMission(m.id);
                              onClose();
                            }}
                            className="btn-primary text-xs py-2 px-4"
                          >
                            Activate Mission →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Create New Mission Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <div>
                  <h3 className="font-bold text-base text-ink-navy">
                    Define Strategic Operational Mission
                  </h3>
                  <p className="text-xs text-slate-gray">
                    Calibrate campaign duration, strategic focus per phase, and non-negotiable rules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-semibold text-slate-gray hover:text-ink-navy cursor-pointer py-1"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                  Mission Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quantitative Deep Work Sprint"
                  className="calendly-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                    Codename (Tactical Token)
                  </label>
                  <input
                    type="text"
                    value={codename}
                    onChange={(e) => setCodename(e.target.value)}
                    placeholder="e.g. QDW-90"
                    className="calendly-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    required
                    value={totalDays}
                    onChange={(e) => setTotalDays(Number(e.target.value))}
                    className="calendly-input w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="calendly-input w-full font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                  Mission Scope & Cognitive Target
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the core neuro-objective, friction you are targeting, or milestone to conquer..."
                  className="calendly-input w-full"
                />
              </div>

              {/* Custom Strategic Phase Calibrations */}
              <div className="space-y-2 pt-2 border-t border-hairline">
                <h4 className="text-xs font-bold text-ink-navy uppercase tracking-wider">
                  Strategic Phase Calibration
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 bg-paper rounded-[12px] border border-hairline">
                    <span className="font-bold text-ink-navy block mb-1">
                      Phase A: Ignition & Adaptation (Days 1–{Math.max(7, Math.round(totalDays * 0.16))})
                    </span>
                    <input
                      type="text"
                      value={phaseAFocus}
                      onChange={(e) => setPhaseAFocus(e.target.value)}
                      placeholder="Phase A Core Focus..."
                      className="calendly-input w-full py-1.5 text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-paper rounded-[12px] border border-hairline">
                    <span className="font-bold text-ink-navy block mb-1">
                      Phase B: Habit & Momentum Lock (Days {Math.max(7, Math.round(totalDays * 0.16)) + 1}–{Math.max(Math.max(7, Math.round(totalDays * 0.16)) + 7, Math.round(totalDays * 0.5))})
                    </span>
                    <input
                      type="text"
                      value={phaseBFocus}
                      onChange={(e) => setPhaseBFocus(e.target.value)}
                      placeholder="Phase B Core Focus..."
                      className="calendly-input w-full py-1.5 text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-paper rounded-[12px] border border-hairline">
                    <span className="font-bold text-ink-navy block mb-1">
                      Phase C: Unbound Scale & Mastery (Days {Math.max(Math.max(7, Math.round(totalDays * 0.16)) + 7, Math.round(totalDays * 0.5)) + 1}–{totalDays})
                    </span>
                    <input
                      type="text"
                      value={phaseCFocus}
                      onChange={(e) => setPhaseCFocus(e.target.value)}
                      placeholder="Phase C Core Focus..."
                      className="calendly-input w-full py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Core Rules */}
              <div className="pt-2 border-t border-hairline">
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                  Non-Negotiable Mission Operating Rules (One rule per line)
                </label>
                <textarea
                  rows={3}
                  value={coreRulesText}
                  onChange={(e) => setCoreRulesText(e.target.value)}
                  className="calendly-input w-full font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Deploy & Initialize Mission
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
