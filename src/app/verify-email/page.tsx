'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MailCheck, RefreshCw, ArrowRight } from 'lucide-react';
import SiteLayout from '@/components/layout/SiteLayout';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
  const { firebaseUser, user, loading, resendVerification, refreshUser } = useAuth();
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // If user is already verified, redirect to dashboard
  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace('/login');
      return;
    }
    if (firebaseUser.emailVerified && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [firebaseUser, user, loading, router]);

  const handleResend = async () => {
    setResendLoading(true);
    setMessage('');
    setError('');
    const result = await resendVerification();
    setResendLoading(false);
    if (result.ok) {
      setMessage('Verification email sent! Check your inbox.');
    } else {
      setError(result.error ?? 'Failed to send verification email.');
    }
  };

  const handleCheckVerification = async () => {
    setCheckLoading(true);
    setMessage('');
    setError('');
    await refreshUser();
    setCheckLoading(false);

    // After refreshUser, firebaseUser will be updated via the effect above
    if (firebaseUser?.emailVerified) {
      setMessage('Email verified! Redirecting...');
      setTimeout(() => {
        router.push(user?.role === 'admin' ? '/admin' : '/dashboard');
      }, 1000);
    } else {
      setError('Email not yet verified. Please check your inbox and click the verification link.');
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 text-center shadow-xl dark:border-slate-600/50 dark:bg-slate-900/90"
        >
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-900/30">
            <MailCheck className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
            Verify your email
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            We&apos;ve sent a verification link to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {firebaseUser?.email ?? 'your email'}
            </span>
            . Please check your inbox and click the link to activate your account.
          </p>

          {/* Messages */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
            >
              {message}
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
            >
              {error}
            </motion.p>
          )}

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={checkLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {checkLoading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              I&apos;ve verified my email
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {resendLoading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Resend verification email
            </button>
          </div>

          <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </p>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
