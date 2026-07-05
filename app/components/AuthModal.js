"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Target, Briefcase, Zap, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { login, signup } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setEmail("");
      setPassword("");
      setIsLogin(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]"
      >
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 lg:p-12 flex flex-col justify-center relative">
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute top-8 left-10">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <span className="text-[#023dbb]">RENO</span>
              <span className="text-[#308fef]">WEB</span>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-[#191919] mb-2 font-oswald tracking-wide">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">
              {isLogin ? "Sign in to access your pipeline." : "Sign up to start generating premium leads."}
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                    placeholder="name@company.com or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#023dbb] to-[#4460ef] hover:from-[#4460ef] hover:to-[#308fef] text-white rounded-xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(2,61,187,0.3)] hover:shadow-[0_6px_20px_rgba(48,143,239,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-gray-500 hover:text-[#308fef] transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Illustration */}
        <div className="hidden md:flex w-1/2 bg-[#023dbb] relative overflow-hidden flex-col items-center justify-center p-10 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#023dbb] via-[#4460ef] to-[#308fef] opacity-90" />
          
          {/* Animated background circles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-[#4ec8ef] rounded-full mix-blend-screen filter blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-[#ffc857] rounded-full mix-blend-screen filter blur-3xl"
          />

          <div className="relative z-10 w-full max-w-md mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h3 className="text-4xl font-oswald font-bold mb-4 leading-tight">
                Supercharge Your <br />
                <span className="text-[#ffc857]">Lead Generation</span>
              </h3>
              <p className="text-[#4ec8ef] text-lg font-medium mb-10 opacity-90">
                Unlock high-quality prospects with our advanced AI-driven pipeline.
              </p>
            </motion.div>

            {/* Illustration Elements */}
            <div className="relative h-64 w-full">
              {/* Central Node */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center z-20"
              >
                <Target className="w-12 h-12 text-[#023dbb]" />
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-4 left-4 w-16 h-16 bg-[#ffc857] rounded-xl flex items-center justify-center shadow-lg z-10 opacity-90 backdrop-blur-md border border-white/20"
              >
                <Briefcase className="w-8 h-8 text-[#191919]" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-4 right-4 w-16 h-16 bg-[#4ec8ef] rounded-xl flex items-center justify-center shadow-lg z-10 opacity-90 backdrop-blur-md border border-white/20"
              >
                <Zap className="w-8 h-8 text-[#023dbb]" />
              </motion.div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full z-0 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M 20 20 Q 50 50 80 80"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, 20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M 80 20 Q 50 50 20 80"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
