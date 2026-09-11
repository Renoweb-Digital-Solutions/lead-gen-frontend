"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyTickets } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import Header from "../components/Header";
import { User, MessageSquare, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function ProfilePage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, isInitializing } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState("");

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

    async function loadTickets() {
      try {
        const data = await fetchMyTickets();
        setTickets(data.tickets || []);
      } catch (err) {
        setError(err.message || "Failed to load your tickets.");
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [token, isInitializing, router]);

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#023dbb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#023dbb] to-[#308fef] rounded-full flex items-center justify-center text-white shadow-inner">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-oswald tracking-wide">
              Welcome, {username}
            </h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              Active Account
            </p>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 font-oswald tracking-wide flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-[#023dbb]" />
              Support Tickets
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f0f7ff] text-[#023dbb]">
              {tickets.length} Total
            </span>
          </div>

          {error ? (
            <div className="p-6">
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Tickets Found</h3>
              <p className="text-gray-500 font-medium max-w-sm">
                You haven't submitted any support requests or feedback yet. Use the floating button on the bottom right if you need help!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${ticket.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {ticket.type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-yellow-100 text-yellow-800">
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium text-sm whitespace-pre-wrap mb-4">
                    {ticket.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Submitted on {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}
