// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

import { firebaseConfig } from '../config/firebase.config';
import { getFunctions } from 'firebase/functions';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions()
/**
 * Signs the user in with a Google popup.
 * @returns A Prommise that resolves with the user's data.
 */
export const signInWithGoogle = async () => {
  return signInWithPopup(auth, new GoogleAuthProvider());
};

/**
 * Signs the user out.
 * @returns A Promise that resolves when the user is signed out.
 */
export const signOut = async () => {
  return auth.signOut();
};

/**
 * A helper function that listens for auth state changes and triggers a callback when it changes.
 * @param callback The callback function to call when the auth state changes.
 */
export const onAuthStateChangedHelper = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};
