import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - энэ утгуудыг Firebase Console-оос авна
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || '',
};

// Check if Firebase config is valid
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase
let app;
try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn('Firebase config is missing. Please set up .env file with Firebase credentials.');
    // Create a dummy config to prevent errors
    app = initializeApp({
      apiKey: 'dummy',
      authDomain: 'dummy',
      projectId: 'dummy',
      storageBucket: 'dummy',
      messagingSenderId: 'dummy',
      appId: 'dummy',
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export { isFirebaseConfigured };
export default app;
