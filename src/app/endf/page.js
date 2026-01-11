'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ShoppingBag,
  Plus,
  AlertOctagon
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

export default function ExpensesPage() {
  const { transactions, addTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter only debit transactions
  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => t.transaction_type === 'debit');
  }, [transactions]);

  // Calculate totals
  const totalExpenses = useMemo(() => {
    return expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  }, [expenseTransactions]);

  // Group by category
  const expensesByCategory = useMemo(() => {
    const groups = {};
    expenseTransactions.forEach(t => {
      const cat = t.category || 'Other';
      groups[cat] = (groups[cat] || 0) + Number(t.amount);
    });
    return Object.keys(groups).map(name => ({ name, value: groups[name] }));
  }, [expenseTransactions]);

  // Monthly breakdown
  const monthlyExpenses = useMemo(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    months.forEach((m, i) => data.push({ name: m, amount: 0 }));

    expenseTransactions.forEach(t => {
      const date = new Date(t.date);
      if (date.getFullYear() === currentYear) {
        data[date.getMonth()].amount += Number(t.amount);
      }
    });

    const currentMonth = new Date().getMonth();
    return data.slice(0, currentMonth + 1);
  }, [expenseTransactions]);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'Shopping',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...newExpense,
        transaction_type: 'debit'
      });
      setIsModalOpen(false);
      setNewExpense({
        name: '',
        amount: '',
        category: 'Shopping',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#020617] p-4 lg:p-8 pt-24 text-slate-100">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Expense <span className="text-gradient">Breakdown</span></h1>
              <p className="text-slate-400">Analyze where your money goes.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={18} /> Add Expense
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
                <div className="p-3 bg-rose-500/10 rounded-xl">
                  <TrendingDown className="text-rose-500 w-6 h-6" />
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Total Spending</div>
              <div className="text-3xl font-bold font-display">₹{totalExpenses.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 glass-card rounded-3xl border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <AlertOctagon className="text-orange-500 w-6 h-6" />
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Highest Category</div>
              <div className="text-3xl font-bold font-display">
                {expensesByCategory.length > 0
                  ? expensesByCategory.sort((a, b) => b.value - a.value)[0].name
                  : '-'}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 glass-card rounded-3xl border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <CreditCard className="text-blue-500 w-6 h-6" />
                </div>
              </div>
              <div className="text-slate-400 text-sm font-medium mb-1">Transaction Count</div>
              <div className="text-3xl font-bold font-display">{expenseTransactions.length}</div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 p-8 glass-card rounded-[2.5rem] border-slate-800">
              <h3 className="text-xl font-bold font-display mb-6">Spending Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
              <h3 className="text-xl font-bold font-display mb-6">Categories</h3>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {expensesByCategory.slice(0, 4).map((entry, index) => (
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

          {/* List */}
          <div className="p-8 glass-card rounded-[2.5rem] border-slate-800">
            <h3 className="text-xl font-bold font-display mb-6">Recent Expenses</h3>
            <div className="space-y-4">
              {expenseTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-900/50 rounded-2xl transition-colors border border-transparent hover:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="font-bold">{tx.name}</div>
                      <div className="text-xs text-slate-500">{tx.date} • {tx.category}</div>
                    </div>
                  </div>
                  <div className="font-bold text-rose-400">-₹{Number(tx.amount).toLocaleString()}</div>
                </div>
              ))}
              {expenseTransactions.length === 0 && (
                <div className="text-center text-slate-500 py-8">No expense records found</div>
              )}
            </div>
          </div>

        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md p-8 glass-card border-slate-800 rounded-3xl"
            >
              <h3 className="text-2xl font-bold font-display mb-6">Add Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                  type="text"
                  placeholder="Merchant / Item"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option>Shopping</option>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Entertainment</option>
                  <option>Bills</option>
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
                    className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
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
