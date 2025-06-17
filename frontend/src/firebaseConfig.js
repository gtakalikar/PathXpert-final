// client/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDcvSg8_A04x3YNFwP3QCcF2nJE6m3SizY",
  authDomain: "pathxpert-8e202.firebaseapp.com",
  projectId: "pathxpert-8e202",
  storageBucket: "pathxpert-8e202.appspot.com",
  messagingSenderId: "874472236815",
  appId: "1:874472236815:web:d01e78db4920a84626007a",
  measurementId: "G-T3V49T85HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
