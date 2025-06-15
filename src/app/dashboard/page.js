import React from "react";
import { LineChart, PiggyBank, Settings, Wallet } from "lucide-react";
import "./style.css";
import Link from "next/link";
export default function Dashboard() {
  return (
    <div className="page">
      <h1 className="head">What Foresight Finance Can Do for You</h1>
      <p className="subhead">Your AI-powered personal finance navigator</p>
      <div className="box1">
      <div className="feat1">
        <div className="wrap1">
          <div className="lh11">
            <LineChart size={28} style={{ color: "#2dd4bf" }} />
            <h2 className="tit1">Smart Budgeting</h2>
          </div>
          <p className="par1">
            Automatically track and forecast your spending with ease.
          </p>
        </div>
      </div>
     
      <div className="feat1">
        <div className="wrap1">
          <div className="lh11">
            <PiggyBank size={28} style={{ color: "#facc15" }} />
            <h2 className="tit1">Savings Goal Tracker</h2>
          </div>
          <p className="par1">
            Visualize progress on your goals like a house or vacation.
          </p>
        </div>
        </div>
      </div>
      <div className="box1">
      <div className="feat1">
        <div className="wrap1">
          <div className="lh11">
            <Settings size={28} style={{ color: "#f472b6" }} />
            <h2 className="tit1">What-If Simulator</h2>
          </div>
          <p className="par1">
            Try scenarios like increasing savings or taking a loan.
          </p>
        </div>
      </div>
      <div className="feat1">
        <div className="wrap1">
          <div className="lh11">
            <Wallet size={28} style={{ color: "#34d399" }} />
            <h2 className="tit1">Personalized Insights</h2>
          </div>
          <p className="par1">
            Get smart recommendations based on your financial habits.
          </p>
        </div>
      </div>
      </div>
      <div className="container">
        <Link href="/login">
          <button className="button">Start Managing My Money</button>
        </Link>
      </div>
    </div>
  );
}