import { GoogleAuthProvider, signInWithPopup, signOut, } from "firebase/auth";

import { auth } from "../config/firebase";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};