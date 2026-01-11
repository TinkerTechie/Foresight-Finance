'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
  Sparkles,
  Chrome,
  Github
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('prompt');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (formData.password.length >= 12) strength += 10;
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength += 20;

    setPasswordStrength(strength);
  }, [formData.password]);

  // Validation
  const validateForm = () => {
    if (isRegistering) {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (passwordStrength < 50) {
        setError('Please choose a stronger password');
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  // Handle Email/Password Auth
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Auth error:', err);

      // User-friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccess('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setFormData({ ...formData, email: '' });
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-rose-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatePresence mode="wait">
        {view === 'prompt' ? (
          <motion.div
            key="prompt"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mb-8 inline-flex p-6 bg-primary/10 rounded-full"
            >
              <Shield className="w-16 h-16 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold font-display mb-4 text-white"
            >
              Foresight <span className="text-gradient">Finance</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-400 mb-10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Financial Intelligence
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setView('loginForm')}
              className="group bg-primary text-slate-950 font-bold px-12 py-6 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 mx-auto"
            >
              Enter Finance Command Center
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-sm text-slate-500"
            >
              Secured with AES-256 encryption • GDPR Compliant
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="loginForm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="p-8 glass-card rounded-3xl border-slate-800">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold font-display text-white mb-2">
                  {showForgotPassword ? 'Reset Password' : isRegistering ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-slate-400">
                  {showForgotPassword
                    ? 'Enter your email to receive reset instructions'
                    : isRegistering
                      ? 'Join thousands of smart investors'
                      : 'Continue to your financial dashboard'}
                </p>
              </div>

              {/* Social Auth Buttons */}
              {!showForgotPassword && (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#0a0f1e] text-slate-500">or continue with email</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Forms */}
              <form onSubmit={showForgotPassword ? handlePasswordReset : handleAuth} className="space-y-5">
                {/* Name Field (Register Only) */}
                {isRegistering && !showForgotPassword && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Password Fields */}
                {!showForgotPassword && (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {isRegistering && formData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Password Strength</span>
                          <span className={`font-bold ${passwordStrength < 40 ? 'text-rose-500' :
                              passwordStrength < 70 ? 'text-yellow-500' :
                                'text-emerald-500'
                            }`}>
                            {getPasswordStrengthLabel()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getPasswordStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Confirm Password (Register Only) */}
                    {isRegistering && (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirm Password"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    )}

                    {/* Forgot Password Link */}
                    {!isRegistering && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Error Message */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 text-rose-400 text-sm bg-rose-500/10 p-4 rounded-xl border border-rose-500/20"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 text-emerald-400 text-sm bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-slate-950 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : showForgotPassword ? (
                    'Send Reset Link'
                  ) : isRegistering ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Toggle Forms */}
                <div className="text-center text-slate-500 text-sm space-y-2">
                  {showForgotPassword ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-primary font-bold hover:underline"
                    >
                      ← Back to login
                    </button>
                  ) : (
                    <>
                      <div>
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setSuccess('');
                            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                          }}
                          className="text-primary font-bold hover:underline"
                        >
                          {isRegistering ? 'Sign in' : 'Sign up'}
                        </button>
                      </div>

                      {isRegistering && (
                        <p className="text-xs mt-4 text-slate-600">
                          By creating an account, you agree to our{' '}
                          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setView('prompt');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setError('');
                setSuccess('');
                setShowForgotPassword(false);
                setIsRegistering(false);
              }}
              className="mt-6 text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              ← Back to home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
