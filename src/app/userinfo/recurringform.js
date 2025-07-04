"use client";
import { useState } from "react";
import { addRecurringTransaction } from "./recurringService";

export default function RecurringForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addRecurringTransaction({
      name,
      amount: parseFloat(amount),
      frequency,
      startDate,
    });
    alert("Recurring transaction added");
    setName("");
    setAmount("");
    setFrequency("monthly");
    setStartDate("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card">
        <h3>📆 Schedule Recurring Transaction</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. Netflix)"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button className="btn" type="submit">
          Add
        </button>
      </form>

      <style jsx>{`
        form.card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        form.card input,
        form.card select {
          padding: 10px 14px;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background-color: #ffffff;
          transition: border 0.2s ease;
          outline: none;
        }

        form.card input:focus,
        form.card select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        form.card button.btn {
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
}
