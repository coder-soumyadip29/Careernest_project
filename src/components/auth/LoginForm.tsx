'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FormField, { inputClassName } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    router.push(result.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-xl dark:border-slate-600/50 dark:bg-slate-900/90"
    >
      <h1 className="text-2xl font-extrabold text-brand-primary">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to access your CarrierNest dashboard.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormField label="Email" id="login-email">
          <input id="login-email" type="email" className={inputClassName} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormField>
        <FormField label="Password" id="login-password">
          <input id="login-password" type="password" className={inputClassName} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </FormField>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-primary py-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-sky-700 dark:text-sky-300 hover:underline">
          Create one
        </Link>
      </p>
      <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        Demo admin: admin@carriernest.com / Admin@123<br />
        Demo user: demo@carriernest.com / Demo@123
      </p>
    </motion.div>
  );
}
