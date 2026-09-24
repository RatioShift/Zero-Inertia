import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Mission } from '../types';

interface FailSafeResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  onExecuteMvoRecovery: () => void;
}

export const FailSafeResetModal: React.FC<FailSafeResetModalProps> = ({
  isOpen,
  onClose,
  mission,
  onExecuteMvoRecovery,
}) => {
  const [reason, setReason] = useState('Severe lethargy, overstimulation, and missed schedule yesterday');
  const [isLoading, setIsLoading] = useState(false);
  const [resetPlan, setResetPlan] = useState<{
    resetMotto: string;
    recoverySteps: string[];
    dopamineRegimen: string[];
    encouragement: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerateResetPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fail-safe-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionName: mission.name,
          missedDays: 1,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResetPlan(data.data);
      }
    } catch (e) {
      console.error(e);
      setResetPlan({
        resetMotto: 'A missed day is an accident; two missed days is a new habit. Reset within 24 hours.',
        recoverySteps: [
          'Execute the Minimum Viable Output (MVO) immediately—even just 2 minutes counts as a chain save.',
          'Zero guilt loop: eliminate retroactive rumination and focus strictly on the next 120 seconds.',
          'Log your status as MVO for today to lock the chain in local storage.',
        ],
        dopamineRegimen: [
          '20-minute physical walk with zero podcasts, reels, or music.',
          'Cold water splash to reset the parasympathetic nervous system.',
          'Delay all high-stimulation rewards until the daily MVO is logged.',
        ],
        encouragement: 'The mission is alive as long as you do not surrender day two. Execute MVO now.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl bg-paper">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-pebble shrink-0">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h2 className="font-bold text-base text-ink-navy">
                24-Hour Reset & Chain Defense Protocol
              </h2>
              <p className="text-xs text-slate-gray">
                The Non-Negotiable Rule: Never Allow Two Consecutive Skips.
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

        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs text-slate-gray">
          {/* Diagnostic Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-ink-navy">
              What caused the friction or lapse?
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Brain fog, doomscrolling loop, sudden deadline emergency..."
                className="calendly-input flex-1 text-xs"
              />
              <button
                onClick={handleGenerateResetPlan}
                disabled={isLoading}
                className="btn-primary text-xs py-2 px-4 shrink-0"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Generate Reset Plan</span>
              </button>
            </div>
          </div>

          {/* Golden Rule Callout */}
          <div className="p-4 rounded-[16px] calendly-card-inner flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-signal-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-ink-navy text-sm">The Neurobiology of the 24-Hour Reset:</span>
              <p className="text-slate-gray mt-1 leading-relaxed">
                When you miss one day, your brain's neural pathway for the habit is only slightly degraded. But if you miss the second day, your brain concludes the protocol has ended. Executing an MVO right now permanently blocks habit extinction.
              </p>
            </div>
          </div>

          {/* Generated Plan */}
          {resetPlan && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-[16px] bg-[#f0f7ff] border border-[#b8d5ff] font-semibold text-ink-navy text-center italic text-sm">
                "{resetPlan.resetMotto}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-[16px] calendly-card-inner">
                  <span className="font-bold text-signal-blue uppercase text-xs block mb-2">
                    Immediate Recovery Steps
                  </span>
                  <ul className="space-y-1.5">
                    {resetPlan.recoverySteps.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-ink-navy">
                        <span className="text-signal-blue font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-[16px] calendly-card-inner">
                  <span className="font-bold text-deep-cobalt uppercase text-xs block mb-2">
                    Dopamine Regimen Checklist
                  </span>
                  <ul className="space-y-1.5">
                    {resetPlan.dopamineRegimen.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-ink-navy">
                        <span className="text-deep-cobalt font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center text-slate-gray pt-1 text-xs">
                {resetPlan.encouragement}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-gray hover:text-ink-navy cursor-pointer py-2"
            >
              Dismiss
            </button>

            <button
              onClick={() => {
                onExecuteMvoRecovery();
                onClose();
              }}
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Emergency MVO & Resurrect Chain Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
