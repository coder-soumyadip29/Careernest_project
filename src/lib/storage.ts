import type { Inquiry, ServiceItem } from './types';
import { defaultServices } from './data';

const KEYS = {
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

/**
 * Seed non-auth data (services, inquiries) on first visit.
 * Auth seeding is no longer needed — users are managed in Firebase.
 */
export function seedDatabase() {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(KEYS.seeded)) return;

  write(KEYS.services, defaultServices);
  write(KEYS.inquiries, [] as Inquiry[]);
  window.localStorage.setItem(KEYS.seeded, 'true');
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
