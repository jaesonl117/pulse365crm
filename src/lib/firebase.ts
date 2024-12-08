import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjs2gd4TP0AeGGJDOKB8TR16GtnbhOWAs",
  authDomain: "pulse365-crm.firebaseapp.com",
  projectId: "pulse365-crm",
  storageBucket: "pulse365-crm.firebasestorage.app",
  messagingSenderId: "545884381357",
  appId: "1:545884381357:web:e10674deb143ff183b2624"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, auth, db };