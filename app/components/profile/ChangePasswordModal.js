"use client";


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { apiForgotPassword, apiVerifyOtp, apiResetPassword } from "../../lib/api";

export default function ChangePasswordModal({ isOpen, onClose, username }) {
  const [step, setStep] = useState("confirm"); // 'confirm', 'otp', 'reset', 'success'
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep("confirm");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setResendTimer(0);
      setShowNewPwd(false);
      setShowConfirmPwd(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    try {
      await apiForgotPassword(username);
      setStep("otp");
      setResendTimer(60);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiVerifyOtp(username, otp);
      setStep("reset");
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiResetPassword(username, otp, newPassword);
      setStep("success");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--rw-text-muted)] hover:text-[var(--rw-text-secondary)] hover:bg-[var(--rw-border)] rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {step === "confirm" && (
              <motion.div
                key="confirm"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="w-12 h-12 bg-[var(--rw-surface-hover)] rounded-2xl flex items-center justify-center mb-6 text-[#023dbb]">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--rw-text)] mb-2 font-oswald tracking-wide">
                  Change Password
                </h2>
                <p className="text-[var(--rw-text-muted)] font-medium text-sm mb-6">
                  For your security, we will send a one-time password (OTP) to your registered email address to verify your identity.
                </p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-[#023dbb] hover:bg-[#308fef] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  Send OTP to Email
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="w-12 h-12 bg-[var(--rw-surface-hover)] rounded-2xl flex items-center justify-center mb-6 text-[#023dbb]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--rw-text)] mb-2 font-oswald tracking-wide">
                  Enter OTP
                </h2>
                <p className="text-[var(--rw-text-muted)] font-medium text-sm mb-6">
                  Please enter the 6-digit verification code sent to your email.
                </p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-[13px] font-bold text-[var(--rw-text)] block mb-1.5 uppercase tracking-wide">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[var(--rw-text)] placeholder:text-[var(--rw-text-muted)]"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full bg-[#023dbb] hover:bg-[#308fef] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || resendTimer > 0}
                    className="w-full text-sm font-semibold text-[#023dbb] hover:text-[#308fef] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "reset" && (
              <motion.div
                key="reset"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="w-12 h-12 bg-[var(--rw-surface-hover)] rounded-2xl flex items-center justify-center mb-6 text-[#023dbb]">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--rw-text)] mb-2 font-oswald tracking-wide">
                  New Password
                </h2>
                <p className="text-[var(--rw-text-muted)] font-medium text-sm mb-6">
                  Create a strong new password for your account.
                </p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-[13px] font-bold text-[var(--rw-text)] block mb-1.5 uppercase tracking-wide">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[var(--rw-text)] placeholder:text-[var(--rw-text-muted)]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute inset-y-0 right-3 flex items-center text-[var(--rw-text-muted)] hover:text-[var(--rw-text-secondary)] transition-colors"
                        tabIndex="-1"
                      >
                        {showNewPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-bold text-[var(--rw-text)] block mb-1.5 uppercase tracking-wide">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPwd ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-[var(--rw-surface-hover)] border border-border rounded-xl focus:bg-surface focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[var(--rw-text)] placeholder:text-[var(--rw-text-muted)]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute inset-y-0 right-3 flex items-center text-[var(--rw-text-muted)] hover:text-[var(--rw-text-secondary)] transition-colors"
                        tabIndex="-1"
                      >
                        {showConfirmPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full bg-[#023dbb] hover:bg-[#308fef] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Password"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--rw-text)] mb-2 font-oswald tracking-wide">
                  Password Updated!
                </h2>
                <p className="text-[var(--rw-text-muted)] font-medium text-sm mb-8 max-w-[250px]">
                  Your password has been successfully changed.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Close
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
