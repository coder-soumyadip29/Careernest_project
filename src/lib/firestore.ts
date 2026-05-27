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
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, ServiceItem, Inquiry } from './types';
import { defaultServices } from './data';

const USERS_COLLECTION = 'Users';
const SERVICES_COLLECTION = 'Services';
const INQUIRIES_COLLECTION = 'Inquiries';

function ensureDb() {
  if (!db) throw new Error('Firebase Firestore is not configured.');
  return db;
}

/**
 * Create a new user profile document in Firestore.
 * Document ID = Firebase Auth UID (guarantees 1:1 mapping).
 */
export async function createUserProfile(
  uid: string,
  data: {
    name: string;
    email: string;
    role?: 'user' | 'admin';
  }
): Promise<void> {
  const firestore = ensureDb();
  const userDoc = doc(firestore, USERS_COLLECTION, uid);
  await setDoc(userDoc, {
    uid,
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role ?? 'user',
    createdAt: new Date().toISOString(),
    photoURL: '',
    phone: '',
    department: '',
  });
}

/**
 * Fetch a single user profile by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const firestore = ensureDb();
  const userDoc = doc(firestore, USERS_COLLECTION, uid);
  const snap = await getDoc(userDoc);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Fetch all user profiles (admin use-case).
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const firestore = ensureDb();
  const snap = await getDocs(collection(firestore, USERS_COLLECTION));
  return snap.docs.map((d) => d.data() as UserProfile);
}

/**
 * Update a user profile in Firestore (partial update).
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  const firestore = ensureDb();
  const userDoc = doc(firestore, USERS_COLLECTION, uid);
  await updateDoc(userDoc, { ...data });
}

/**
 * Delete a user profile in Firestore.
 */
export async function deleteUserProfile(uid: string): Promise<void> {
  const firestore = ensureDb();
  const userDoc = doc(firestore, USERS_COLLECTION, uid);
  await deleteDoc(userDoc);
}

/* ─── Services CRUD ────────────────────────────────────────── */

/**
 * Fetch all services from Firestore. If empty, automatically seeds default services.
 */
export async function getAllServices(): Promise<ServiceItem[]> {
  const firestore = ensureDb();
  const snap = await getDocs(collection(firestore, SERVICES_COLLECTION));
  if (snap.empty) {
    // Seed default services in Firestore
    for (const service of defaultServices) {
      const { id, ...rest } = service;
      await setDoc(doc(firestore, SERVICES_COLLECTION, id), rest);
    }
    const freshSnap = await getDocs(collection(firestore, SERVICES_COLLECTION));
    return freshSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceItem);
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceItem);
}

/**
 * Add a new service offering to Firestore.
 */
export async function addService(data: Omit<ServiceItem, 'id'>): Promise<string> {
  const firestore = ensureDb();
  const serviceId = `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const serviceDoc = doc(firestore, SERVICES_COLLECTION, serviceId);
  await setDoc(serviceDoc, data);
  return serviceId;
}

/**
 * Update a service offering in Firestore.
 */
export async function updateService(id: string, data: Partial<Omit<ServiceItem, 'id'>>): Promise<void> {
  const firestore = ensureDb();
  const serviceDoc = doc(firestore, SERVICES_COLLECTION, id);
  await updateDoc(serviceDoc, data);
}

/**
 * Delete a service offering from Firestore.
 */
export async function deleteService(id: string): Promise<void> {
  const firestore = ensureDb();
  const serviceDoc = doc(firestore, SERVICES_COLLECTION, id);
  await deleteDoc(serviceDoc);
}

/* ─── Inquiries CRUD ───────────────────────────────────────── */

/**
 * Fetch all inquiries from Firestore (ordered by newest first).
 */
export async function getAllInquiries(): Promise<Inquiry[]> {
  const firestore = ensureDb();
  const q = query(collection(firestore, INQUIRIES_COLLECTION), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Inquiry);
}

/**
 * Add a new inquiry to Firestore.
 */
export async function addInquiry(
  data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>
): Promise<string> {
  const firestore = ensureDb();
  const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const inquiryDoc = doc(firestore, INQUIRIES_COLLECTION, inquiryId);
  const inquiryData = {
    ...data,
    timestamp: new Date().toISOString(),
    status: 'new' as const,
  };
  await setDoc(inquiryDoc, inquiryData);
  return inquiryId;
}

/**
 * Update inquiry status (e.g. mark reviewed).
 */
export async function updateInquiryStatus(id: string, status: 'new' | 'reviewed'): Promise<void> {
  const firestore = ensureDb();
  const inquiryDoc = doc(firestore, INQUIRIES_COLLECTION, id);
  await updateDoc(inquiryDoc, { status });
}

/**
 * Delete an inquiry from Firestore.
 */
export async function deleteInquiry(id: string): Promise<void> {
  const firestore = ensureDb();
  const inquiryDoc = doc(firestore, INQUIRIES_COLLECTION, id);
  await deleteDoc(inquiryDoc);
}

