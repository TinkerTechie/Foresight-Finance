'use client';

// Polyfill/Mock localStorage for Server-Side Rendering (SSR) 
// to prevent "localStorage.getItem is not a function" errors in some environments.
if (typeof window === 'undefined') {
  if (typeof global.localStorage === 'undefined' || typeof global.localStorage.getItem !== 'function') {
    global.localStorage = {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { },
      key: () => null,
      length: 0
    };
  }
}

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useFinance } from "../context/FinanceContext";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  BarChart3,
  Globe,
  Users,
  Star,
  Quote,
  Lock,
  Wallet,
  PieChart,
  CreditCard,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useFinance();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 cyan-glow">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight">Foresight<span className="text-primary">Finance</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-300 hover:text-primary transition-colors">Features</Link>
            <Link href="#why" className="text-slate-300 hover:text-primary transition-colors">Why Us</Link>
            <Link href="#pricing" className="text-slate-300 hover:text-primary transition-colors">Pricing</Link>
            <Link href="#faq" className="text-slate-300 hover:text-primary transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="bg-primary text-slate-950 font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Command Center
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
                <Link href="/login" className="bg-primary text-slate-950 font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-gradient">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 50,000+ users worldwide
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] mb-6">
              Predict Your <span className="text-gradient">Financial Future</span> with AI.
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-xl">
              Take control of your wealth with real-time insights, smart budgeting, and precise forecasting. The only finance platform designed for the next generation of investors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="group bg-primary text-slate-950 font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Join Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors font-semibold flex items-center gap-2">
                View Interactive Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            style={{ y: y1 }}
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative z-10 animate-float">
              {/* This is where your generated hero image goes */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                  {/* Fallback pattern if image is missing initially */}
                  <div className="relative w-full h-[500px] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/hero_dashboard_mockup.png"
                      alt="Financial Dashboard"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        // Image component onError handling is different, usually requires state
                        // For simplicity in this fix, we might want to keep img if dynamic error handling is key, 
                        // but build fails. Let's use Image and assume the file exists or rely on static import.
                        // If file doesn't exist, Next.js build might complain if imported statically.
                        // Since it's a string path, it's fine.
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Cards */}
            <motion.div
              drag
              dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
              className="absolute -top-12 -right-12 p-4 glass-card rounded-2xl border-primary/20 cyan-glow z-20 cursor-move"
            >
              <TrendingUp className="text-primary w-8 h-8 mb-2" />
              <div className="text-sm font-bold">+12.4%</div>
              <div className="text-[10px] text-slate-400">Monthly Growth</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Assets Tracked", value: "$4.2B+", icon: <BarChart3 /> },
    { label: "Active Users", value: "150k+", icon: <Users /> },
    { label: "Global Reach", value: "40+", icon: <Globe /> },
    { label: "App Rating", value: "4.9/5", icon: <Star /> },
  ];

  return (
    <section className="py-24 border-y border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-primary mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-bold font-display mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="group relative p-8 glass-card rounded-[2rem] border-slate-800 hover:border-primary/30 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-500" />

    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 group-hover:border-primary/50 group-hover:cyan-glow transition-all duration-500">
      <Icon className="text-primary w-7 h-7" />
    </div>

    <h3 className="text-2xl font-bold mb-4 font-display group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed mb-6">
      {desc}
    </p>

    <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
      Learn More <ArrowRight className="w-4 h-4" />
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Smart Dashboard",
      desc: "Every metric you care about, in one beautiful place. Fully customizable widgets to fit your focus."
    },
    {
      icon: Wallet,
      title: "Wealth Tracking",
      desc: "Connect your bank accounts, crypto wallets, and investments. Real-time net worth calculation at your fingertips."
    },
    {
      icon: PieChart,
      title: "AI Budgeting",
      desc: "Our machine learning algorithms analyze your spending patterns and suggest ways to save smarter."
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      desc: "We use 256-bit AES encryption and multi-factor authentication. Your financial data is for your eyes only."
    },
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display mb-6"
          >
            Everything you need for <span className="text-gradient">Wealth Management</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Built for power users, designed for everyone. Experience the future of personal finance today.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyForesight = () => {
  const points = [
    { title: "Hyper-Personalization", desc: "No generic advice. Our AI learns your specific goals and risk tolerance.", icon: Zap },
    { title: "Zero Latency Data", desc: "Syncs within seconds of a transaction. Always know your exact balance.", icon: Globe },
    { title: "Multi-Currency Native", desc: "Trade and track in 130+ currencies with real-time exchange rates.", icon: Users },
  ];

  return (
    <section id="why" className="py-32 bg-slate-950/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-8 leading-tight">
              Why thousands of people are switching to <span className="text-primary">Foresight</span>.
            </h2>
            <p className="text-slate-400 text-lg mb-12">
              We aren&apos;t just another banking app. We are a financial co-pilot that helps you navigate the complex world of money management.
            </p>
            <div className="space-y-8">
              {points.map((p, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <p.icon className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{p.title}</h4>
                    <p className="text-slate-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-[3rem] blur-2xl animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card p-8 rounded-3xl border-primary/30 max-w-sm rotate-3 hover:rotate-0 transition-transform duration-500">
                <Quote className="text-primary/50 w-12 h-12 mb-6" />
                <p className="text-xl font-medium text-slate-200 mb-8 italic">
                  &quot;Foresight Finance helped me save for my first home two years earlier than planned. Their forecasting tool is scary accurate.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full" />
                  <div>
                    <div className="font-bold">Sarah Jenkins</div>
                    <div className="text-sm text-slate-500">Software Engineer, Austin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    { name: "Starter", price: "$0", features: ["Basic Tracking", "1 Connected Account", "Weekly Reports"], current: false },
    { name: "Pro", price: "$12", features: ["Unlimited Accounts", "AI Smart Insights", "Real-time Sync", "Priority Support"], current: true },
    { name: "Enterprise", price: "$49", features: ["Family Sharing", "Tax Planning", "API Access", "Dedicated Consultant"], current: false },
  ];

  return (
    <section id="pricing" className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Choose the plan that fits your financial journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${plan.current ? 'border-primary ring-1 ring-primary/50 scale-105 bg-slate-900' : 'border-slate-800 bg-slate-950/50'} flex flex-col`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold font-display">{plan.price}</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.current ? 'bg-primary text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                {plan.current ? 'Start Free Trial' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [active, setActive] = useState(0);
  const questions = [
    { q: "Is my data secure?", a: "Yes, we use military-grade encryption and never sell your data to third parties." },
    { q: "Can I connect international banks?", a: "Absolutely. We support over 15,000 financial institutions in 40+ countries." },
    { q: "How accurate is the AI forecasting?", a: "Our models have a 94% accuracy rate within a 6-month window based on historical data." },
    { q: "Can I cancel anytime?", a: "Yes, there are no contracts. You can downgrade or cancel your subscription with one click." }
  ];

  return (
    <section id="faq" className="py-32 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold font-display mb-16 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                className="w-full p-6 text-left flex justify-between items-center bg-slate-900/50 group"
              >
                <span className="font-bold text-lg group-hover:text-primary transition-colors">{item.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${active === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-400 border-t border-slate-800 bg-slate-900/30">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-slate-800 bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary w-8 h-8" />
            <span className="text-xl font-bold font-display">Foresight Finance</span>
          </div>
          <p className="text-slate-500">
            The world&apos;s most advanced financial forecasting and money management platform.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Mobile App</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Security</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">GDPR</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        &copy; 2026 Foresight Finance Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <main className="min-h-screen selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <WhyForesight />
      <Pricing />
      <FAQ />
      <Footer />

      {/* Scroll to top micro-interaction */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-slate-950 rounded-full flex items-center justify-center shadow-2xl z-40 cyan-glow"
      >
        <ChevronDown className="w-6 h-6 rotate-180" />
      </motion.button>
    </main>
  );
}

