import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const timestamp = Timestamp.now();
    await setDoc(docRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return docId;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  conditions: [string, any, any][]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef,
      ...conditions.map(([field, op, value]) => where(field, op, value))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};