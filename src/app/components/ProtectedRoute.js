'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';

/**
 * Protected Route Component
 * Wraps pages that require authentication
 */
export default function ProtectedRoute({ children }) {
    const { user, loading } = useFinance();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // User is not authenticated, redirect to login
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading screen while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                        <Shield className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <span className="text-xl text-slate-400 font-medium">Authenticating...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!user) {
        return null;
    }

    // User is authenticated, show the protected content
    return <>{children}</>;
}
