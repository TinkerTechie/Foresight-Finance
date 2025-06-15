import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PiggyBank, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import "./income.css";

const data = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 5000, expenses: 2600 },
  { month: "Apr", income: 4780, expenses: 3908 },
  { month: "May", income: 5890, expenses: 4800 },
  { month: "Jun", income: 6390, expenses: 3800 },
  { month: "Jul", income: 7490, expenses: 4300 },
];

export default function Dashboard() {
  return (
    <div className="page">
      <h1 className="head">Your Financial Overview</h1>
      <p className="subhead">Track income, expenses, and reach your goals smarter</p>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="box1">
        <div className="feat1">
          <div className="wrap1">
            <div className="lh11">
              <Wallet size={28} style={{ color: "#34d399" }} />
              <h2 className="tit1">Insights</h2>
            </div>
            <p className="par1">See trends in your financial habits and spending areas.</p>
          </div>
        </div>
        <div className="feat1">
          <div className="wrap1">
            <div className="lh11">
              <PiggyBank size={28} style={{ color: "#facc15" }} />
              <h2 className="tit1">Goal Progress</h2>
            </div>
            <p className="par1">Track how close you are to saving for big goals.</p>
          </div>
        </div>
        <div className="feat1">
          <div className="wrap1">
            <div className="lh11">
              <Settings size={28} style={{ color: "#f472b6" }} />
              <h2 className="tit1">Scenario Planner</h2>
            </div>
            <p className="par1">Explore how financial decisions impact your future.</p>
          </div>
        </div>
      </div>

      <div className="container">
        <Link href="/login" className="no-underline">
          <button className="button">Start Managing</button>
        </Link>
      </div>
    </div>
  );
}
