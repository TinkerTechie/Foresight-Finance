'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieIcon,
  Activity,
  Plus,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Target,
  ChevronRight,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "../context/FinanceContext";
import { generateForecast, getAnomalyDetections } from "../utils/aiEngine";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 glass-card rounded-3xl border-slate-800"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
        <Icon className="text-primary w-6 h-6" />
      </div>
      {change && (
        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      )}
    </div>
    <div className="text-slate-400 text-sm font-medium mb-1">{title}</div>
    <div className="text-3xl font-bold font-display">₹{value.toLocaleString()}</div>
  </motion.div>
);

export default function Dashboard() {
  const { transactions, goals, getNetWorth, getFinancialHealthScore, addTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ name: '', amount: '', transaction_type: 'debit', category: 'Shopping', date: new Date().toISOString().split('T')[0] });

  const handleAddTx = async (e) => {
    e.preventDefault();
    await addTransaction(newTx);
    setIsModalOpen(false);
    setNewTx({ name: '', amount: '', transaction_type: 'debit', category: 'Shopping', date: new Date().toISOString().split('T')[0] });
  };

  const netWorth = getNetWorth();
  const healthScore = getFinancialHealthScore();
  const anomalies = useMemo(() => getAnomalyDetections(transactions), [transactions]);
  const forecastData = useMemo(() => {
    const historical = transactions.map(t => ({
      date: t.date,
      amount: t.transaction_type === 'credit' ? Number(t.amount) : -Number(t.amount),
      isForecast: false
    }));
    const forecast = generateForecast(transactions, 14);
    return [...historical, ...forecast];
  }, [transactions]);

  const categories = useMemo(() => {
    const counts = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#020617] p-4 lg:p-8 pt-24 text-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Financial <span className="text-gradient">Command Center</span></h1>
              <p className="text-slate-400">Welcome back! Your AI assistant detected {anomalies.length} unusual activities.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                <Calendar size={18} /> Sync Accounts
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Plus size={18} /> New Entry
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-md p-8 glass-card border-slate-800 rounded-3xl"
                >
                  <h3 className="text-2xl font-bold font-display mb-6">Record Transaction</h3>
                  <form onSubmit={handleAddTx} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Description (e.g. Starbucks)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                      value={newTx.name}
                      onChange={(e) => setNewTx({ ...newTx, name: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Amount"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                        value={newTx.amount}
                        onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                        required
                      />
                      <select
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                        value={newTx.transaction_type}
                        onChange={(e) => setNewTx({ ...newTx, transaction_type: e.target.value })}
                      >
                        <option value="debit">Expense</option>
                        <option value="credit">Income</option>
                      </select>
                    </div>
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                      value={newTx.category}
                      onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                    >
                      <option>Shopping</option>
                      <option>Food</option>
                      <option>Housing</option>
                      <option>Investment</option>
                      <option>Entertainment</option>
                    </select>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-700 rounded-xl font-bold hover:bg-slate-900 transition-all">Cancel</button>
                      <button type="submit" className="flex-1 py-3 bg-primary text-slate-950 rounded-xl font-bold hover:scale-105 transition-all">Save Entry</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Net Worth" value={netWorth} change="+4.2%" trend="up" icon={Wallet} />
            <StatCard title="Monthly Spend" value={45200} change="-12%" trend="down" icon={TrendingDown} />
            <StatCard title="Financial Health" value={`${healthScore}%`} change="+2 pts" trend="up" icon={Activity} />
            <StatCard title="Active Goals" value={goals.length} icon={Target} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold font-display">Capital Projection</h3>
                    <p className="text-slate-400 text-sm">Historical vs AI Predicted Flow</p>
                  </div>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['1W', '1M', '3M', '6M'].map(p => (
                      <button key={p} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${p === '1M' ? 'bg-primary text-slate-950' : 'text-slate-400 hover:text-white'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10e4a5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10e4a5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#10e4a5' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10e4a5"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights & Anomalies */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 glass-card rounded-3xl border-slate-800">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Zap className="text-yellow-400 w-5 h-5" /> AI Recommendations
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-sm text-slate-300">You could save <span className="text-primary font-bold">₹4,200</span> by switching your streaming subscriptions to annual billing.</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-sm text-slate-300">Dining expenses are <span className="text-rose-400 font-bold">22% higher</span> than your average this week.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 glass-card rounded-3xl border-slate-800">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <AlertCircle className="text-rose-400 w-5 h-5" /> Anomaly Alerts
                  </h4>
                  {anomalies.length > 0 ? (
                    <div className="space-y-3">
                      {anomalies.map((a, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-900 rounded-xl transition-colors">
                          <div>
                            <div className="font-bold text-sm">{a.name}</div>
                            <div className="text-xs text-slate-500">{a.date}</div>
                          </div>
                          <div className="text-rose-400 font-bold">₹{a.amount}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm italic">
                      No unusual activity detected in the last 30 days.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Distribution */}
            <div className="space-y-8">
              <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
                <h3 className="text-xl font-bold font-display mb-6">Spending Analysis</h3>
                <div className="h-[200px] mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categories}>
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10e4a5' : '#3b82f6'} />
                        ))}
                      </Bar>
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {categories.map((c, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-blue-500'}`} />
                        <span className="text-slate-400 text-sm group-hover:text-white transition-colors">{c.name}</span>
                      </div>
                      <span className="font-bold text-sm">₹{c.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 glass-card rounded-[2.5rem] border-slate-800 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-display">Target Projections</h3>
                  <ChevronRight className="text-slate-500 hover:text-white cursor-pointer" />
                </div>
                <div className="space-y-6">
                  {goals.map((g, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold">{g.name}</span>
                        <span className="text-slate-400">₹{g.saved} / ₹{g.target}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${(g.saved / g.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                  Manage All Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}