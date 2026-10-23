"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Target, Briefcase, Zap, X, KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import { apiForgotPassword, apiVerifyOtp, apiResetPassword, apiResendChallenge } from "../lib/api";

import GoogleAuthButton from "./GoogleAuthButton";

// # Unmounting the form clears OTPs, password inputs and popup state on every close.
export default function AuthModal({ isOpen, onClose }) {
  // # Escape page/header stacking contexts so navigation cannot paint over the dialog.
  return isOpen && typeof document !== "undefined" ? createPortal(<AuthModalContent onClose={onClose} />, document.body) : null;
}

function AuthModalContent({ onClose }) {
  const [viewMode, setViewMode] = useState("login"); // 'login', 'signup', 'forgot-password', 'verify-otp', 'reset-password'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  // # Challenges are memory-only and cannot create a session before OTP succeeds.
  const [challenge, setChallenge] = useState(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  const { signup, requestLoginOtp, verifyLoginOtp } = useAuth();
  const beginVerification = (result) => {
    setChallenge(result);
    setUsername(result.suggested_username || username);
    setPassword("");
    setOtp("");
    setError("");
    setSuccessMsg(`Verification code sent to ${result.email}.`);
    setViewMode("verify-login-otp");
    setResendTimer(result.resend_after || 60);
  };
  const handleGoogleError = (err) => {
    setError(err.message);
    setSuccessMsg("");
    if (err.email) setEmail(err.email);
    if (err.code === "ACCOUNT_EXISTS") setViewMode("login");
    if (err.code === "ACCOUNT_NOT_FOUND") setViewMode("signup");
  };

  useEffect(() => {
    let interval;
    if ((viewMode === "verify-otp" || viewMode === "verify-login-otp") && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      if (viewMode === "verify-login-otp") {
        const res = await apiResendChallenge(challenge);
        setSuccessMsg(res.message || "OTP resent to your email.");
      } else {
        const res = await apiForgotPassword(email);
        setSuccessMsg(res.message || "OTP resent to your email.");
      }
      setResendTimer(60);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (viewMode === "login") {
        const res = await requestLoginOtp(email, password);
        beginVerification(res);
      } else if (viewMode === "verify-login-otp") {
        await verifyLoginOtp(challenge, otp, challenge.needs_username ? username : undefined);
        onClose();
        router.push("/dashboard");
      } else if (viewMode === "signup") {
        const result = await signup(username, email, password);
        beginVerification(result);
      } else if (viewMode === "forgot-password") {
        const res = await apiForgotPassword(email);
        setSuccessMsg(res.message || "OTP sent to your email.");
        setViewMode("verify-otp");
        setResendTimer(60);
      } else if (viewMode === "verify-otp") {
        const res = await apiVerifyOtp(email, otp);
        setSuccessMsg(res.message || "OTP verified.");
        // Add a small artificial delay for better UX so the loading state is visible
        await new Promise(resolve => setTimeout(resolve, 800));
        setViewMode("reset-password");
      } else if (viewMode === "reset-password") {
        const res = await apiResetPassword(email, otp, newPassword);
        setSuccessMsg(res.message || "Password reset successfully. You can now log in.");
        setViewMode("login");
        setPassword("");
        setOtp("");
        setNewPassword("");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
    switch (viewMode) {
      case "login": return "Welcome Back";
      case "signup": return "Create Account";
      case "forgot-password": return "Reset Password";
      case "verify-otp": return "Enter OTP";
      case "verify-login-otp": return challenge?.needs_username ? "Make It Yours" : "Check Your Email";
      case "reset-password": return "New Password";
      default: return "Welcome";
    }
  };

  const renderSubtitle = () => {
    switch (viewMode) {
      case "login": return "Sign in to access your pipeline.";
      case "signup": return "Sign up to start generating premium leads.";
      case "forgot-password": return "Enter your email to receive a recovery OTP.";
      case "verify-otp": return "Check your email for the 6-digit OTP.";
      case "verify-login-otp": return challenge?.needs_username ? "Choose your username and enter the verification code to finish signing up." : challenge?.intent === "signup" ? "Verify your email to finish creating your account." : "Enter the six-digit code to securely finish signing in.";
      case "reset-password": return "Create a strong new password.";
      default: return "";
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Account authentication" className="fixed inset-0 z-[10000] isolate flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] max-h-[92dvh]"
      >
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-7 sm:p-10 lg:p-12 flex flex-col relative overflow-y-auto">
          
          <button
            onClick={onClose}
            aria-label="Close authentication"
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-[var(--rw-border)] rounded-full transition-colors"
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
              {renderTitle()}
            </h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">
              {renderSubtitle()}
            </p>

            {error && (
              <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}
            {successMsg && (
              <div role="status" className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            {(viewMode === "login" || viewMode === "signup") && (
              <GoogleAuthButton intent={viewMode === "signup" ? "signup" : "signin"} disabled={loading || googleBusy}
                onVerified={beginVerification} onError={handleGoogleError} onBusyChange={setGoogleBusy} />
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {(viewMode === "signup" || (viewMode === "verify-login-otp" && challenge?.needs_username)) && (
                <div>
                  <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      minLength={3}
                      maxLength={40}
                      pattern="[A-Za-z0-9_.-]+"
                      autoComplete="username"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(viewMode === "login" || viewMode === "forgot-password") && (
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
                      className="w-full pl-10 pr-4 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="name@company.com or username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {viewMode === "signup" && (
                <div>
                  <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(viewMode === "login" || viewMode === "signup") && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[13px] font-bold text-[#191919] block uppercase tracking-wide">
                      Password
                    </label>
                    {viewMode === "login" && (
                      <button
                        type="button"
                        disabled={loading || googleBusy}
                        onClick={() => {
                          setViewMode("forgot-password");
                          setError("");
                          setSuccessMsg("");
                        }}
                        className="text-[12px] font-semibold text-[#308fef] hover:text-[#023dbb] transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {(viewMode === "verify-otp" || viewMode === "verify-login-otp") && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[13px] font-bold text-[#191919] block uppercase tracking-wide">
                      6-Digit OTP
                    </label>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      className="text-[12px] font-semibold text-[#308fef] hover:text-[#023dbb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      autoFocus
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>
                </div>
              )}

              {viewMode === "reset-password" && (
                <div>
                  <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex="-1"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleBusy}
                className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#023dbb] to-[#4460ef] hover:from-[#4460ef] hover:to-[#308fef] text-white rounded-xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(2,61,187,0.3)] hover:shadow-[0_6px_20px_rgba(48,143,239,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {viewMode === "login" && "Sign In"}
                    {viewMode === "signup" && "Create Account"}
                    {viewMode === "forgot-password" && "Send OTP"}
                    {viewMode === "verify-otp" && "Verify OTP"}
                    {viewMode === "verify-login-otp" && (challenge?.intent === "signup" ? "Verify & Create Account" : "Verify & Continue")}
                    {viewMode === "reset-password" && "Reset Password"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              {(viewMode === "login" || viewMode === "signup") ? (
                <button
                  type="button"
                  onClick={() => {
                    setChallenge(null);
                    setOtp("");
                    setViewMode(viewMode === "login" ? "signup" : "login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-[#308fef] transition-colors"
                >
                  {viewMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading || googleBusy}
                  onClick={() => {
                    setViewMode("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-[#308fef] transition-colors"
                >
                  Back to Sign In
                </button>
              )}
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-surface rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center z-20"
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
