import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // ← ADD THIS

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDQh13zzCAmROKz_QnxjeRkOSZJzVrn380",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "foresight-finance-7970c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foresight-finance-7970c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "foresight-finance-7970c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1014424416312",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1014424416312:web:bb54cd3f1bd1d4c034f6cd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3YFDTZQXGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);  // ← ADD THIS LINE

// Initialize Analytics (only in browser)
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn("Analytics initialization failed:", e);
  }
}

export { db, auth };  // ← UPDATE THIS TO INCLUDE auth
