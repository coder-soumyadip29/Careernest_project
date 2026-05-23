'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FormField, { inputClassName } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

export default function SignupForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Valid email is required.';
    if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (!result.ok) {
      setErrors({ form: result.error ?? 'Registration failed.' });
      return;
    }
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-xl dark:border-slate-600/50 dark:bg-slate-900/90"
    >
      <h1 className="text-2xl font-extrabold text-brand-primary">Create your account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join CarrierNest to track placements and manage your profile.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormField label="Full Name" id="signup-name" error={errors.name}>
          <input id="signup-name" className={inputClassName} value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="Email" id="signup-email" error={errors.email}>
          <input id="signup-email" type="email" className={inputClassName} value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField label="Password" id="signup-password" error={errors.password}>
          <input id="signup-password" type="password" className={inputClassName} value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <FormField label="Confirm Password" id="signup-confirm" error={errors.confirm}>
          <input id="signup-confirm" type="password" className={inputClassName} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </FormField>
        {errors.form && <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-primary py-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-sky-700 dark:text-sky-300 hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
