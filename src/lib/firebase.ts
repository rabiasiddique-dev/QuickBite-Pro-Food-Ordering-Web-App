import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration later
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForNowPleaseReplaceMe12345",
  authDomain: "quickbite-pro-dummy.firebaseapp.com",
  projectId: "quickbite-pro-dummy",
  storageBucket: "quickbite-pro-dummy.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
