import { useEffect } from "react";
import { fetchRecurringTransactions } from "./recurringService";

function shouldAddToday(tx, today) {
  const start = new Date(tx.startDate);
  const now = new Date(today);

  if (tx.frequency === "monthly") return now.getDate() === start.getDate();
  if (tx.frequency === "weekly") {
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff % 7 === 0;
  }
  return false;
}

export const useRecurringLogic = (addTransaction) => {
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    fetchRecurringTransactions().then(transactions => {
      transactions.forEach(tx => {
        if (shouldAddToday(tx, today)) {
          addTransaction({
            name: tx.name,
            date: today,
            amount: tx.amount,
            transaction_type: "debit"
          });
        }
      });
    });
  }, []);
};
