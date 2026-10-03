"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyTickets, fetchReportRuns, apiForgotPassword, apiVerifyOtp, apiResetPassword } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { useSessionState } from "../hooks/useSessionState";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import { User, MessageSquare, Calendar, CheckCircle, AlertCircle, XCircle, FileText, Lock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [tickets, setTickets] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [reportsPages, setReportsPages] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { token, isInitializing } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);

  useEffect(() => {
    if (isInitializing) return;
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = JSON.parse(atob(payloadBase64));
      setUsername(decoded.sub || "User");
    } catch (e) {}

    loadData();
  }, [token, isInitializing, router]);

  useEffect(() => {
    if (token) {
      loadReports(reportsPage);
    }
  }, [reportsPage, token]);

  // removed otp interval effect

  async function loadData() {
    setLoading(true);
    try {
      const [ticketsData, reportsData] = await Promise.all([
        fetchMyTickets().catch(() => ({ tickets: [] })),
        fetchReportRuns(1, 10).catch(() => ({ reports: [], total: 0, pages: 0 }))
      ]);
      setTickets(ticketsData.tickets || []);
      setReports(reportsData.reports || []);
      setReportsTotal(reportsData.total || 0);
      setReportsPages(reportsData.pages || 0);
    } catch (err) {
      setError(err.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadReports(page) {
    try {
      const reportsData = await fetchReportRuns(page, 10);
      setReports(reportsData.reports || []);
      setReportsTotal(reportsData.total || 0);
      setReportsPages(reportsData.pages || 0);
    } catch (err) {
      console.error(err);
    }
  }

  // removed inline OTP handlers

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-[var(--rw-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#023dbb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--rw-bg)] flex flex-col text-[var(--rw-text)]" data-theme={isDark ? "dark" : "light"}>
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="lg:hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          isMobileOnly={true} 
          onModuleChange={(mod) => {
            sessionStorage.setItem("renoweb-active-module", JSON.stringify(mod));
            window.dispatchEvent(new Event("local-session-storage"));
            router.push('/dashboard');
          }}
        />
      </div>
      
      <main className="flex-1 max-w-5xl w-full mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 overflow-hidden">
        
        {/* Profile Card */}
        <div className="bg-[var(--rw-surface)] rounded-2xl shadow-[var(--rw-shadow-sm)] border border-[var(--rw-border)] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#023dbb] to-[#308fef] rounded-full flex items-center justify-center text-white shadow-inner shrink-0">
            <User className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="min-w-0 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--rw-text)] font-oswald tracking-wide break-words">
              Welcome, {username}
            </h1>
            <p className="text-[var(--rw-text-muted)] font-medium mt-1">
              Account Overview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Reports Section */}
          <div className="bg-[var(--rw-surface)] rounded-2xl shadow-[var(--rw-shadow-sm)] border border-[var(--rw-border)] overflow-hidden md:col-span-2">
            <div className="px-5 sm:px-6 py-5 border-b border-[var(--rw-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 bg-[var(--rw-surface-hover)]">
              <h2 className="text-xl font-bold text-[var(--rw-text)] font-oswald tracking-wide flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#023dbb] shrink-0" />
                Lead Reports History
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f0f7ff] text-[#023dbb] shrink-0">
                {reportsTotal} Total Generated
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--rw-surface-raised)] rounded-full flex items-center justify-center mb-4 text-[var(--rw-text-muted)]">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[var(--rw-text)] mb-1">No Reports Yet</h3>
                <p className="text-[var(--rw-text-muted)] font-medium max-w-sm">
                  Run a lead generation pipeline from the dashboard to see your history here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--rw-bg)] text-[var(--rw-text-muted)] text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Report Type</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Generated On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rw-border)]">
                    {reports.map((report) => {
                      const date = new Date(report.created_at);
                      const isSuccess = report.status.toLowerCase() === 'success';
                      return (
                        <tr key={report.id} className="hover:bg-[var(--rw-surface-hover)] transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--rw-text)]">{report.report_type}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--rw-text-muted)] font-medium">
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {reportsPages > 1 && (
                  <div className="px-6 py-4 border-t border-[var(--rw-border)] flex items-center justify-between">
                    <span className="text-sm text-[var(--rw-text-muted)] font-medium">
                      Page {reportsPage} of {reportsPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReportsPage(p => Math.max(1, p - 1))}
                        disabled={reportsPage === 1}
                        className="p-2 rounded-lg border border-[var(--rw-border)] text-[var(--rw-text-muted)] hover:bg-[var(--rw-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReportsPage(p => Math.min(reportsPages, p + 1))}
                        disabled={reportsPage === reportsPages}
                        className="p-2 rounded-lg border border-[var(--rw-border)] text-[var(--rw-text-muted)] hover:bg-[var(--rw-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password Reset Section */}
          <div className="bg-[var(--rw-surface)] rounded-2xl shadow-[var(--rw-shadow-sm)] border border-[var(--rw-border)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--rw-border)] flex items-center bg-[var(--rw-surface-hover)]">
              <h2 className="text-xl font-bold text-[var(--rw-text)] font-oswald tracking-wide flex items-center">
                <Lock className="w-5 h-5 mr-2 text-[#023dbb]" />
                Change Password
              </h2>
            </div>
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#023dbb]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[var(--rw-text)] mb-2">Update Your Credentials</h3>
              <p className="text-[var(--rw-text-muted)] font-medium max-w-sm mb-6 text-sm">
                For security reasons, changing your password requires email verification via OTP.
              </p>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full sm:w-auto bg-[#023dbb] hover:bg-[#308fef] text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="bg-[var(--rw-surface)] rounded-2xl shadow-[var(--rw-shadow-sm)] border border-[var(--rw-border)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--rw-border)] flex items-center justify-between bg-[var(--rw-surface-hover)]">
              <h2 className="text-xl font-bold text-[var(--rw-text)] font-oswald tracking-wide flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-[#023dbb]" />
                Support Tickets
              </h2>
            </div>
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-[var(--rw-text-muted)] text-sm font-medium">
                You haven't submitted any support requests.
              </div>
            ) : (
              <div className="divide-y divide-[var(--rw-border)] max-h-[350px] overflow-y-auto">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-5 hover:bg-[var(--rw-surface-hover)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-[var(--rw-text)]">{ticket.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {ticket.type}
                      </span>
                    </div>
                    <p className="text-[var(--rw-text-secondary)] font-medium text-xs whitespace-pre-wrap line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center text-[10px] text-[var(--rw-text-muted)] font-bold uppercase tracking-wider">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        username={username} 
      />
    </div>
  );
}

