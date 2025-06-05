'use client';

import Link from "next/link";
import { Wallet, PiggyBank, BarChart3, CreditCard, Banknote } from "lucide-react";
import "./stylee.css"

export default function HomePage() {
  return (
    <div className="main"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
          opacity: 0.1,
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "100px",
            height: "100px",
            opacity: 0.2,
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1v4m4-4v4m-4 4h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h8m-4 0v14" />
        </svg>
        <svg
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "100px",
            height: "100px",
            opacity: 0.2,
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12l2 2 4-4 5 5L20 6" />
        </svg>
        <svg
          style={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: "100px",
            height: "100px",
            opacity: 0.2,
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10v11H3V10h18zm-1 1H4v9h16v-9z" />
        </svg>
      </div>

      <div className="pig"
      >
        <h1
          style={{
            color: "#10E4A5",
            fontSize: "2.75rem",
            marginBottom: "1rem",
          }}
        >
          <PiggyBank size={40} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Foresight Finance
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          A sleek and intuitive platform to manage your income, track expenses,
          and plan your financial future with smart insights.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "2rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <IconBlock icon={<Wallet size={32} color="#10E4A5" />} label="Track Spending" />
          <IconBlock icon={<BarChart3 size={32} color="#10E4A5" />} label="Visualize Trends" />
          <IconBlock icon={<Banknote size={32} color="#10E4A5" />} label="Budget Smarter" />
          <IconBlock icon={<CreditCard size={32} color="#10E4A5" />} label="Manage Cards" />
        </div>
      </div>

      <Link href="/dashboard">
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
          }}
        >
          <Button />
        </div>
      </Link>
    </div>
  );
}

function Button() {
  return (
    <button className="buton"
      onMouseOver={e => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(16, 228, 165, 0.45)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(16, 228, 165, 0.35)";
      }}
    >
      Get Started →
    </button>
  );
}


function IconBlock({ icon, label }) {
  return (
    <div className="block">
      <div className="icon"
      >
        {icon}
      </div>
      <p className="label">{label}</p>
    </div>
  );
}
