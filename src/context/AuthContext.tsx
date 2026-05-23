'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Inquiry, User } from '@/lib/types';
import {
  generateId,
  generateToken,
  getInquiries,
  getSession,
  getUsers,
  saveInquiries,
  saveUsers,
  seedDatabase,
  setSession,
} from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: User['role'] }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  submitInquiry: (data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => Promise<{ ok: boolean }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const session = getSession();
    if (!session) {
      setUser(null);
      return;
    }
    const found = getUsers().find((u) => u.id === session.userId) ?? null;
    setUser(found);
  }, []);

  useEffect(() => {
    seedDatabase();
    refreshUser();
    setLoading(false);
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    setSession({ userId: found.id, token: generateToken() });
    setUser(found);
    return { ok: true, role: found.role };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: generateId('user'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setSession({ userId: newUser.id, token: generateToken() });
    setUser(newUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
      if (!user) return { ok: false, error: 'Not authenticated.' };
      const users = getUsers();
      if (data.email && users.some((u) => u.id !== user.id && u.email === data.email.toLowerCase())) {
        return { ok: false, error: 'Email is already in use.' };
      }
      const updated: User = {
        ...user,
        ...data,
        email: data.email ? data.email.toLowerCase() : user.email,
      };
      saveUsers(users.map((u) => (u.id === user.id ? updated : u)));
      setUser(updated);
      return { ok: true };
    },
    [user]
  );

  const changePassword = useCallback(
    async (current: string, next: string) => {
      if (!user) return { ok: false, error: 'Not authenticated.' };
      if (user.password !== current) return { ok: false, error: 'Current password is incorrect.' };
      const updated = { ...user, password: next };
      saveUsers(getUsers().map((u) => (u.id === user.id ? updated : u)));
      setUser(updated);
      return { ok: true };
    },
    [user]
  );

  const submitInquiry = useCallback(
    async (data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
      const inquiries = getInquiries();
      const inquiry: Inquiry = {
        ...data,
        id: generateId('inq'),
        timestamp: new Date().toISOString(),
        status: 'new',
        userId: user?.id,
      };
      saveInquiries([inquiry, ...inquiries]);
      return { ok: true };
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      submitInquiry,
      refreshUser,
    }),
    [user, loading, login, register, logout, updateProfile, changePassword, submitInquiry, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
