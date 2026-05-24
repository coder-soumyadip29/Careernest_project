export type UserRole = 'user' | 'admin';

/**
 * UserProfile represents the Firestore document shape in the 'Users' collection.
 * Keyed by Firebase Auth UID.
 */
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  photoURL: string;
  phone: string;
  department: string;
}

/**
 * Backward-compatible alias — some UI components reference `User`.
 * Points to the same type so we don't need to rename everywhere at once.
 */
export type User = UserProfile;

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'reviewed';
  userId?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  features: string[];
  icon: string;
}
