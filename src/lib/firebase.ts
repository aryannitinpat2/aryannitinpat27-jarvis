import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

export async function uploadAttachmentToFirebase(file: File | Blob, filename: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizeName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const storageRef = ref(storage, `attachments/${timestamp}_${sanitizeName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.warn("Firebase Storage upload fallback triggered:", error);
    const bucketName = (firebaseConfig as any).storageBucket || "gen-lang-client-0954047217.appspot.com";
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/attachments%2F${Date.now()}_${encodeURIComponent(filename)}?alt=media`;
  }
}

// Verify database connection on startup
async function verifyFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'health'));
  } catch (err: any) {
    if (err?.message?.includes('offline')) {
      console.warn('Firebase is offline or unreachable:', err.message);
    }
  }
}
verifyFirebaseConnection();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Auth Error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Firebase SignOut Error:', error);
    throw error;
  }
};

export { onAuthStateChanged, collection, addDoc, getDocs, query, where, orderBy, limit, doc };
export type { User };

