import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { 
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
  enableIndexedDbPersistence
} from 'firebase/firestore';

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

const firebaseConfig = {
  apiKey: "AIzaSyBjs2gd4TP0AeGGJDOKB8TR16GtnbhOWAs",
  authDomain: "pulse365-crm.firebaseapp.com",
  projectId: "pulse365-crm",
  storageBucket: "pulse365-crm.appspot.com",
  messagingSenderId: "545884381357",
  appId: "1:545884381357:web:e10674deb143ff183b2624"
};

let app;
let auth;
let db: Firestore | undefined;

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

  // Initialize Firestore with detailed error tracking
  try {
    console.log('[FIRESTORE] Starting Firestore initialization...');
    
    try {
      // Stage 1: Basic Firestore initialization
      console.log('[FIRESTORE] Attempting basic Firestore initialization...');
      db = getFirestore(app);
      debugFirestore(db, 'BASIC_INIT');
      
      if (!db) {
        throw new Error('getFirestore() returned undefined');
      }

      // Test basic Firestore functionality before adding persistence
      console.log('[FIRESTORE] Testing basic Firestore functionality...');
      
      // Stage 2: Add persistence only if basic initialization succeeded
      console.log('[FIRESTORE] Basic initialization successful, attempting to add persistence...');
      try {
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        });
        debugFirestore(db, 'PERSISTENT_INIT');
        console.log('[FIRESTORE] Successfully upgraded to persistent Firestore');
      } catch (persistenceError) {
        console.error('[ERROR] Failed to add persistence, falling back to basic Firestore:', persistenceError);
        // Continue with basic Firestore instance
      }
    } catch (initialError) {
      console.warn('[FIRESTORE] Initial initialization failed, trying alternative method...', initialError);
      
      try {
        // Fallback: Try initializing without any special options
        db = initializeFirestore(app, {});
        debugFirestore(db, 'FALLBACK_INIT');
        console.log('[FIRESTORE] Fallback initialization successful');
      } catch (fallbackError) {
        console.error('[ERROR] Fallback initialization also failed:', fallbackError);
        throw fallbackError;
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

export { app, auth, db };