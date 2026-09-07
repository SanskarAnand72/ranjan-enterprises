'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requestPasswordReset } from '@/actions/auth';
import { Mail, AlertCircle, CheckCircle, Hammer, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccessMsg('A password reset link has been sent to your email.');
        setEmail('');
      } else {
        setErrorMsg(res.error || 'Failed to send reset link. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to process your request. Please check your connection.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual grain overlay */}
      <div className="absolute inset-0 noise z-0 opacity-10" />
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-md w-full flex flex-col gap-8 relative z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-white/5 text-accent rounded-xl flex items-center justify-center shadow-lg border border-white/10">
            <Hammer className="w-6 h-6 animate-float" />
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

        {/* Forgot Password Card */}
        <div className="bg-stone-950/60 border border-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-luxury-lg">
          <div className="flex flex-col mb-6">
            <h2 className="font-serif text-xl font-bold text-white text-center">
              Reset Password
            </h2>
            <p className="text-stone-400 text-xs text-center mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/40 text-red-400 rounded-xl flex items-center gap-3 border border-red-900/30 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-950/40 text-green-400 rounded-xl flex items-center gap-3 border border-green-900/30 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
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
                  className="w-full pl-10 pr-4 py-3 bg-stone-900/50 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-xs tracking-wider uppercase shadow-lg shadow-primary/20 hover:shadow-glow transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              {isPending ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
            
            <div className="mt-4 flex justify-center">
              <Link href="/admin/login" className="flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-white uppercase tracking-widest transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
