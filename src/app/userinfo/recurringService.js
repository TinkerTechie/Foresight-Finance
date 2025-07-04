import { db } from "@/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addRecurringTransaction = async (tx) => {
  await addDoc(collection(db, "recurringTransactions"), tx);
};

export const fetchRecurringTransactions = async () => {
  const snapshot = await getDocs(collection(db, "recurringTransactions"));
  return snapshot.docs.map((doc) => doc.data());
};
