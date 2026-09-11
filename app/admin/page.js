"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminUsersAndRuns } from "../lib/api";
import { LogOut, Users, Activity, CheckCircle, XCircle, AlertCircle, Calendar, ChevronDown, ChevronUp, MessageSquare, RefreshCw } from "lucide-react";

function UserRow({ user }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {user.username}
          {user.is_admin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Admin</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.runs ? user.runs.length : 0} runs
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[#308fef] hover:text-[#023dbb] flex items-center ml-auto"
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.runs.map((run, idx) => (
                      <tr key={run._id || idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium capitalize">
                          {run.type || "gmaps"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {run.status === "success" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Success</span>}
                          {run.status === "empty" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Empty</span>}
                          {run.status === "failed" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Failed</span>}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "tickets"
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async (isRefresh = false) => {
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
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("renoweb_jwt");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#023dbb] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading secure portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1a56db] text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center justify-between md:block">
          <div className="flex items-center">
            <span className="text-white font-black text-2xl tracking-tighter">SIMPLE</span>
            <span className="text-[#308fef] font-black text-2xl tracking-tighter">ADS</span>
          </div>
          <span className="mt-1 md:inline-block hidden px-2 py-0.5 bg-white/20 rounded text-xs font-bold uppercase tracking-widest text-blue-100">
            Admin Panel
          </span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "users" ? "bg-white text-[#023dbb] shadow-md" : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users & Runs
          </button>
          
          <button
            onClick={() => setActiveTab("tickets")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "tickets" ? "bg-white text-[#023dbb] shadow-md" : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Support Tickets
            {tickets.filter(t => t.status === "open").length > 0 && (
              <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'tickets' ? 'bg-red-100 text-red-600' : 'bg-red-500 text-white'}`}>
                {tickets.filter(t => t.status === "open").length}
              </span>
            )}
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
              ) : (
                <><MessageSquare className="w-7 h-7 mr-3 text-[#308fef]" /> Support Tickets</>
              )}
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {activeTab === "users" 
                ? "Monitor user accounts and their lead generation runs across all tools."
                : "Review and manage user feedback and error reports."
              }
            </p>
          </div>
          
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#023dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#308fef] disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 font-medium">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
            {activeTab === "users" && (
              <>
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    Registered Users
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f0f7ff] text-[#023dbb]">
                    {users.length} Total Users
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
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
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-gray-500 font-medium">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => <UserRow key={user._id} user={user} />)
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "tickets" && (
              <div className="divide-y divide-gray-200">
                {tickets.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 font-medium">
                    No support tickets received yet.
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{ticket.title}</h3>
                          <p className="text-sm text-gray-500 font-medium">
                            From: <span className="text-gray-900">{ticket.username}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${ticket.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {ticket.type}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700 font-medium text-sm whitespace-pre-wrap">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(ticket.created_at).toLocaleString()}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 uppercase tracking-widest font-bold">
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
