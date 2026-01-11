'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    TrendingUp,
    Wallet,
    Target,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    User as UserIcon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const { user, userProfile, signOut } = useFinance();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Income', href: '/income', icon: TrendingUp },
        { name: 'Expenses', href: '/endf', icon: Wallet },
        { name: 'Goals', href: '/foresightfinance', icon: Target },
    ];

    const isActive = (href) => pathname === href;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold font-display hidden sm:block">
                            Foresight <span className="text-gradient">Finance</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${isActive(item.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all hidden sm:block">
                            <Search size={20} />
                        </button>

                        {/* Notifications */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all relative hidden sm:block">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                        </button>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl transition-all"
                            >
                                {user?.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-white hidden sm:block">
                                    {user?.displayName?.split(' ')[0] || 'User'}
                                </span>
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-64 glass-card border-slate-800 rounded-2xl p-4 shadow-xl"
                                    onMouseLeave={() => setShowProfileMenu(false)}
                                >
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                                        {user?.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt="Profile"
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserIcon className="w-6 h-6 text-primary" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-white">{user?.displayName || 'User'}</div>
                                            <div className="text-xs text-slate-400">{user?.email}</div>
                                        </div>
                                    </div>

                                    <div className="py-2 space-y-1">
                                        <Link
                                            href="/userinfo"
                                            className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <Settings size={18} />
                                            <span className="text-sm">Settings</span>
                                        </Link>

                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                            <LogOut size={18} />
                                            <span className="text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all md:hidden"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-slate-800"
                    >
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive(item.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
