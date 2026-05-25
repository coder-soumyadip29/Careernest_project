'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/types';

export interface UseUserDataReturn {
  /** Display name from Firestore profile */
  name: string;
  /** Email from Firestore profile */
  email: string;
  /** User role: 'user' | 'admin' */
  role: UserRole;
  /** Avatar URL (empty string if not set) */
  photoURL: string;
  /** Firebase Auth UID */
  uid: string;
  /** True while Firebase Auth state is resolving */
  loading: boolean;
  /** True when user profile has been loaded */
  isAuthenticated: boolean;
  /** 0-100 profile completion based on filled fields */
  profileCompletion: number;
  /** Whether the user's email has been verified */
  emailVerified: boolean;
}

/**
 * Dashboard-focused data hook.
 *
 * Wraps `useAuth()` and derives a slim, read-only view of the current
 * user's profile data plus a computed `profileCompletion` percentage.
 */
export function useUserData(): UseUserDataReturn {
  const { user, firebaseUser, loading } = useAuth();

  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const fields = [
      user.name,
      user.email,
      user.photoURL,
      user.phone,
      user.department,
    ];

    const filled = fields.filter((f) => typeof f === 'string' && f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'user',
    photoURL: user?.photoURL ?? '',
    uid: user?.uid ?? '',
    loading,
    isAuthenticated: !!user,
    profileCompletion,
    emailVerified: firebaseUser?.emailVerified ?? false,
  };
}
