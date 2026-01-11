"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { storage } from "../utils/storage";
import { User, DollarSign, Target, CreditCard, Briefcase, ArrowRight } from "lucide-react";

export function FloatingEmojis() {
  const emojis = ["💼", "💰", "📊", "👤", "📝", "🏦", "📈", "💳", "🧾", "🪙", "🧮", "📉"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          initial={{
            y: "110vh",
            x: Math.random() * 100 + "vw",
            opacity: 0
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-4xl filter blur-[1px]"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

const InputField = ({ label, name, type = "text", onChange, value, icon: Icon }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300`}
          placeholder={`Enter your ${label.toLowerCase()}`}
          autoComplete="off"
          required
        />
      </div>
    </div>
  );
};

export default function UserInfoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    salary: "",
    incomeSource: "",
    otherIncome: "",
    saving: "",
    limit: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: form.name,
      salary: parseInt(form.salary) || 0,
      saving: parseInt(form.saving) || 0,
      limit: parseInt(form.limit) || 0,
    };
    storage.set("userData", userData);
    router.push("/foresightfinance");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0F172A]">
      <FloatingEmojis />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3">
              Tell Us About You
            </h1>
            <p className="text-slate-400">
              Help us personalize your financial journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                icon={User}
              />
              <InputField
                label="Age"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                icon={User} // Using User icon for Age as well, or could find a better one
              />
              <InputField
                label="Salary"
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                icon={DollarSign}
              />
              <InputField
                label="Saving Goal"
                name="saving"
                type="number"
                value={form.saving}
                onChange={handleChange}
                icon={Target}
              />
              <InputField
                label="Daily Spending Limit"
                name="limit"
                type="number"
                value={form.limit}
                onChange={handleChange}
                icon={CreditCard}
              />
              <InputField
                label="Primary Income Source"
                name="incomeSource"
                value={form.incomeSource}
                onChange={handleChange}
                icon={Briefcase}
              />
            </div>

            <div className="pt-2">
              <InputField
                label="Other Income Sources"
                name="otherIncome"
                value={form.otherIncome}
                onChange={handleChange}
                icon={DollarSign}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue to Finance Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

