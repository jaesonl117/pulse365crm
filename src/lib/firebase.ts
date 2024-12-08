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

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Error connecting to emulators:', error);
  }
} else {
  console.log('Running in production mode');
}

export { app, auth, db };