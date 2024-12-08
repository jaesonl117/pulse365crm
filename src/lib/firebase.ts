// Import Firebase core functionality
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore,
  connectFirestoreEmulator
} from 'firebase/firestore';

// Your web app's Firebase configuration
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
let db;

try {
  // Initialize Firebase app
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase app initialized successfully');

  // Initialize Auth
  try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  } catch (authError) {
    console.error('Error initializing Firebase Auth:', authError);
    throw authError;
  }

  // Initialize Firestore
  try {
    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  } catch (firestoreError) {
    console.error('Error initializing Firestore:', firestoreError);
    throw firestoreError;
  }

  // Connect to emulators in development
  if (import.meta.env.DEV) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Connected to Firebase emulators successfully');
    } catch (emulatorError) {
      console.error('Error connecting to emulators:', emulatorError);
      // Don't throw here as emulator connection isn't critical for app function
    }
  } else {
    console.log('Running in production mode');
  }
} catch (error) {
  console.error('Critical error initializing Firebase:', error);
  throw error;
}

export { app, auth, db };