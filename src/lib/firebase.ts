import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBmf1yMpOEJecz4I4RIyoOCJOFiw3-Q1B8",
  authDomain: "easyventv3.firebaseapp.com",
  projectId: "easyventv3",
  storageBucket: "easyventv3.firebasestorage.app",
  messagingSenderId: "280794362384",
  appId: "1:280794362384:web:7b2ce88ef6073d114c5095",
  measurementId: "G-Y37PMC7BG1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };

