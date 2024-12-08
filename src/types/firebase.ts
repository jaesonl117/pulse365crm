import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export interface FirebaseInstance {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}