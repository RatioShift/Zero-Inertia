import React, { useState } from 'react';
import { BookOpen, AlertTriangle, ChevronRight, X } from 'lucide-react';

interface OperatingRulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchEmergency: () => void;
}

export const OperatingRulesDrawer: React.FC<OperatingRulesDrawerProps> = ({
  isOpen,
  onClose,
  onLaunchEmergency,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'failsafe' | 'neuro'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl bg-paper">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-pebble shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-signal-blue shrink-0" />
            <div>
              <h2 className="font-bold text-base text-ink-navy">
                Zero Inertia — Core Operating System & SOP
              </h2>
              <p className="text-xs text-slate-gray">
                Behavioral Framework & Neuro-Regulation Protocols
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

        {/* Tab Selector */}
        <div className="px-6 py-2.5 bg-paper border-b border-hairline flex flex-wrap items-center gap-2 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-pebble text-signal-blue border border-hairline shadow-xs'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            The 4 Non-Negotiable Rules
          </button>
          <button
            onClick={() => setActiveTab('failsafe')}
            className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer ${
              activeTab === 'failsafe'
                ? 'bg-pebble text-signal-blue border border-hairline shadow-xs'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Fail-Safe & 24h Reset Rule
          </button>
          <button
            onClick={() => setActiveTab('neuro')}
            className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer ${
              activeTab === 'neuro'
                ? 'bg-pebble text-signal-blue border border-hairline shadow-xs'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            Dopamine Crash Protocol
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs text-slate-gray leading-relaxed flex-1 bg-cloud">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {/* Rule 1 */}
              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="pill-badge text-[11px]">RULE 01</span>
                  <span className="text-ink-navy font-bold text-base">
                    The 2-Minute Friction Killer (SOP)
                  </span>
                </div>
                <p className="text-ink-navy text-sm">
                  When starting resistance or procrastination strikes, state to yourself: <strong className="text-signal-blue">"I will do this task for exactly 2 minutes, then I am free to quit without guilt."</strong>
                </p>
                <div className="mt-3 text-slate-gray bg-pebble p-3.5 rounded-[12px] border border-hairline">
                  <strong className="text-ink-navy">Neuroscience Reason:</strong> The basal ganglia resists the perceived energy cost of an entire 2-hour session. A 2-minute micro-commitment bypasses the limbic resistance gate. In 90% of cases, the wheel turns and you remain in flow.
                </div>
              </div>

              {/* Rule 2 */}
              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="pill-badge text-[11px]">RULE 02</span>
                  <span className="text-ink-navy font-bold text-base">
                    Never Zero Standard (The MVO Metric)
                  </span>
                </div>
                <p className="text-ink-navy text-sm">
                  Even on days of illness, acute mental fatigue, or emergency travel, the day <strong className="text-deep-cobalt">CANNOT BE ZERO</strong>.
                </p>
                <div className="mt-3 text-slate-gray bg-pebble p-3.5 rounded-[12px] border border-hairline">
                  <strong className="text-ink-navy">Standard Operating Definition:</strong> Execute the Minimum Viable Output (MVO) for 2 to 10 minutes (e.g. open your codebase and inspect 5 lines, or write 1 sentence). The chain stays intact, preventing retroactive guilt loops.
                </div>
              </div>

              {/* Rule 3 */}
              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="pill-badge text-[11px]">RULE 03</span>
                  <span className="text-ink-navy font-bold text-base">
                    Dopamine Regulation Protocol
                  </span>
                </div>
                <p className="text-ink-navy text-sm">
                  Under strict discipline, no high-intensity instant dopamine sources (reels, shorts, gaming) may be consumed prior to or during work hours.
                </p>
                <div className="mt-3 text-slate-gray bg-pebble p-3.5 rounded-[12px] border border-hairline">
                  <strong className="text-ink-navy">Reward Rule:</strong> Dopamine surges must be earned following task completion, never used as an avoidance tool.
                </div>
              </div>

              {/* Rule 4 */}
              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="pill-badge text-[11px]">RULE 04</span>
                  <span className="text-ink-navy font-bold text-base">
                    Novelty Injection in Routine Tasks
                  </span>
                </div>
                <p className="text-ink-navy text-sm">
                  Monotony depletes dopamine receptors. When routine tasks cause dullness, inject micro-novelty: adjust desk lighting, work standing for 20 minutes, or rotate workstations.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'failsafe' && (
            <div className="space-y-4">
              <div className="p-5 rounded-[16px] bg-[#fff7ed] border border-[#fed7aa] space-y-2">
                <div className="flex items-center gap-2 text-[#9a3412] font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#ea580c]" />
                  <span>The 24-Hour Reset Rule: Never Two Failures in a Row</span>
                </div>
                <p className="text-[#7c2d12]">
                  If an emergency, burnout, or complete lapse causes an unlogged or Zero Day: <strong className="text-[#9a3412]">DO NOT SURRENDER</strong>.
                </p>
                <div className="mt-3 text-slate-gray bg-paper p-4 rounded-[12px] border border-hairline space-y-1.5">
                  <div>• <strong className="text-ink-navy">1 Missed Day</strong> is a statistical anomaly or life accident.</div>
                  <div>• <strong className="text-ink-navy">2 Consecutive Missed Days</strong> is the biological birth of a new negative habit.</div>
                  <div>• The system mandates executing at least an <strong className="text-signal-blue">MVO</strong> within 24 hours of any lapse to instantly reboot the neural chain.</div>
                </div>
              </div>

              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-3">
                <h3 className="text-sm font-bold text-ink-navy">Emergency Recovery Flow</h3>
                <div className="space-y-2 text-xs text-slate-gray">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pebble text-signal-blue border border-hairline flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                    <span className="text-ink-navy">Eliminate rumination: Guilt consumes glucose and deepens procrastination.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pebble text-signal-blue border border-hairline flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
                    <span className="text-ink-navy">Launch the 2-Minute Emergency Breaker button immediately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pebble text-signal-blue border border-hairline flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
                    <span className="text-ink-navy">Log today as MVO Level (30%) to seal the breach and protect the chain.</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchEmergency();
                    }}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <span>Launch Emergency Breaker Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'neuro' && (
            <div className="space-y-4">
              <div className="calendly-card-sm p-5 bg-paper border border-hairline space-y-3">
                <h3 className="text-sm font-bold text-ink-navy">Dopamine Crash Contingency Protocol</h3>
                <p className="text-slate-gray">
                  When your brain enters acute dopamine depletion (feeling unable to focus, checking phone reflexively), follow this 3-step physical reset:
                </p>

                <div className="mt-3 space-y-3 text-xs">
                  <div className="p-3.5 rounded-[12px] bg-pebble border border-hairline">
                    <span className="font-bold text-ink-navy">Step 1: The 20-Minute Sensory Deprivation Walk</span>
                    <p className="text-slate-gray mt-1">
                      Walk outside for 20 minutes without headphones, phone, or music. Let optic flow and physical movement restore dopamine baseline.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[12px] bg-pebble border border-hairline">
                    <span className="font-bold text-ink-navy">Step 2: Cold Water Face Immersion</span>
                    <p className="text-slate-gray mt-1">
                      Splash cold water on your face for 30 seconds to trigger the mammalian dive reflex and stimulate the vagus nerve.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[12px] bg-pebble border border-hairline">
                    <span className="font-bold text-ink-navy">Step 3: Workstation Re-entry with MVO Only</span>
                    <p className="text-slate-gray mt-1">
                      Do not attempt a 2-hour session. Sit down only for the 2-minute MVO. Once finished, record status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
