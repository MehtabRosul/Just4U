
"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import getDatabase

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-qwiDlaxUN73k_BvL_8KPx06NOQXDUJo",
  authDomain: "just4u-5f0cd.firebaseapp.com",
  databaseURL: "https://just4u-5f0cd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "just4u-5f0cd",
  storageBucket: "just4u-5f0cd.firebasestorage.app", // Use your updated storageBucket
  messagingSenderId: "829916636340",
  appId: "1:829916636340:web:c606b327ef33e7d8f2e3e1",
  measurementId: "G-7SZC7BC10R"
};

let app: FirebaseApp;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app); // Initialize Realtime Database

export { app, auth, googleProvider, database, analytics };
