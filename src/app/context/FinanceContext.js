'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '@/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [exchangeRates, setExchangeRates] = useState({ INR: 83.3, EUR: 0.92, GBP: 0.79 });

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Create or update user profile in Firestore
                try {
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    await setDoc(userRef, {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || 'User',
                        photoURL: firebaseUser.photoURL || null,
                        lastLogin: Timestamp.now(),
                        createdAt: Timestamp.now()
                    }, { merge: true });

                    // Listen to user profile updates
                    const unsubProfile = onSnapshot(userRef, (doc) => {
                        if (doc.exists()) {
                            setUserProfile({ id: doc.id, ...doc.data() });
                        }
                    });

                    return () => unsubProfile();
                } catch (error) {
                    console.error('Error updating user profile:', error);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Real-time transactions listener
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            return;
        }

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid)
        );

        const unsubTx = onSnapshot(q, (snapshot) => {
            const txData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Ensure date is properly formatted
                date: doc.data().date || new Date().toISOString().split('T')[0]
            }));

            // Sort by date (newest first)
            txData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(txData);
        }, (error) => {
            console.error('Error fetching transactions:', error);
        });

        return () => unsubTx();
    }, [user]);

    // Real-time goals listener
    useEffect(() => {
        if (!user) {
            setGoals([]);
            return;
        }

        const qGoals = query(
            collection(db, 'goals'),
            where('userId', '==', user.uid)
        );

        const unsubGoals = onSnapshot(qGoals, (snapshot) => {
            const goalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGoals(goalsData);
        }, (error) => {
            console.error('Error fetching goals:', error);
        });

        return () => unsubGoals();
    }, [user]);

    // Add transaction with validation
    const addTransaction = async (tx) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Validate transaction data
        if (!tx.name || !tx.amount || !tx.transaction_type || !tx.category) {
            throw new Error('Missing required transaction fields');
        }

        try {
            const docRef = await addDoc(collection(db, 'transactions'), {
                ...tx,
                amount: parseFloat(tx.amount), // Ensure amount is a number
                userId: user.uid,
                date: tx.date || new Date().toISOString().split('T')[0],
                createdAt: Timestamp.now(),
            });

            return docRef.id;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    };

    // Update transaction
    const updateTransaction = async (txId, updates) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            const txRef = doc(db, 'transactions', txId);
            await updateDoc(txRef, {
                ...updates,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    };

    // Delete transaction
    const deleteTransaction = async (txId) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            await deleteDoc(doc(db, 'transactions', txId));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    // Add goal
    const addGoal = async (goal) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            const docRef = await addDoc(collection(db, 'goals'), {
                ...goal,
                userId: user.uid,
                saved: goal.saved || 0,
                createdAt: Timestamp.now(),
            });

            return docRef.id;
        } catch (error) {
            console.error('Error adding goal:', error);
            throw error;
        }
    };

    // Update goal
    const updateGoal = async (goalId, updates) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            const goalRef = doc(db, 'goals', goalId);
            await updateDoc(goalRef, {
                ...updates,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating goal:', error);
            throw error;
        }
    };

    // Delete goal
    const deleteGoal = async (goalId) => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            await deleteDoc(doc(db, 'goals', goalId));
        } catch (error) {
            console.error('Error deleting goal:', error);
            throw error;
        }
    };

    // Calculate net worth
    const getNetWorth = () => {
        const income = transactions
            .filter(t => t.transaction_type === 'credit')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const expenses = transactions
            .filter(t => t.transaction_type === 'debit')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        return income - expenses;
    };

    // Calculate financial health score
    const getFinancialHealthScore = () => {
        if (transactions.length === 0) return 0;

        const income = transactions
            .filter(t => t.transaction_type === 'credit')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const expenses = transactions
            .filter(t => t.transaction_type === 'debit')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        if (income === 0) return 0;

        const savingsRate = ((income - expenses) / income) * 100;

        // Additional factors
        const hasGoals = goals.length > 0 ? 10 : 0;
        const transactionCount = Math.min(transactions.length / 2, 10); // Up to 10 points for having transactions

        const score = Math.min(100, Math.max(0, Math.round(savingsRate * 1.5 + hasGoals + transactionCount)));
        return score;
    };

    // Get spending by category
    const getSpendingByCategory = () => {
        const categories = {};

        transactions
            .filter(t => t.transaction_type === 'debit')
            .forEach(t => {
                if (!categories[t.category]) {
                    categories[t.category] = 0;
                }
                categories[t.category] += Number(t.amount);
            });

        return Object.entries(categories).map(([name, value]) => ({
            name,
            value: Math.round(value)
        }));
    };

    // Get monthly statistics
    const getMonthlyStats = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTransactions = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
            .filter(t => t.transaction_type === 'credit')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = monthlyTransactions
            .filter(t => t.transaction_type === 'debit')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            income,
            expenses,
            savings: income - expenses,
            transactionCount: monthlyTransactions.length
        };
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setUserProfile(null);
            setTransactions([]);
            setGoals([]);
            setAccounts([]);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        // User state
        user,
        userProfile,
        loading,

        // Data
        accounts,
        transactions,
        goals,
        exchangeRates,

        // Transaction methods
        addTransaction,
        updateTransaction,
        deleteTransaction,

        // Goal methods
        addGoal,
        updateGoal,
        deleteGoal,

        // Analytics
        getNetWorth,
        getFinancialHealthScore,
        getSpendingByCategory,
        getMonthlyStats,

        // Auth
        signOut
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
