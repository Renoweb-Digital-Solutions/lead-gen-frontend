"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionState } from "../hooks/useSessionState";
import ThemeToggle from "../components/ThemeToggle";
import EmailStudio from "./EmailStudio";
import BehaviourDashboard from "./BehaviourDashboard";
import TicketManager from "./TicketManager";
import FeedbackInbox from "./FeedbackInbox";
import { fetchAdminUsersAndRuns, apiSuspendUser, apiUnsuspendUser } from "../lib/api";
import { LogOut, Users, Activity, CheckCircle, XCircle, AlertCircle, Calendar, ChevronDown, ChevronUp, MessageSquare, MessageCircleHeart, RefreshCw, BarChart3, Ban, Unlock, Mail } from "lucide-react";

function UserRow({ user, onSuspendClick, onUnsuspendClick, onEmailClick }) {
  const [expanded, setExpanded] = useState(false);
  const [runsPage, setRunsPage] = useState(1);
  const runs = user.runs || [];
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(runs.length / pageSize));
  const currentPage = Math.min(runsPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRuns = runs.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {user.username}
          {user.is_admin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-[var(--rw-deep-blue)]">Admin</span>}
          {user.email && user.email !== user.username && <div className="mt-1 text-xs font-normal text-gray-500">{user.email}</div>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.runs ? user.runs.length : 0} runs
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-3">
          <button onClick={() => onEmailClick(user)} disabled={!user.email} title={user.email ? `Email ${user.username}` : "No email address on this account"} className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-[#308fef] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"><Mail className="w-4 h-4" />Email</button>
          {user.is_suspended ? (
            <button
              onClick={() => onUnsuspendClick(user)}
              className="text-green-600 hover:text-green-800 flex items-center font-bold px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
            >
              <Unlock className="w-4 h-4 mr-1.5" />
              Unsuspend
            </button>
          ) : (
            <button
              onClick={() => onSuspendClick(user)}
              disabled={user.is_admin}
              className={`flex items-center font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                user.is_admin 
                  ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed opacity-50" 
                  : "text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50"
              }`}
              title={user.is_admin ? "Cannot suspend an admin" : "Suspend user account"}
            >
              <Ban className="w-4 h-4 mr-1.5" />
              Suspend
            </button>
          )}
          <button 
            onClick={() => {
              if (!expanded) setRunsPage(1);
              setExpanded(!expanded);
            }}
            aria-expanded={expanded}
            className="text-[#308fef] hover:text-[var(--rw-deep-blue)] flex items-center ml-2 px-2 py-1.5"
          >
            {expanded ? "Hide Details" : "View Runs"}
            {expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={3} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            {(!user.runs || user.runs.length === 0) ? (
              <p className="text-sm text-gray-500 italic py-2 text-center">No runs recorded for this user.</p>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--rw-surface)] divide-y divide-gray-200">
                    {visibleRuns.map((run, idx) => (
                      <tr key={run._id || idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium capitalize">
                          {(run.type || "unknown").replaceAll("_", " ")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {run.status === "success" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Success</span>}
                          {run.status === "empty" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Empty</span>}
                          {run.status === "failed" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Failed</span>}
                          {!["success", "empty", "failed"].includes(run.status) && <span title={run.status === "submitted" ? "Legacy record: submission was recorded; the final outcome was not tracked." : undefined} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-[var(--rw-deep-blue)] capitalize">{run.status === "submitted" ? "Submitted (legacy)" : run.status || "Unknown"}</span>}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-[var(--rw-surface)] px-4 py-3 text-sm text-gray-500">
                  <span aria-live="polite">
                    Showing {startIndex + 1}–{Math.min(startIndex + pageSize, runs.length)} of {runs.length} runs
                  </span>
                  {totalPages > 1 && (
                    <nav aria-label={`Run history pages for ${user.username}`} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRunsPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-[var(--rw-deep-blue)] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--rw-surface)]"
                      >
                        Previous
                      </button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <button
                        type="button"
                        onClick={() => setRunsPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-[var(--rw-deep-blue)] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--rw-surface)]"
                      >
                        Next
                      </button>
                    </nav>
                  )}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);
  const [activeTab, setActiveTab] = useState("users"); // # Users, tickets, analytics, and product feedback have separate views.
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isSuspending, setIsSuspending] = useState(false);
  const [emailStudio, setEmailStudio] = useState(null);
  const router = useRouter();

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const token = localStorage.getItem("renoweb_jwt");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        if (!decoded.is_admin) {
          router.push("/admin/login");
          return;
        }
      } catch (e) {
        router.push("/admin/login");
        return;
      }

      const [usersData, ticketsData] = await Promise.all([
        fetchAdminUsersAndRuns(),
        import("../lib/api").then(api => api.fetchAdminTickets())
      ]);
      
      setUsers(usersData.users || []);
      setError("");
      setTickets(ticketsData.tickets || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      if (err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("forbidden")) {
        localStorage.removeItem("renoweb_jwt");
        router.push("/admin/login");
      }
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadData(), 0);
    const refresh = () => {
      if (document.visibilityState === "visible") loadData(true);
    };
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem("renoweb_jwt");
    router.push("/admin/login");
  };

  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setSuspendReason("");
    setSuspendModalOpen(true);
  };

  const submitSuspend = async () => {
    if (!suspendReason.trim()) return;
    setIsSuspending(true);
    try {
      await apiSuspendUser(selectedUser._id, suspendReason);
      setSuspendModalOpen(false);
      loadData(true);
    } catch (err) {
      alert(err.message || "Failed to suspend user");
    } finally {
      setIsSuspending(false);
    }
  };

  const submitUnsuspend = async (user) => {
    if (!confirm(`Are you sure you want to unsuspend ${user.username}?`)) return;
    try {
      await apiUnsuspendUser(user._id);
      loadData(true);
    } catch (err) {
      alert(err.message || "Failed to unsuspend user");
    }
  };

  if (loading) {
    return (
      <div data-theme={isDark ? "dark" : "light"} style={{ colorScheme: isDark ? "dark" : "light" }} className="min-h-screen bg-[var(--rw-bg)] text-[var(--rw-text)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#023dbb] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading secure portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-theme={isDark ? "dark" : "light"} style={{ colorScheme: isDark ? "dark" : "light" }} className="min-h-screen bg-[var(--rw-bg)] text-[var(--rw-text)] flex flex-col md:flex-row transition-colors">
      {/* Sidebar */}
      <aside style={{ background: isDark ? "var(--rw-sidebar-bg)" : undefined }} className="w-full md:w-64 bg-[#1a56db] text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center justify-between md:block">
          <div className="flex items-center">
            <span className="text-white font-black text-2xl tracking-tighter">SIMPLE</span>
            <span className="text-[#308fef] font-black text-2xl tracking-tighter">ADS</span>
          </div>
          <span className="mt-1 md:inline-block hidden px-2 py-0.5 bg-white/20 rounded text-xs font-bold uppercase tracking-widest text-[#dbeafe]">
            Admin Panel
          </span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "users" ? "bg-[var(--rw-surface)] text-[var(--rw-deep-blue)] shadow-md" : "text-[#dbeafe] hover:bg-white/10"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users & Runs
          </button>
          
          <button
            onClick={() => setActiveTab("tickets")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "tickets" ? "bg-[var(--rw-surface)] text-[var(--rw-deep-blue)] shadow-md" : "text-[#dbeafe] hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Support Tickets
            {tickets.filter(t => !t.archived && t.status !== "closed").length > 0 && (
              <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'tickets' ? 'bg-red-100 text-red-600' : 'bg-red-500 text-white'}`}>
                {tickets.filter(t => !t.archived && t.status !== "closed").length}
              </span>
            )}
          </button>

          {/* # Emoji feedback has a dedicated private inbox, separate from support tickets. */}
          <button onClick={() => setActiveTab("feedback")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "feedback" ? "bg-[var(--rw-surface)] text-[var(--rw-deep-blue)] shadow-md" : "text-[#dbeafe] hover:bg-white/10"}`}>
            <MessageCircleHeart className="w-5 h-5 mr-3" />Feedback
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "analytics" ? "bg-[var(--rw-surface)] text-[var(--rw-deep-blue)] shadow-md" : "text-[#dbeafe] hover:bg-white/10"
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-oswald tracking-wide flex items-center">
              {activeTab === "users" ? (
                <><Activity className="w-7 h-7 mr-3 text-[#308fef]" /> Platform Activity</>
              ) : activeTab === "feedback" ? (
                <><MessageCircleHeart className="w-7 h-7 mr-3 text-[#308fef]" /> Customer Feedback</>
              ) : activeTab === "analytics" ? (
                <><BarChart3 className="w-7 h-7 mr-3 text-[#308fef]" /> User Behaviour</>
              ) : (
                <><MessageSquare className="w-7 h-7 mr-3 text-[#308fef]" /> Support Tickets</>
              )}
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {activeTab === "users" 
                ? "Monitor user accounts and their lead generation runs across all tools."
                : activeTab === "feedback"
                ? "See how users feel about Simpleads and what they would like us to improve."
                : activeTab === "analytics"
                ? "Understand which modules customers use and the choices they make."
                : "Review and manage user feedback and error reports."
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setEmailStudio({})} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#023dbb] to-[#308fef] text-white rounded-lg shadow-sm text-sm font-medium hover:brightness-110 transition-all"><Mail className="w-4 h-4" />Email studio</button>
            <ThemeToggle isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-4 py-2 bg-[var(--rw-surface)] border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--rw-deep-blue)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#308fef] disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* # Feedback loading and errors stay independent of user/run and support requests. */}
        {activeTab === "feedback" ? <FeedbackInbox refreshKey={refreshing} /> : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 font-medium">
            {error}
          </div>
        ) : (
          <div className="bg-[var(--rw-surface)] shadow rounded-xl overflow-hidden border border-gray-100">
            {activeTab === "users" && (
              <>
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    Registered Users
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--rw-surface-hover)] text-[var(--rw-deep-blue)]">
                    {users.length} Total Users
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[var(--rw-surface)]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          User / Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Total Runs
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--rw-surface)] divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-gray-500 font-medium">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <UserRow 
                            onEmailClick={(user) => setEmailStudio({ user })}
                            key={user._id} 
                            user={user} 
                            onSuspendClick={handleSuspendClick}
                            onUnsuspendClick={submitUnsuspend}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* # Ticket lifecycle controls preserve the independent customer and archive views. */}
            {activeTab === "tickets" && <TicketManager
              tickets={tickets}
              users={users}
              isDark={isDark}
              onTicketUpdated={updated => setTickets(previous => previous.map(ticket => ticket.id === updated.id ? updated : ticket))}
              onFeedback={user => setEmailStudio({ type: "feedback", user })}
              onRefresh={() => loadData(true)}
            />}

            {/* # Behaviour reports own their loading/errors and cannot block user administration. */}
            {activeTab === "analytics" && <BehaviourDashboard refreshKey={refreshing} />}

          </div>
        )}
      </main>

      {/* Suspend Modal */}
      {emailStudio && <EmailStudio users={users} initialUser={emailStudio.user} initialType={emailStudio.type || "feedback"} onClose={() => setEmailStudio(null)} onDelivered={() => loadData(true)} />}
      {suspendModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--rw-surface)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-500" />
                Suspend {selectedUser.username}
              </h2>
              <button 
                onClick={() => setSuspendModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSuspending}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for suspending this user. They will receive an email notification with this reason.
              </p>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g. Violation of terms of service..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--rw-surface)] border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none h-32 text-sm text-gray-900"
                disabled={isSuspending}
              />
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSuspendModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                disabled={isSuspending}
              >
                Cancel
              </button>
              <button
                onClick={submitSuspend}
                disabled={!suspendReason.trim() || isSuspending}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isSuspending ? "Suspending..." : "Suspend User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
