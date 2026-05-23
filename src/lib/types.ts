export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}

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

export interface AuthSession {
  userId: string;
  token: string;
}
