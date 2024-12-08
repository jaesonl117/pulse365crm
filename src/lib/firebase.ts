import { initializeApp, getApps, FirebaseApp } from '@firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { 
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
  enableIndexedDbPersistence
} from '@firebase/firestore';

// Debug function to check Firestore instance
const debugFirestore = (db: Firestore | undefined, stage: string) => {
  console.log(`[DEBUG ${stage}] Firestore instance:`, db);
  if (db) {
    console.log(`[DEBUG ${stage}] Firestore type:`, Object.prototype.toString.call(db));
    console.log(`[DEBUG ${stage}] Firestore properties:`, Object.keys(db));
    // @ts-ignore - accessing internal property for debugging
    console.log(`[DEBUG ${stage}] Internal state:`, db._initialized, db._terminated);
  }
};

// Initialize Firestore with fallback options
const initializeFirestoreWithFallback = async (app: FirebaseApp): Promise<Firestore> => {
  try {
    console.log('[FIRESTORE] Attempting initialization with getFirestore...');
    let db = getFirestore(app);
    debugFirestore(db, 'GETFIRESTORE_INIT');
    return db;
  } catch (error) {
    console.log('[FIRESTORE] First attempt failed, trying direct initialization:', error);
    try {
      const db = initializeFirestore(app, {});
      debugFirestore(db, 'DIRECT_INIT');
      return db;
    } catch (directError) {
      console.error('[FIRESTORE] Direct initialization failed:', directError);
      throw directError;
    }
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyBjs2gd4TP0AeGGJDOKB8TR16GtnbhOWAs",
  authDomain: "pulse365-crm.firebaseapp.com",
  projectId: "pulse365-crm",
  storageBucket: "pulse365-crm.appspot.com",
  messagingSenderId: "545884381357",
  appId: "1:545884381357:web:e10674deb143ff183b2624"
};

let app: FirebaseApp;
let auth;
let db: Firestore;

const initializeFirebase = async () => {
  try {
    console.log('[INIT] Starting Firebase initialization...');
    
    // Initialize Firebase app
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    console.log('[INIT] Firebase app initialized successfully', app);
    console.log('[DEBUG] Available Firebase services:', Object.keys(app));

    // Initialize Auth
    try {
      auth = getAuth(app);
      console.log('[INIT] Firebase Auth initialized successfully', auth);
    } catch (authError) {
      console.error('[ERROR] Error initializing Firebase Auth:', authError);
      throw authError;
    }

    // Initialize Firestore with fallback pattern
    try {
      db = await initializeFirestoreWithFallback(app);
      console.log('[FIRESTORE] Basic initialization successful');

      // Only attempt persistence after successful initialization
      if (db) {
        try {
          await enableIndexedDbPersistence(db);
          console.log('[FIRESTORE] Persistence enabled successfully');
        } catch (persistenceError) {
          if (persistenceError.code === 'failed-precondition') {
            console.warn('[FIRESTORE] Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (persistenceError.code === 'unimplemented') {
            console.warn('[FIRESTORE] The current browser does not support persistence.');
          } else {
            console.error('[FIRESTORE] Persistence setup failed:', persistenceError);
          }
          // Continue without persistence
        }
      }
    } catch (firestoreError) {
      console.error('[ERROR] Critical Firestore initialization error:', firestoreError);
      console.error('[ERROR] Error details:', {
        name: firestoreError.name,
        message: firestoreError.message,
        stack: firestoreError.stack,
        // @ts-ignore - checking for any additional Firebase-specific error properties
        code: firestoreError.code,
        // @ts-ignore
        serverResponse: firestoreError.serverResponse
      });
      throw firestoreError;
    }

    // Connect to emulators in development
    if (import.meta.env.DEV) {
      try {
        console.log('[EMULATOR] Attempting to connect to emulators...');
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        if (db) {
          connectFirestoreEmulator(db, 'localhost', 8080);
          console.log('[EMULATOR] Successfully connected to emulators');
        }
      } catch (emulatorError) {
        console.error('[ERROR] Error connecting to emulators:', emulatorError);
      }
    } else {
      console.log('[INFO] Running in production mode');
    }
  } catch (error) {
    console.error('[ERROR] Critical error in Firebase initialization:', error);
    throw error;
  }
};

// Initialize Firebase and export the initialization promise
const firebaseInit = initializeFirebase();

export { app, auth, db, firebaseInit };