"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { apiAdminLogin, apiRequestLoginOtp, apiResendChallenge } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { useSessionState } from "../../hooks/useSessionState";
import ThemeToggle from "../../components/ThemeToggle";

export default function AdminLogin() {
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // # Admin authentication shares the OTP gate; passwords alone never issue JWTs.
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState("");
  const { acceptVerifiedSession } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!challenge) {
        setChallenge(await apiRequestLoginOtp(email, password));
        setPassword("");
        return;
      }
      const data = await apiAdminLogin(challenge, otp);
      acceptVerifiedSession(data);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
      localStorage.removeItem("renoweb_jwt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-theme={isDark ? "dark" : "light"} style={{ colorScheme: isDark ? "dark" : "light" }} className="relative min-h-screen bg-[var(--rw-bg)] text-[var(--rw-text)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="absolute right-6 top-6">
        <ThemeToggle isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-16 h-16 text-[var(--rw-deep-blue)]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-oswald tracking-wide">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Secure access restricted to authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--rw-surface)] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {challenge ? (
              <div>
                <p className="text-sm mb-4">Enter the code sent to {challenge.email}.</p>
                <label htmlFor="admin-otp" className="text-sm font-semibold">Verification code</label>
                <input id="admin-otp" autoFocus autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-2 w-full p-3 border border-gray-200 rounded-xl" />
                <button type="button" disabled={loading} className="text-sm text-blue-600 mt-3" onClick={async () => {
                  setLoading(true); setError("");
                  try { await apiResendChallenge(challenge); setOtp(""); }
                  catch (err) { setError(err.message); }
                  finally { setLoading(false); }
                }}>Resend code</button>
                <button type="button" disabled={loading} className="text-sm ml-4 text-gray-500" onClick={() => { setChallenge(null); setOtp(""); setError(""); }}>Use another account</button>
              </div>
            ) : <>
            <div>
              <label className="text-[13px] font-bold text-[var(--rw-text)] block mb-1.5 uppercase tracking-wide">
                Admin Username or Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-[var(--rw-surface)] focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[var(--rw-text)]"
                  placeholder="admin@renoweb.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-[var(--rw-text)] block mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-[var(--rw-surface)] focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[var(--rw-text)]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            </>}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 bg-[#023dbb] hover:bg-[#308fef] text-white rounded-xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {challenge ? "Verify & Sign In" : "Send Verification Code"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
