'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import FormField, { inputClassName } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Login failed.');
      return;
    }
    // If email not verified, redirect to verification page
    if (!result.emailVerified) {
      router.push('/verify-email');
      return;
    }
    router.push(result.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-xl dark:border-slate-600/50 dark:bg-slate-900/90"
    >
      <h1 className="text-2xl font-extrabold text-brand-primary">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to access your CareerNest dashboard.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormField label="Email" id="login-email">
          <input
            id="login-email"
            type="email"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </FormField>
        <FormField label="Password" id="login-password">
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={inputClassName + ' pr-11'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-primary py-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-sky-700 dark:text-sky-300 hover:underline">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
