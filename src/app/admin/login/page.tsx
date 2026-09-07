'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { setAdminSession } from '@/actions/auth';
import { Lock, Mail, User, AlertCircle, CheckCircle2, Eye, EyeOff, Hammer, Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleModeSwitch = (newMode: AuthMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        errors.fullName = 'Full Name is required.';
      } else if (fullName.trim().length < 2) {
        errors.fullName = 'Full Name must be at least 2 characters.';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const mapFirebaseError = (codeOrMessage: string): string => {
    const str = String(codeOrMessage);
    if (str.includes('auth/email-already-in-use')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (str.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (str.includes('auth/weak-password')) {
      return 'Password must be at least 8 characters long.';
    }
    if (
      str.includes('auth/user-not-found') ||
      str.includes('auth/wrong-password') ||
      str.includes('auth/invalid-credential')
    ) {
      return 'Invalid email or password. Please verify your credentials.';
    }
    if (str.includes('auth/too-many-requests')) {
      return 'Too many failed login attempts. Access temporarily restricted. Try again later.';
    }
    if (str.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection.';
    }
    return str.replace(/^Firebase:\s*/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateForm()) return;

    setIsPending(true);

    try {
      if (mode === 'signin') {
        // Firebase Authentication: Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const idToken = await userCredential.user.getIdToken();

        // Establish HTTP-only session cookie for Next.js route middleware
        const sessionRes = await setAdminSession(idToken);
        if (!sessionRes.success) {
          throw new Error(sessionRes.error || 'Failed to establish session.');
        }

        setSuccessMsg('Sign in successful! Redirecting to workspace...');
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 600);
      } else {
        // Firebase Authentication: Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Store user profile in Firestore `users` collection
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          full_name: fullName.trim(),
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Establish HTTP-only session cookie for Next.js route middleware
        const idToken = await user.getIdToken();
        const sessionRes = await setAdminSession(idToken);
        if (!sessionRes.success) {
          throw new Error(sessionRes.error || 'Account created but session creation failed.');
        }

        setSuccessMsg('Account created successfully! Redirecting to workspace...');
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 600);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      setErrorMsg(mapFirebaseError(err.code || err.message));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual grain overlay */}
      <div className="absolute inset-0 noise z-0 opacity-10" />
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-md w-full flex flex-col gap-8 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-white/5 text-accent rounded-xl flex items-center justify-center shadow-lg border border-white/10">
            <Hammer className="w-6 h-6 animate-float text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              RANJAN ENTERPRISES
            </span>
            <span className="font-display text-[10px] tracking-[0.25em] text-accent uppercase font-medium mt-0.5">
              Secure Admin Workshop
            </span>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-stone-950/70 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-luxury-lg transition-all duration-300">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-stone-900/90 p-1.5 rounded-xl border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                mode === 'signin'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="font-serif text-xl font-bold text-white mb-2 text-center">
            {mode === 'signin' ? 'Sign In to Workspace' : 'Create Admin Account'}
          </h2>
          <p className="text-xs text-stone-400 text-center mb-6">
            {mode === 'signin'
              ? 'Access the master workshop dashboard and site controls.'
              : 'Register a new administrator account with Firestore.'}
          </p>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/50 text-emerald-400 rounded-xl flex items-center gap-3 border border-emerald-800/40 text-xs font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/50 text-red-400 rounded-xl flex items-center gap-3 border border-red-800/40 text-xs font-semibold animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            
            {/* Full Name Field (Sign Up Mode) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-stone-500" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 bg-stone-900/60 border ${
                      fieldErrors.fullName ? 'border-red-500/80 focus:ring-red-500' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500'
                    } rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 text-sm transition-colors`}
                    disabled={isPending}
                  />
                </div>
                {fieldErrors.fullName && (
                  <span className="text-[11px] text-red-400 mt-0.5">{fieldErrors.fullName}</span>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-stone-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ranjanenterprises.com"
                  className={`w-full pl-10 pr-4 py-3 bg-stone-900/60 border ${
                    fieldErrors.email ? 'border-red-500/80 focus:ring-red-500' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 text-sm transition-colors`}
                  disabled={isPending}
                />
              </div>
              {fieldErrors.email && (
                <span className="text-[11px] text-red-400 mt-0.5">{fieldErrors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {mode === 'signup' ? 'Password (Min 8 chars)' : 'Workspace Password'}
                </label>
                {mode === 'signin' && (
                  <Link href="/admin/forgot-password" className="text-[10px] font-bold text-amber-500 hover:text-white uppercase tracking-widest transition-colors">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-stone-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-stone-900/60 border ${
                    fieldErrors.password ? 'border-red-500/80 focus:ring-red-500' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500'
                  } rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 text-sm transition-colors`}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-[11px] text-red-400 mt-0.5">{fieldErrors.password}</span>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Mode) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-stone-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-stone-900/60 border ${
                      fieldErrors.confirmPassword ? 'border-red-500/80 focus:ring-red-500' : 'border-stone-800 focus:border-amber-500 focus:ring-amber-500'
                    } rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 text-sm transition-colors`}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-[11px] text-red-400 mt-0.5">{fieldErrors.confirmPassword}</span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-3 w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 transition-all duration-300 disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{mode === 'signin' ? 'Authenticating Workspace...' : 'Creating Account...'}</span>
                </>
              ) : (
                <span>{mode === 'signin' ? 'Sign In To Panel' : 'Create Account'}</span>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
