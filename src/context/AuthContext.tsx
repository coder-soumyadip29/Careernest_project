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
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createUserProfile, getUserProfile, submitInquiry as submitInquiryToDb } from '@/lib/dbService';
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
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string; role?: UserProfile['role']; isNewUser?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, 'name' | 'email' | 'photoURL'>>) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  submitInquiry: (data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => Promise<{ ok: boolean }>;
  resendVerification: () => Promise<{ ok: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Seed non-auth localStorage data (removed per Q5)
  useEffect(() => {
    // No-op: We're fully Firestore now
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Fetch Firestore profile
        try {
          const result = await getUserProfile(fbUser.uid);
          setUser(result.success ? result.data : null);
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
    const result = await getUserProfile(fbUser.uid);
    setUser(result.success ? result.data : null);
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
      const result = await getUserProfile(fbUser.uid);
      setUser(result.success ? result.data : null);
      setFirebaseUser(fbUser);

      return { ok: true };
    } catch (err: any) {
      const code = err?.code ?? '';
      // Import dynamically to keep this callback lean
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
      const result = await getUserProfile(fbUser.uid);
      const profile = result.success ? result.data : null;
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

  const loginWithGoogle = useCallback(async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const fbUser = credential.user;
      setFirebaseUser(fbUser);

      // Check if user profile exists
      const existingProfile = await getUserProfile(fbUser.uid);
      let isNewUser = false;

      if (!existingProfile.success || !existingProfile.data) {
        // Create new profile for Google user
        isNewUser = true;
        await createUserProfile(fbUser.uid, {
          name: fbUser.displayName || 'User',
          email: fbUser.email || '',
          role: 'user',
          photoURL: fbUser.photoURL || undefined,
        });
      }

      // Fetch and set the profile
      const result = await getUserProfile(fbUser.uid);
      const profile = result.success ? result.data : null;
      setUser(profile);

      return {
        ok: true,
        role: profile?.role,
        isNewUser,
      };
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/popup-closed-by-user') {
        return { ok: false, error: 'Sign-in cancelled.' };
      }
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

        // Update Firestore profile (inlined since it's not in dbService spec)
        const userDoc = doc(db, 'Users', user.uid);
        await updateDoc(userDoc, data);

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
        const result = await submitInquiryToDb({
          ...data,
          userId: user?.uid,
        });
        return { ok: result.success };
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
      loginWithGoogle,
      logout,
      updateProfile,
      changePassword,
      submitInquiry,
      resendVerification,
      refreshUser,
    }),
    [user, firebaseUser, loading, login, register, loginWithGoogle, logout, updateProfile, changePassword, submitInquiry, resendVerification, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
