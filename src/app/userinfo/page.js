"use client";
import React, { useState } from "react";
import "./userinfo.css";

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
        const size = 24 + Math.random() * 48; // 24px–72px
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
      />
    </div>
  );
};

export default function UserInfoPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    salary: "",
    incomeSource: "",
    otherIncome: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="userInfoContainer">
      <FloatingEmojis />
      <div className="card">
        <h1 className="title">Tell Us About You</h1>
        <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
        <InputField label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
        <InputField label="Salary" name="salary" type="number" value={form.salary} onChange={handleChange} />
        <InputField label="Primary Income Source" name="incomeSource" value={form.incomeSource} onChange={handleChange} />
        <InputField label="Other Income Sources" name="otherIncome" value={form.otherIncome} onChange={handleChange} />

        <button onClick={() => console.log("User Data:", form)} className="button">
          Continue
        </button>
      </div>
    </div>
  );
}
