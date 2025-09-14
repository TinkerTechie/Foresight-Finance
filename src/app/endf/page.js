"use client";
/* eslint-disable react/no-unescaped-entities */


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
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
<<<<<<< HEAD
=======

>>>>>>> d5a8df4 (login page's issues resolved)
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

      <h1>🎉 You are All Set!</h1>
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/service">Services</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">🌐</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📸</a>
            </div>
          </div>

          <div>
            <h3>Contact</h3>
            <p>📧 support@foresightfinance.com</p>
            <p>📞 +91-12345-67890</p>
            <p>📍 Bengaluru, India</p>
          </div>

          <div>
            <h3>Legal</h3>
            <p>© 2025 Foresight Finance</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .end-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #f3f4f6, #e0e7ff);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px 20px;
          position: relative;
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

        .footer {
          width: 100%;
          background-color: #111827;
          color: #f9fafb;
          padding: 40px 20px;
          margin-top: auto;
        }

        .footer-grid {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
        }

        .footer h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
          color: #ffffff;
        }

        .footer ul {
          list-style: none;
          padding: 0;
        }

        .footer li {
          margin-bottom: 8px;
        }

        .footer a {
          color: #d1d5db;
          text-decoration: none;
        }

        .footer a:hover {
          color: #60a5fa;
        }

        .social-icons a {
          margin-right: 10px;
          font-size: 1.3rem;
          color: #d1d5db;
        }

        .social-icons a:hover {
          color: #3b82f6;
        }

        @media (max-width: 600px) {
          .summary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
