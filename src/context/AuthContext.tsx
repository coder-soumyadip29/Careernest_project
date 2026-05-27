'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile, updateUserProfile, addInquiry } from '@/lib/firestore';
import type { Inquiry, UserProfile } from '@/lib/types';

interface AuthContextValue {
  /** The Firestore user profile (null if logged out or loading) */
  user: UserProfile | null;
  /** The raw Firebase Auth user (needed for emailVerified etc.) */
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: UserProfile['role']; emailVerified?: boolean }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, 'name' | 'email' | 'photoURL'>>) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  submitInquiry: (data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => Promise<{ ok: boolean }>;
  resendVerification: () => Promise<{ ok: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Fetch Firestore profile
        try {
          const profile = await getUserProfile(fbUser.uid);
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = useCallback(async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) {
      setUser(null);
      setFirebaseUser(null);
      return;
    }
    await fbUser.reload();
    setFirebaseUser({ ...fbUser });
    const profile = await getUserProfile(fbUser.uid);
    setUser(profile);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;

      // Set display name on Firebase Auth profile
      await firebaseUpdateProfile(fbUser, { displayName: name });

      // Send email verification
      await sendEmailVerification(fbUser);

      // Create Firestore user profile
      await createUserProfile(fbUser.uid, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'user',
      });

      // Fetch and set the profile
      const profile = await getUserProfile(fbUser.uid);
      setUser(profile);
      setFirebaseUser(fbUser);

      return { ok: true };
    } catch (err: any) {
      const code = err?.code ?? '';
      const { getFirebaseErrorMessage } = await import('@/lib/validations');
      return { ok: false, error: getFirebaseErrorMessage(code) };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;
      setFirebaseUser(fbUser);

      // Fetch Firestore profile to get role
      const profile = await getUserProfile(fbUser.uid);
      setUser(profile);

      return {
        ok: true,
        role: profile?.role,
        emailVerified: fbUser.emailVerified,
      };
    } catch (err: any) {
      const code = err?.code ?? '';
      const { getFirebaseErrorMessage } = await import('@/lib/validations');
      return { ok: false, error: getFirebaseErrorMessage(code) };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Pick<UserProfile, 'name' | 'email' | 'photoURL'>>) => {
      if (!firebaseUser || !user) return { ok: false, error: 'Not authenticated.' };
      try {
        // Update Firebase Auth display name if name changed
        if (data.name) {
          await firebaseUpdateProfile(firebaseUser, { displayName: data.name });
        }
        if (data.photoURL !== undefined) {
          await firebaseUpdateProfile(firebaseUser, { photoURL: data.photoURL });
        }

        // Update Firestore profile
        await updateUserProfile(user.uid, data);

        // Refresh local state
        await refreshUser();
        return { ok: true };
      } catch {
        return { ok: false, error: 'Failed to update profile.' };
      }
    },
    [firebaseUser, user, refreshUser]
  );

  const changePassword = useCallback(
    async (current: string, next: string) => {
      if (!firebaseUser || !user) return { ok: false, error: 'Not authenticated.' };
      try {
        // Re-authenticate before password change (Firebase requirement)
        const credential = EmailAuthProvider.credential(firebaseUser.email!, current);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, next);
        return { ok: true };
      } catch (err: any) {
        if (err?.code === 'auth/wrong-password') {
          return { ok: false, error: 'Current password is incorrect.' };
        }
        return { ok: false, error: 'Failed to update password. Please re-login and try again.' };
      }
    },
    [firebaseUser, user]
  );

  const submitInquiry = useCallback(
    async (data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
      try {
        await addInquiry({
          ...data,
          userId: user?.uid,
        });
        return { ok: true };
      } catch (err) {
        console.error('Error submitting inquiry to Firestore:', err);
        return { ok: false };
      }
    },
    [user]
  );

  const resendVerification = useCallback(async () => {
    if (!firebaseUser) return { ok: false, error: 'Not authenticated.' };
    try {
      await sendEmailVerification(firebaseUser);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Failed to send verification email. Please try again later.' };
    }
  }, [firebaseUser]);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      submitInquiry,
      resendVerification,
      refreshUser,
    }),
    [user, firebaseUser, loading, login, register, logout, updateProfile, changePassword, submitInquiry, resendVerification, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}