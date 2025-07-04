"use client";
import RecurringForm from "../userinfo/recurringForm";
import { useRecurringLogic } from "../userinfo/useRecurringLogic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { usePlaidLink } from "react-plaid-link";
import "./foresightfinance.css";

const exportCSV = (data) => {
  const rows = [
    ["Date", "Category", "Type", "Amount"],
    ...data.map((d) => [d.date, d.name, d.transaction_type, d.amount]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goal, setGoal] = useState(10000);
  const [saved, setSaved] = useState(0);
  const [budgetSuggestion, setBudgetSuggestion] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useRecurringLogic((tx) => setTransactions((prev) => [...prev, tx]));

  // Fetch Plaid link token
  useEffect(() => {
    fetch("/api/plaid")
      .then((res) => {
        if (!res.ok) throw new Error("Plaid link token fetch failed");
        return res.json();
      })
      .then((data) => setLinkToken(data.link_token))
      .catch((err) => console.error("Plaid token error:", err));
  }, []);

  // Fetch USD to INR exchange rate
  useEffect(() => {
    fetch("https://api.apilayer.com/fixer/latest?base=USD&symbols=INR", {
      headers: {
        apikey: process.env.NEXT_PUBLIC_FIXER_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates?.INR));
  }, []);

  // Plaid link logic
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      console.log("🔗 Public Token Received:", public_token);

      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });

        const data = await res.json();
        if (!data || typeof data !== "object") {
          throw new Error("Empty response from /api/exchange");
        }

        console.log("📦 Transactions received from backend:", data);

        if (!data.transactions || data.transactions.length === 0) {
          console.warn("⚠️ No transactions received. Using fallback.");
          data.transactions = [
            {
              date: "2024-06-01",
              name: "Uber",
              amount: 120,
              transaction_type: "debit",
            },
            {
              date: "2024-06-03",
              name: "Salary",
              amount: 8000,
              transaction_type: "credit",
            },
            {
              date: "2024-06-05",
              name: "Netflix",
              amount: 499,
              transaction_type: "debit",
            },
          ];
        }

        setTransactions(data.transactions);

        const income = data.transactions
          .filter((t) => t.transaction_type === "credit")
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = data.transactions
          .filter((t) => t.transaction_type === "debit")
          .reduce((sum, t) => sum + t.amount, 0);

        const netSaved = income - expenses;
        setSaved(netSaved);

        setBudgetSuggestion(
          netSaved < goal / 2
            ? "Try reducing discretionary expenses."
            : "You're on track! Keep it up."
        );
      } catch (err) {
        console.error("❌ Exchange failed:", err);
        setError("Could not retrieve transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Foresight Finance Dashboard</h2>
      <div className="card">
        <RecurringForm />
      </div>
      <div className="card">
        <h3>🔗 Connect Bank via Plaid</h3>
        {ready && (
          <button className="btn" onClick={() => open()}>
            Connect with Plaid
          </button>
        )}
      </div>

      <div className="card">
        <h3>📊 Current Transactions</h3>
        {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}
        {loading && <p>⏳ Loading...</p>}
        {transactions.length === 0 && !loading && (
          <p>No transactions loaded.</p>
        )}

        <div className="scroll-table">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.date}</td>
                  <td>{t.name}</td>
                  <td>{t.transaction_type || "unknown"}</td>

                  <td>₹{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>🎯 Savings Goal</h3>
        <p>
          Goal: ₹{goal} | Saved: ₹{saved}
        </p>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>📈 Spending Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactions}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="amount" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>💡 Budget Advice</h3>
        <p>{budgetSuggestion}</p>
        {exchangeRate && (
          <p>USD to INR (via Fixer.io): ₹{exchangeRate.toFixed(2)}</p>
        )}
      </div>

      <div className="card">
        <button className="btn" onClick={() => exportCSV(transactions)}>
          <Download size={16} style={{ marginRight: "5px" }} />
          Export CSV
        </button>
      </div>
      <div className="card">
        <h3>✅ Done for now?</h3>
        <p>See your financial summary with savings and insights.</p>
        <Link href="/endf" className="btn">
          Finish & View Summary
        </Link>
      </div>
    </div>
  );
}
