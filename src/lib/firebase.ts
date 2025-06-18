
"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics"; // Added import for Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-qwiDlaxUN73k_BvL_8KPx06NOQXDUJo",
  authDomain: "just4u-5f0cd.firebaseapp.com",
  projectId: "just4u-5f0cd",
  storageBucket: "just4u-5f0cd.appspot.com", // Corrected to appspot.com
  messagingSenderId: "829916636340",
  appId: "1:829916636340:web:c606b327ef33e7d8f2e3e1",
  measurementId: "G-7SZC7BC10R"
};

let app: FirebaseApp;
let analytics: Analytics | null = null; // Initialize analytics as null

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Analytics only on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics }; // Export analytics
