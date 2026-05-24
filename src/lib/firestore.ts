import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from './types';

const USERS_COLLECTION = 'Users';

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
  const userDoc = doc(db, USERS_COLLECTION, uid);
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
  const userDoc = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(userDoc);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Fetch all user profiles (admin use-case).
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, USERS_COLLECTION));
  return snap.docs.map((d) => d.data() as UserProfile);
}

/**
 * Update a user profile in Firestore (partial update).
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userDoc, { ...data });
}
