import {
  createUserWithEmailAndPassword as webSignUp,
  signInWithEmailAndPassword as webSignIn,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

const isNative = Capacitor.isNativePlatform();

// Register
export const registerUser = async (email, password) => {
  if (isNative) {
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email,
      password,
    });
    return result.user;
  } else {
    const userCredential = await webSignUp(auth, email, password);

    return userCredential.user;
  }
};

// Login
export const loginUser = async (email, password) => {
  if (isNative) {
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email,
      password,
    });
    return result.user;
  } else {
    const userCredential = await webSignIn(auth, email, password);
    return userCredential.user;
  }
};

// Logout
export const logoutUser = async () => {
  if (isNative) {
    return FirebaseAuthentication.signOut();
  } else {
    return signOut(auth);
  }
};
