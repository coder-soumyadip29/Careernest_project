/**
 * dbService.ts — Centralized Database Utility
 *
 * Single source of truth for all Firestore CRUD operations.
 * Every public function returns a `DbResult<T>` discriminated union
 * so callers never need try/catch — they just check `result.success`.
 *
 * Password handling: NONE. Firebase Auth manages credentials natively.
 * This module only touches profile/document data in Firestore.
 */

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, ServiceItem, Inquiry } from './types';
import { defaultServices } from './data';

/* ═══════════════════════════════════════════════════════════════
   Response Contract
   ═══════════════════════════════════════════════════════════════ */

export type DbErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'NETWORK_ERROR'
  | 'ALREADY_EXISTS'
  | 'UNKNOWN';

export type DbResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: DbErrorCode };

/* ═══════════════════════════════════════════════════════════════
   Collection Names
   ═══════════════════════════════════════════════════════════════ */

const USERS_COLLECTION = 'Users';
const SERVICES_COLLECTION = 'Services';
const INQUIRIES_COLLECTION = 'Inquiries';

/* ═══════════════════════════════════════════════════════════════
   Internal Helpers
   ═══════════════════════════════════════════════════════════════ */

/**
 * Map raw Firestore/Firebase errors to our unified DbErrorCode.
 */
function mapFirestoreError(err: unknown): { error: string; code: DbErrorCode } {
  if (err instanceof FirestoreError) {
    switch (err.code) {
      case 'permission-denied':
        return { error: 'You do not have permission to perform this action.', code: 'PERMISSION_DENIED' };
      case 'not-found':
        return { error: 'The requested document was not found.', code: 'NOT_FOUND' };
      case 'unavailable':
        return { error: 'Service is temporarily unavailable. Please check your network connection.', code: 'NETWORK_ERROR' };
      case 'already-exists':
        return { error: 'A document with this ID already exists.', code: 'ALREADY_EXISTS' };
      default:
        return { error: err.message || 'A database error occurred.', code: 'UNKNOWN' };
    }
  }

  // Fallback for non-Firestore errors (e.g. network failures)
  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
  return { error: message, code: 'UNKNOWN' };
}

/**
 * Validate a non-empty trimmed string field.
 */
function requireString(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return `${fieldName} is required and must be a non-empty string.`;
  }
  return null;
}

/**
 * Validate basic email format.
 */
function requireEmail(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  return null;
}

/**
 * Normalize Firestore Timestamp or ISO string into a displayable ISO string.
 * Handles both legacy ISO strings and serverTimestamp() Timestamp objects.
 */
export function normalizeTimestamp(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  // Fallback — shouldn't happen, but guard defensively
  return new Date().toISOString();
}

/* ═══════════════════════════════════════════════════════════════
   👤 Users Collection
   Schema: { uid, name, email, role, createdAt, photoURL, phone, department }
   ═══════════════════════════════════════════════════════════════ */

/**
 * Create a new user profile document in Firestore.
 * Document ID = Firebase Auth UID (guarantees 1:1 mapping).
 *
 * NOTE: No password field — Firebase Auth handles credential storage.
 */
