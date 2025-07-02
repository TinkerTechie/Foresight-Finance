'use client';

import { useEffect, useState } from 'react';
import "./income.css"

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    name: 'Guest',
    salary: 0,
    saving: 0,
    limit: 0,
  });

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse userData:', err);
      }
    }
  }, []);

  const addFakeExpense = () => {
    const newExpense = {
      day: `June ${expenses.length + 1}`,
      amount: Math.floor(Math.random() * 500),
      category: 'Food',
    };
    setExpenses([...expenses, newExpense]);
  };

  const spendable = userData.salary - userData.saving;

  return (
    <div className="dashboard-page">
      <h1>👋 Welcome, {userData.name}</h1>

      <div className="summary-box">
        <p>💰 Total Salary: ₹{userData.salary}</p>
        <p>🏦 Saving Goal: ₹{userData.saving}</p>
        <p>📉 Daily Limit: ₹{userData.limit}</p>
        <p>✅ Spendable Balance: ₹{spendable}</p>
      </div>

      <div className="chart-section">
        <h2>📊 Spending Overview</h2>
        {expenses.length > 0 ? (
          <ul className="expense-list">
            {expenses.map((exp, idx) => (
              <li key={idx}>
                {exp.day}: ₹{exp.amount} — {exp.category}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No expenses added yet.</p>
        )}
      </div>

      <button className="add-btn" onClick={addFakeExpense}>
        ➕ Add Random Expense
      </button>
    </div>
  );
}


