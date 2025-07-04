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
    await addRecurringTransaction({ name, amount: parseFloat(amount), frequency, startDate });
    alert("Recurring transaction added");
    setName(""); setAmount(""); setFrequency("monthly"); setStartDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>📆 Schedule Recurring Transaction</h3>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name (e.g. Netflix)" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <select value={frequency} onChange={e => setFrequency(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <button className="btn" type="submit">Add</button>
    </form>
  );
}
