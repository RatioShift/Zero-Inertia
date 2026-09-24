import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Mail, User, LogIn, UserPlus, Zap, AlertCircle, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInGuest, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        if (!callsign.trim()) {
          setError('Please provide your Operative Callsign.');
          setIsSubmitting(false);
          return;
        }
        await signUp(email.trim(), password, callsign.trim());
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err?.message || 'Authentication failed. Please verify credentials.';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid operative email or access key.';
      } else if (msg.includes('email-already-in-use')) {
        msg = 'This operative email is already registered. Please sign in.';
      } else if (msg.includes('weak-password')) {
        msg = 'Access key must be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInGuest(callsign.trim() || 'Ghost Operative');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Guest launch failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="calendly-card rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl bg-paper">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-pebble shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-paper border border-hairline text-signal-blue shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink-navy">
                Operative Authentication
              </h3>
              <p className="text-[11px] text-slate-gray">
                Synchronize mission chains and telemetry across devices.
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

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 m-6 mb-4 bg-pebble border border-hairline rounded-[8px]">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-[6px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin'
                ? 'bg-paper text-signal-blue shadow-xs'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-[6px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-paper text-signal-blue shadow-xs'
                : 'text-slate-gray hover:text-ink-navy'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Operative</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[8px] text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-ink-navy mb-1.5">
                Operative Callsign *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-mist-gray absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="e.g. Ghost-01, Major Vance"
                  className="calendly-input w-full pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink-navy mb-1.5">
              Operative Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mist-gray absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@zero-inertia.org"
                className="calendly-input w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-navy mb-1.5">
              Secure Access Key (Password) *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-mist-gray absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="calendly-input w-full pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn-primary w-full py-2.5 px-4 text-xs font-bold shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Authorizing Operative...</span>
              </span>
            ) : mode === 'signin' ? (
              <span>Authorize & Synchronize</span>
            ) : (
              <span>Deploy Operative Account</span>
            )}
          </button>

          <div className="pt-2 border-t border-hairline text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isSubmitting}
              className="text-xs text-slate-gray hover:text-signal-blue font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-1"
            >
              <Zap className="w-3.5 h-3.5 text-signal-blue" />
              <span>Or proceed instantly as Anonymous Operative</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
