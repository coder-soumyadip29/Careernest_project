import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

const isAdminConfigValid = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (isAdminConfigValid) {
  // Initialize Firebase Admin only once
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key comes with escaped newlines, so we need to replace them
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} else {
  console.warn(
    'Firebase Admin configuration is missing. Please set:\n' +
    '- FIREBASE_PROJECT_ID\n' +
    '- FIREBASE_CLIENT_EMAIL\n' +
    '- FIREBASE_PRIVATE_KEY'
  );
}

export { adminAuth, adminDb };
export default adminApp;