export async function createUserProfile(
  uid: string,
  data: { name: string; email: string; role?: 'user' | 'admin' }
): Promise<DbResult<void>> {
  // ── Validate ──
  const uidErr = requireString(uid, 'UID');
  if (uidErr) return { success: false, error: uidErr, code: 'VALIDATION_ERROR' };

  const nameErr = requireString(data.name, 'Name');
  if (nameErr) return { success: false, error: nameErr, code: 'VALIDATION_ERROR' };

  const emailErr = requireEmail(data.email);
  if (emailErr) return { success: false, error: emailErr, code: 'VALIDATION_ERROR' };

  // ── Execute ──
  try {
    const userDoc = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDoc, {
      uid,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role ?? 'user',
      createdAt: new Date().toISOString(),
      photoURL: '',
      phone: '',
      department: '',
    });
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/**
 * Fetch a single user profile by UID.
 */
export async function getUserProfile(uid: string): Promise<DbResult<UserProfile | null>> {
  const uidErr = requireString(uid, 'UID');
  if (uidErr) return { success: false, error: uidErr, code: 'VALIDATION_ERROR' };

  try {
    const userDoc = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) return { success: true, data: null };
    return { success: true, data: snap.data() as UserProfile };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/* ═══════════════════════════════════════════════════════════════
   📨 Inquiries / Contact Collection
   Schema: { name, email, message, timestamp (serverTimestamp), status, phone?, subject?, userId? }
   ═══════════════════════════════════════════════════════════════ */

/**
 * Submit a new contact inquiry.
 * Uses Firestore `serverTimestamp()` for reliable, clock-skew-proof timestamps.
 */
export async function submitInquiry(
  data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>
): Promise<DbResult<string>> {
  // ── Validate ──
  const nameErr = requireString(data.name, 'Name');
  if (nameErr) return { success: false, error: nameErr, code: 'VALIDATION_ERROR' };

  const emailErr = requireEmail(data.email);
  if (emailErr) return { success: false, error: emailErr, code: 'VALIDATION_ERROR' };

  const msgErr = requireString(data.message, 'Message');
  if (msgErr) return { success: false, error: msgErr, code: 'VALIDATION_ERROR' };

  // ── Execute ──
  try {
    const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const inquiryDoc = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await setDoc(inquiryDoc, {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim(),
      phone: data.phone?.trim() ?? '',
      subject: data.subject?.trim() ?? '',
      userId: data.userId ?? '',
      timestamp: serverTimestamp(),
      status: 'new' as const,
    });
    return { success: true, data: inquiryId };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/**
 * Fetch all inquiries, ordered newest-first. [Admin Protected]
 *
 * Firestore security rules should restrict this to admin-role users.
 * The function itself does not enforce role checks — that's the rules layer's job.
 */
export async function getAllInquiries(): Promise<DbResult<Inquiry[]>> {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const inquiries = snap.docs.map((d) => {
      const raw = d.data();
      return {
        id: d.id,
        ...raw,
        // Normalize serverTimestamp() → ISO string for consistent frontend rendering
        timestamp: normalizeTimestamp(raw.timestamp),
      } as Inquiry;
    });
    return { success: true, data: inquiries };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/* ═══════════════════════════════════════════════════════════════
   ⚙️ Services Collection
   Schema: { name, description, longDescription, price, features[], icon }
   Spec mapping: serviceName → name, imageUrl → icon (production schema preserved)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Add a new service offering. [Admin Protected]
 */
export async function addService(
  data: Omit<ServiceItem, 'id'>
): Promise<DbResult<string>> {
  // ── Validate ──
  const nameErr = requireString(data.name, 'Service name');
  if (nameErr) return { success: false, error: nameErr, code: 'VALIDATION_ERROR' };

  const descErr = requireString(data.description, 'Description');
  if (descErr) return { success: false, error: descErr, code: 'VALIDATION_ERROR' };

  // ── Execute ──
  try {
    const serviceId = `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const serviceDoc = doc(db, SERVICES_COLLECTION, serviceId);
    await setDoc(serviceDoc, {
      name: data.name.trim(),
      description: data.description.trim(),
      longDescription: data.longDescription?.trim() ?? '',
      price: data.price ?? '',
      features: data.features ?? [],
      icon: data.icon ?? 'zap',
    });
    return { success: true, data: serviceId };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/**
 * Fetch all services. Auto-seeds defaults if the collection is empty.
 */
export async function getServices(): Promise<DbResult<ServiceItem[]>> {
  try {
    const snap = await getDocs(collection(db, SERVICES_COLLECTION));

    if (snap.empty) {
      // Seed default services on first load
      for (const service of defaultServices) {
        const { id, ...rest } = service;
        await setDoc(doc(db, SERVICES_COLLECTION, id), rest);
      }
      const freshSnap = await getDocs(collection(db, SERVICES_COLLECTION));
      const seeded = freshSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceItem);
      return { success: true, data: seeded };
    }

    const services = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceItem);
    return { success: true, data: services };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/**
 * Update an existing service offering. [Admin Protected]
 */
export async function updateService(
  id: string,
  data: Partial<Omit<ServiceItem, 'id'>>
): Promise<DbResult<void>> {
  const idErr = requireString(id, 'Service ID');
  if (idErr) return { success: false, error: idErr, code: 'VALIDATION_ERROR' };

  try {
    const serviceDoc = doc(db, SERVICES_COLLECTION, id);
    await updateDoc(serviceDoc, data);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}

/**
 * Delete a service offering. [Admin Protected]
 */
export async function deleteService(id: string): Promise<DbResult<void>> {
  const idErr = requireString(id, 'Service ID');
  if (idErr) return { success: false, error: idErr, code: 'VALIDATION_ERROR' };

  try {
    const serviceDoc = doc(db, SERVICES_COLLECTION, id);
    await deleteDoc(serviceDoc);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, ...mapFirestoreError(err) };
  }
}
