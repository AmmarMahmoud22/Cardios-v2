import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Environment variables configuration with safe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyKeyCardiosEHR20261022',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cardios-ehr-prod.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cardios-ehr-prod',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cardios-ehr-prod.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:cardiosprod99283'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let isFirestoreAvailable = false;

try {
  // Only initialize if an app hasn't been initialized already
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  if (app) {
    db = getFirestore(app);
    firebaseAuth = getAuth(app);
    // If real keys are provided and not default placeholder, mark active
    if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      isFirestoreAvailable = true;
    }
  }
} catch (error) {
  console.warn('Firebase initialization warning - running in resilient local/offline mode:', error);
  isFirestoreAvailable = false;
}

export { app, db, firebaseAuth, isFirestoreAvailable, firebaseConfig };
