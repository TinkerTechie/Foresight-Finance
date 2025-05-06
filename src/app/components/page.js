'use client';
import React from "react";
import Link from "next/link";
import { Wallet, PiggyBank, BarChart3, CreditCard, Banknote } from "lucide-react";
export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F172A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
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

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(14px)",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow: "0 8px 32px rgba(16, 228, 165, 0.15)",
          maxWidth: "600px",
          textAlign: "center",
          color: "#E0FFF4",
        }}
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
    <button
      style={{
        background: "linear-gradient(135deg, #10E4A5 0%, #34d399 100%)",
        color: "#0F172A",
        padding: "0.85rem 1.5rem",
        borderRadius: "50px",
        fontWeight: "600",
        border: "none",
        fontSize: "1rem",
        boxShadow: "0 8px 16px rgba(16, 228, 165, 0.35)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
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
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "#1E293B",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(16, 228, 165, 0.1)",
        }}
      >
        {icon}
      </div>
      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{label}</p>
    </div>
  );
}
