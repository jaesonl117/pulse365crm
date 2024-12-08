import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth, app } from '../lib/firebase';
import { RegisterData, UserRole } from '../types/auth';

const db = getFirestore(app);

export const registerUser = async (data: RegisterData): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const { user } = userCredential;

  // Update user profile
  await updateProfile(user, {
    displayName: `${data.firstName} ${data.lastName}`
  });

  // Create tenant document
  const tenantId = `tenant_${user.uid}`;
  await setDoc(doc(db, 'tenants', tenantId), {
    name: data.companyName,
    ownerId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Create user document
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    companyName: data.companyName,
    role: UserRole.TENANT_ADMIN,
    tenantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};