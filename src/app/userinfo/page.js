"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./userinfo.css";
import Link from "next/link";

export function FloatingEmojis() {
  const emojis = ["💼", "💰", "📊", "👤", "📝", "🏦", "📈", "💳", "🧾", "🪙", "🧮", "📉"];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {emojis.map((emoji, i) => {
        const size = 24 + Math.random() * 48;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 20 + Math.random() * 20;

        const style = {
          position: "absolute",
          fontSize: `${size}px`,
          opacity: 0.1 + Math.random() * 0.3,
          top: `${top}%`,
          left: `${left}%`,
          userSelect: "none",
          animation: `floatUp ${duration}s ease-in infinite`,
          animationDelay: `${delay}s`,
          filter: "blur(0.3px)",
        };
        return (
          <span key={i} style={style}>
            {emoji}
          </span>
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh); opacity: 0.2; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const InputField = ({ label, name, type = "text", onChange, value }) => {
  return (
    <div className="fieldContainer">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="expandingInput"
        placeholder={label}
        autoComplete="off"
        required
      />
    </div>
  );
};

export default function UserInfoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    salary: "",
    incomeSource: "",
    otherIncome: "",
    saving: "",
    limit: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const userData = {
      name: form.name,
      salary: parseInt(form.salary),
      saving: parseInt(form.saving),
      limit: parseInt(form.limit),
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    router.push("/dashboard");
  };

  return (
    <div className="userInfoContainer">
      <FloatingEmojis />
      <div className="card">
        <h1 className="title">Tell Us About You</h1>

        <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
        <InputField label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
        <InputField label="Salary" name="salary" type="number" value={form.salary} onChange={handleChange} />
        <InputField label="Saving Goal" name="saving" type="number" value={form.saving} onChange={handleChange} />
        <InputField label="Daily Spending Limit" name="limit" type="number" value={form.limit} onChange={handleChange} />
        <InputField label="Primary Income Source" name="incomeSource" value={form.incomeSource} onChange={handleChange} />
        <InputField label="Other Income Sources" name="otherIncome" value={form.otherIncome} onChange={handleChange} />
      <Link href="./foresightfinance">
        <button className="button">
          Continue to Finance Dashboard
        </button></Link>
      </div>
    </div>
  );
}
