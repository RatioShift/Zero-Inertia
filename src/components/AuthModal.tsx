import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Key, Mail, User, LogIn, UserPlus, Zap, AlertCircle, X,
  Eye, EyeOff, Chrome, RotateCcw, CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

// Password strength checker
function getPasswordStrength(p: string): { score: number; label: string; color: string } {
  if (p.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak', color: '#f59e0b' },
    { score: 3, label: 'Fair', color: '#eab308' },
    { score: 4, label: 'Strong', color: '#22c55e' },
    { score: 5, label: 'Very Strong', color: '#10b981' },
  ];
  return map[score] || map[0];
}

function validatePassword(p: string): string[] {
  const errors: string[] = [];
  if (p.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(p)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(p)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(p)) errors.push('One number');
  if (!/[^A-Za-z0-9]/.test(p)) errors.push('One special character (!@#$%...)');
  return errors;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInGuest, signInWithGoogle, sendPasswordReset, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const passwordStrength = mode === 'signup' ? getPasswordStrength(password) : null;
  const passwordErrors = mode === 'signup' && password ? validatePassword(password) : [];

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError(null);
    setSuccessMsg(null);
    setPassword('');
  };

  const humanizeError = (msg: string) => {
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
      return 'Invalid email or password. Please check your credentials.';
    if (msg.includes('email-already-in-use'))
      return 'This email is already registered. Please sign in instead.';
    if (msg.includes('weak-password'))
      return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
    if (msg.includes('too-many-requests'))
      return 'Too many failed attempts. Please wait a moment before trying again.';
    if (msg.includes('network-request-failed'))
      return 'Network error. Check your connection and try again.';
    if (msg.includes('popup-closed-by-user'))
      return 'Google sign-in was cancelled. Please try again.';
    if (msg.includes('EMAIL_NOT_VERIFIED'))
      return 'Please verify your email address. Check your inbox for a verification link.';
    return msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'reset') {
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      setIsSubmitting(true);
      try {
        await sendPasswordReset(email.trim());
        setSuccessMsg('Password reset email sent! Check your inbox (and spam folder).');
      } catch (err: any) {
        setError(humanizeError(err?.message || 'Reset failed.'));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!callsign.trim()) { setError('Please provide your Operative Callsign.'); return; }
      const pwErrors = validatePassword(password);
      if (pwErrors.length > 0) {
        setError(`Password requirements not met: ${pwErrors.join(', ')}.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, callsign.trim());
        setSuccessMsg('Account created! Please check your email to verify your address, then sign in.');
        switchMode('signin');
        return;
      }
      onClose();
    } catch (err: any) {
      setError(humanizeError(err?.message || 'Authentication failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(humanizeError(err?.message || 'Google sign-in failed.'));
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
      setError(humanizeError(err?.message || 'Guest launch failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-navy/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl bg-paper border border-hairline">

        {/* Header */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between bg-pebble">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[8px] bg-paper border border-hairline text-signal-blue shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink-navy">Operative Authentication</h3>
              <p className="text-[10px] text-slate-gray">Sync mission data across all devices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-slate-gray hover:text-ink-navy hover:bg-paper transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 p-1 mx-5 mt-4 mb-3 bg-pebble border border-hairline rounded-[8px]">
            <button
              onClick={() => switchMode('signin')}
              className={`py-1.5 text-xs font-semibold rounded-[6px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin' ? 'bg-paper text-signal-blue shadow-xs' : 'text-slate-gray hover:text-ink-navy'
              }`}
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`py-1.5 text-xs font-semibold rounded-[6px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup' ? 'bg-paper text-signal-blue shadow-xs' : 'text-slate-gray hover:text-ink-navy'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Reset password header */}
        {mode === 'reset' && (
          <div className="px-5 pt-4 pb-1 flex items-center gap-2">
            <button onClick={() => switchMode('signin')} className="p-1 hover:bg-pebble rounded text-slate-gray hover:text-ink-navy transition-colors cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-ink-navy">Reset Password</span>
          </div>
        )}

        {/* Alerts */}
        <div className="px-5">
          {error && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-[8px] text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-[8px] text-xs text-emerald-700 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Google Sign-In — only for signin/signup modes */}
        {mode !== 'reset' && (
          <div className="px-5 mb-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2 px-4 bg-paper border border-hairline hover:bg-pebble hover:border-slate-gray/40 rounded-[8px] text-xs font-semibold text-ink-navy transition-all cursor-pointer disabled:opacity-60"
            >
              {/* Google SVG icon */}
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-hairline" />
              <span className="text-[10px] text-mist-gray font-medium">or with email</span>
              <div className="flex-1 h-px bg-hairline" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3">
          {/* Callsign — signup only */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-ink-navy mb-1">Operative Callsign *</label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 text-mist-gray absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="e.g. Ghost-01, Major Vance"
                  className="calendly-input text-sm"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-navy mb-1">
              {mode === 'reset' ? 'Your Account Email' : 'Operative Email *'}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-mist-gray absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@zero-inertia.org"
                className="calendly-input text-sm"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Password — not shown on reset mode */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-[11px] font-semibold text-ink-navy mb-1">
                Password {mode === 'signup' ? '*' : '*'}
              </label>
              <div className="relative flex items-center">
                <Key className="w-3.5 h-3.5 text-mist-gray absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'signup' ? 8 : 6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 8 chars, A-Z, a-z, 0-9, !@#' : '••••••••'}
                  className="calendly-input text-sm"
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-mist-gray hover:text-slate-gray transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password strength for signup */}
              {mode === 'signup' && password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 rounded-full bg-hairline overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength!.score / 5) * 100}%`,
                          backgroundColor: passwordStrength!.color || '#d4e0ed',
                        }}
                      />
                    </div>
                    {passwordStrength!.label && (
                      <span className="text-[10px] font-semibold" style={{ color: passwordStrength!.color }}>
                        {passwordStrength!.label}
                      </span>
                    )}
                  </div>
                  {passwordErrors.length > 0 && (
                    <p className="text-[10px] text-slate-gray">
                      Needs: {passwordErrors.join(' · ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forgot Password link — signin only */}
          {mode === 'signin' && (
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="text-[11px] text-signal-blue hover:underline font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn-primary w-full py-2.5 text-xs font-bold disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>
                  {mode === 'reset' ? 'Sending Reset Link...' : mode === 'signin' ? 'Authorizing...' : 'Creating Account...'}
                </span>
              </span>
            ) : mode === 'reset' ? (
              'Send Reset Link'
            ) : mode === 'signin' ? (
              'Authorize & Synchronize'
            ) : (
              'Deploy Operative Account'
            )}
          </button>

          {/* Email verification notice for signup */}
          {mode === 'signup' && (
            <p className="text-[10px] text-slate-gray text-center leading-relaxed">
              A verification email will be sent after registration. Firebase Password Policy requires uppercase, lowercase, number, and special character.
            </p>
          )}

          {/* Guest / Anonymous mode — only for signin */}
          {mode === 'signin' && (
            <div className="pt-2 border-t border-hairline text-center">
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isSubmitting}
                className="text-xs text-slate-gray hover:text-signal-blue font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-0.5 disabled:opacity-50"
              >
                <Zap className="w-3 h-3 text-signal-blue" />
                <span>Continue anonymously (no sync)</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
