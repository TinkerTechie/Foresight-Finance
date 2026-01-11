'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Briefcase,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function IncomePage() {
  const { transactions, addTransaction, loading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter only income transactions
  const incomeTransactions = useMemo(() => {
    return transactions.filter(t => t.transaction_type === 'credit');
  }, [transactions]);

  // Calculate totals
  const totalIncome = useMemo(() => {
    return incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  }, [incomeTransactions]);

  // Group by category for Pie Chart
  const incomeByCategory = useMemo(() => {
    const groups = {};
    incomeTransactions.forEach(t => {
      const cat = t.category || 'Other';
      groups[cat] = (groups[cat] || 0) + Number(t.amount);
    });
    return Object.keys(groups).map(name => ({ name, value: groups[name] }));
  }, [incomeTransactions]);

  // Monthly data for Bar Chart
  const monthlyIncome = useMemo(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize current year months
    const currentYear = new Date().getFullYear();
    months.forEach((m, i) => {
      data.push({ name: m, amount: 0, index: i });
    });

    incomeTransactions.forEach(t => {
      const date = new Date(t.date);
      if (date.getFullYear() === currentYear) {
        data[date.getMonth()].amount += Number(t.amount);
      }
    });

    // Filter out future months if needed, or keep all
    const currentMonth = new Date().getMonth();
    return data.slice(0, currentMonth + 1);
  }, [incomeTransactions]);

  // New Income Form State
  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...newIncome,
        transaction_type: 'credit'
      });
      setIsModalOpen(false);
      setNewIncome({
        name: '',
        amount: '',
        category: 'Salary',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const COLORS = ['#10e4a5', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#020617] p-4 lg:p-8 pt-24 text-slate-100">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Income <span className="text-gradient">Analytics</span></h1>
              <p className="text-slate-400">Track your revenue streams and salary growth.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={18} /> Add Income
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-6 glass-card rounded-3xl border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <DollarSign className="text-emerald-500 w-6 h-6" />
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 rounded-lg text-emerald-500 text-xs font-bold flex items-center gap-1">
                  <ArrowUpRight size={12} /> +12%
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Total Income</div>
              <div className="text-3xl font-bold font-display">₹{totalIncome.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 glass-card rounded-3xl border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <TrendingUp className="text-blue-500 w-6 h-6" />
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Avg. Monthly</div>
              <div className="text-3xl font-bold font-display">
                ₹{monthlyIncome.length > 0 ? Math.round(totalIncome / monthlyIncome.length).toLocaleString() : 0}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 glass-card rounded-3xl border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Briefcase className="text-purple-500 w-6 h-6" />
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Top Source</div>
              <div className="text-3xl font-bold font-display">
                {incomeByCategory.length > 0
                  ? incomeByCategory.sort((a, b) => b.value - a.value)[0].name
                  : '-'}
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Bar Chart */}
            <div className="lg:col-span-2 p-8 glass-card rounded-[2.5rem] border-slate-800">
              <h3 className="text-xl font-bold font-display mb-6">Monthly Revenue</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyIncome}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="amount" fill="#10e4a5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
              <h3 className="text-xl font-bold font-display mb-6">Sources</h3>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-500">Total</span>
                  <span className="font-bold">₹{totalIncome.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {incomeByCategory.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-300">{entry.name}</span>
                    </div>
                    <span className="font-bold">₹{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent List */}
          <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
            <h3 className="text-xl font-bold font-display mb-6">Recent Income</h3>
            <div className="space-y-4">
              {incomeTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-900/50 rounded-2xl transition-colors border border-transparent hover:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <div className="font-bold">{tx.name}</div>
                      <div className="text-xs text-slate-500">{tx.date} • {tx.category}</div>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-400">+₹{Number(tx.amount).toLocaleString()}</div>
                </div>
              ))}
              {incomeTransactions.length === 0 && (
                <div className="text-center text-slate-500 py-8">No income records found</div>
              )}
            </div>
          </div>

        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md p-8 glass-card border-slate-800 rounded-3xl"
            >
              <h3 className="text-2xl font-bold font-display mb-6">Add Income</h3>
              <form onSubmit={handleAddIncome} className="space-y-4">
                <input
                  type="text"
                  placeholder="Source Name (e.g. Salary)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newIncome.name}
                  onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                  required
                />
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newIncome.category}
                  onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                >
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Investment</option>
                  <option>Business</option>
                  <option>Other</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-700 rounded-xl font-bold hover:bg-slate-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-slate-950 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
