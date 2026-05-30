'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import FormField, { inputClassName } from '@/components/ui/FormField';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/context/AuthContext';
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  passwordRequirements,
} from '@/lib/validations';

export default function SignupForm() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Real-time password strength checks
  const passwordChecks = useMemo(
    () => passwordRequirements.map((req) => ({ ...req, passed: req.test(password) })),
    [password]
  );

  const validate = () => {
    const next: Record<string, string> = {};
    const nameErr = validateName(name);
    if (nameErr) next.name = nameErr;
    const emailErr = validateEmail(email);
    if (emailErr) next.email = emailErr;
    const pwErr = validatePassword(password);
    if (pwErr) next.password = pwErr;
    const matchErr = validatePasswordMatch(password, confirm);
    if (matchErr) next.confirm = matchErr;
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
    // Redirect to email verification interstitial
    router.push('/verify-email');
  };

  const handleGoogleSignUp = async () => {
    setErrors({});
    const result = await loginWithGoogle();
    if (!result.ok) {
      setErrors({ form: result.error ?? 'Google sign-up failed.' });
      return;
    }
    // Google users are automatically verified, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl"
    >
      <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Join CareerNest to track placements and manage your profile.
      </p>

      {/* Google Sign-Up Button */}
      <div className="mt-8">
        <GoogleSignInButton onClick={handleGoogleSignUp} mode="signup" />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-slate-500">or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <FormField label="Full Name" id="signup-name" error={errors.name}>
          <input
            id="signup-name"
            className={inputClassName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </FormField>

        {/* Email */}
        <FormField label="Email" id="signup-email" error={errors.email}>
          <input
            id="signup-email"
            type="email"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </FormField>

        {/* Password with toggle */}
        <FormField label="Password" id="signup-password" error={errors.password}>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              className={inputClassName + ' pr-11'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
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

        {/* Password strength checklist */}
        {password.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3"
          >
            {passwordChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-xs">
                {check.passed ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-300" />
                )}
                <span className={check.passed ? 'text-emerald-700' : 'text-slate-500'}>
                  {check.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Confirm Password with toggle */}
        <FormField label="Confirm Password" id="signup-confirm" error={errors.confirm}>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              className={inputClassName + ' pr-11'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        {/* Form-level error */}
        {errors.form && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errors.form}
          </motion.p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-sky-600 hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
