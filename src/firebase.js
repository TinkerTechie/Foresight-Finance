
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDQh13zzCAmROKz_QnxjeRkOSZJzVrn380",
  authDomain: "foresight-finance-7970c.firebaseapp.com",
  projectId: "foresight-finance-7970c",
  storageBucket: "foresight-finance-7970c.firebasestorage.app",
  messagingSenderId: "1014424416312",
  appId: "1:1014424416312:web:bb54cd3f1bd1d4c034f6cd",
  measurementId: "G-3YFDTZQXGL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn("Analytics initialization failed:", e);
  }
}

export { db };
