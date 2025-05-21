// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYzaz_VQ36IO57TmHEuRvUMKDcss8AtV0",
  authDomain: "logo-v0.firebaseapp.com",
  projectId: "logo-v0",
  storageBucket: "logo-v0.firebasestorage.app",
  messagingSenderId: "673180545499",
  appId: "1:673180545499:web:e9a31d6ff744b3b02bb7fe",
  measurementId: "G-K329N1NB2B",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
