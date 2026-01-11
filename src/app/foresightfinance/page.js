'use client';

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Trash2,
  Trophy,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, updateGoal } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    saved: '0',
    deadline: ''
  });

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await addGoal({
        ...newGoal,
        target: Number(newGoal.target),
        saved: Number(newGoal.saved)
      });
      setIsModalOpen(false);
      setNewGoal({ name: '', target: '', saved: '0', deadline: '' });
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleUpdateProgress = async (goal, amount) => {
    const newSaved = Math.min(goal.target, Math.max(0, goal.saved + amount));
    await updateGoal(goal.id, { saved: newSaved });
  };

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved), 0);
  const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#020617] p-4 lg:p-8 pt-24 text-slate-100">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Financial <span className="text-gradient">Goals</span></h1>
              <p className="text-slate-400">Plan your future and track your progress.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={18} /> New Goal
            </button>
          </div>

          {/* Overview Card */}
          <div className="p-8 mb-10 glass-card rounded-[2.5rem] border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h2 className="text-2xl font-bold font-display mb-2">Total Progress</h2>
                <div className="text-4xl font-bold text-primary">
                  {Math.round(progress)}% <span className="text-lg text-slate-400 font-normal">Completed</span>
                </div>
                <p className="text-slate-400 mt-2">
                  You&apos;ve saved <span className="text-white font-bold">₹{totalSaved.toLocaleString()}</span> out of <span className="text-white font-bold">₹{totalTarget.toLocaleString()}</span>
                </p>
              </div>
              <div className="w-full md:w-1/3">
                {/* Circular Progress or Badges could go here */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-full">
                    <Trophy className="text-yellow-500 w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{goals.filter(g => g.saved >= g.target).length} Goals</div>
                    <div className="text-sm text-slate-400">Achieved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full bg-slate-900 h-4 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-primary to-blue-500 relative"
              >
                <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map((goal) => {
                const goalProgress = (goal.saved / goal.target) * 100;
                const isCompleted = goalProgress >= 100;

                return (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-6 glass-card rounded-3xl border transition-all ${isCompleted ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${isCompleted ? 'bg-primary/20 text-primary' : 'bg-slate-900 text-slate-400'}`}>
                        {isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-slate-600 hover:text-rose-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold mb-1">{goal.name}</h3>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-slate-400">Target: ₹{Number(goal.target).toLocaleString()}</span>
                      <span className="font-bold text-primary">{Math.round(goalProgress)}%</span>
                    </div>

                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goalProgress}%` }}
                        className={`h-full ${isCompleted ? 'bg-primary' : 'bg-blue-500'}`}
                      />
                    </div>

                    {!isCompleted && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateProgress(goal, 1000)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-bold border border-slate-800 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus size={14} /> ₹1k
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(goal, 5000)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-bold border border-slate-800 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus size={14} /> ₹5k
                        </button>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="py-2 text-center text-primary font-bold bg-primary/10 rounded-xl text-sm">
                        Goal Completed! 🎉
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {goals.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <div className="inline-flex p-4 bg-slate-900 rounded-full mb-4">
                  <Target className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
                <p className="text-slate-400 mb-6">Create your first financial goal to start tracking.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Create Goal
                </button>
              </div>
            )}
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
              <h3 className="text-2xl font-bold font-display mb-6">Create New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <input
                  type="text"
                  placeholder="Goal Name (e.g. New Laptop)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Target Amount (₹)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Normally Saved (₹)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newGoal.saved}
                  onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
                />
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
                    Create Goal
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
