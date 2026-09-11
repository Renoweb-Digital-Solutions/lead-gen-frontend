"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { apiAdminLogin } from "../../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiAdminLogin(email, password);
      // Store the admin token
      localStorage.setItem("renoweb_jwt", data.access_token);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
      localStorage.removeItem("renoweb_jwt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-16 h-16 text-[#023dbb]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-oswald tracking-wide">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Secure access restricted to authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                Admin Username or Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                  placeholder="admin@renoweb.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-[#191919] block mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mt-1">
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
              className="w-full mt-2 py-3.5 px-6 bg-[#023dbb] hover:bg-[#308fef] text-white rounded-xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Secure Login
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
