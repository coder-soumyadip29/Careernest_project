import type { AuthSession, Inquiry, ServiceItem, User } from './types';
import { defaultServices } from './data';

const KEYS = {
  users: 'cn_users',
  session: 'cn_session',
  inquiries: 'cn_inquiries',
  services: 'cn_services',
  seeded: 'cn_seeded',
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function seedDatabase() {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(KEYS.seeded)) return;

  const admin: User = {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@carriernest.com',
    password: 'Admin@123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const demo: User = {
    id: 'user-demo',
    name: 'Demo Candidate',
    email: 'demo@carriernest.com',
    password: 'Demo@123',
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  write(KEYS.users, [admin, demo]);
  write(KEYS.services, defaultServices);
  write(KEYS.inquiries, [] as Inquiry[]);
  window.localStorage.setItem(KEYS.seeded, 'true');
}

export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]) {
  write(KEYS.users, users);
}

export function getSession(): AuthSession | null {
  return read<AuthSession | null>(KEYS.session, null);
}

export function setSession(session: AuthSession | null) {
  if (session) write(KEYS.session, session);
  else if (typeof window !== 'undefined') window.localStorage.removeItem(KEYS.session);
}

export function getInquiries(): Inquiry[] {
  return read<Inquiry[]>(KEYS.inquiries, []);
}

export function saveInquiries(inquiries: Inquiry[]) {
  write(KEYS.inquiries, inquiries);
}

export function getServices(): ServiceItem[] {
  const stored = read<ServiceItem[] | null>(KEYS.services, null);
  return stored?.length ? stored : defaultServices;
}

export function saveServices(services: ServiceItem[]) {
  write(KEYS.services, services);
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateToken() {
  return `cn_jwt_${Math.random().toString(36).slice(2)}${Date.now()}`;
}
