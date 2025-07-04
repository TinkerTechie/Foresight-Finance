"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Confetti from "react-confetti";

export default function EndPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
  });

  useEffect(() => {
    // Get screen size for confetti
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Simulate stored transactions summary (replace with actual logic or context/state)
    const storedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    const income = storedTransactions
      .filter((t) => t.transaction_type === "credit")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = storedTransactions
      .filter((t) => t.transaction_type === "debit")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = income - expenses;

    setSummary({ income, expenses, savings });
  }, []);

  return (
    <div className="end-container">
      <Confetti width={dimensions.width} height={dimensions.height} />

      <h1>🎉 You're All Set!</h1>
      <p>Thank you for using <strong>Foresight Finance</strong>.</p>

      <div className="summary">
        <h2>📊 Your Financial Summary</h2>
        <p><strong>Total Income:</strong> ₹{summary.income.toLocaleString()}</p>
        <p><strong>Total Expenses:</strong> ₹{summary.expenses.toLocaleString()}</p>
        <p><strong>Net Savings:</strong> ₹{summary.savings.toLocaleString()}</p>
      </div>

      <Link href="/" className="btn">
        Back to Dashboard
      </Link>

      <style jsx>{`
        .end-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100vh;
          background: linear-gradient(to bottom right, #f3f4f6, #e0e7ff);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
        }

        h1 {
          font-size: 2.5rem;
          color: #4f46e5;
          margin-bottom: 15px;
        }

        .summary {
          background: white;
          padding: 20px 30px;
          margin: 30px 0;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .summary h2 {
          margin-bottom: 15px;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .summary p {
          font-size: 1.1rem;
          color: #374151;
          margin: 6px 0;
        }

        .btn {
          margin-top: 20px;
          background-color: #4f46e5;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .btn:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  );
}
