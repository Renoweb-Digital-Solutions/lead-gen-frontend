"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, MessageSquare, AlertCircle, CheckCircle, Search, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { submitSupportTicket, suggestFaqs } from "../lib/api";

export default function SupportTicketModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("feedback");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const activeQuery = step === 1 ? searchQuery : title;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (activeQuery.length > 4) {
        setIsSearching(true);
        try {
          const res = await suggestFaqs(activeQuery);
          setFaqs(res.faqs || []);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFaqs([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeQuery]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let rawPath = typeof window !== 'undefined' ? window.location.pathname : 'Unknown';
      
      const pageNames = {
        "/": "Home",
        "/dashboard": "Main Dashboard",
        "/youtube": "YouTube Pipeline",
        "/gmaps": "Google Maps Pipeline",
        "/b2b": "B2B Leads Pipeline",
        "/instagram": "Instagram Pipeline",
        "/profile": "User Profile",
        "/admin": "Admin Panel",
        "/admin/login": "Admin Login",
      };

      let sourcePage = pageNames[rawPath] || rawPath;
      if (!pageNames[rawPath] && rawPath.startsWith("/jobs/")) {
         sourcePage = "Job Details Page";
      }

      await submitSupportTicket(title, type, description, sourcePage);
      setSuccess(true);
      // Automatically close after a short delay
      setTimeout(() => {
        setSuccess(false);
        setTitle("");
        setDescription("");
        setType("feedback");
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setSuccess(false);
      setStep(1);
      setSearchQuery("");
      setFaqs([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#023dbb]/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#023dbb]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-oswald tracking-wide">Contact Support</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h4>
                <p className="text-gray-500 font-medium">
                  We've received your request and our team will look into it immediately.
                </p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-[13px] font-bold text-[#191919] uppercase tracking-wide">
                      How can we help you?
                    </label>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#308fef]">
                      <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin text-[#4ec8ef]' : 'animate-pulse'}`} />
                      <span className={`${isSearching ? 'animate-pulse text-[#4ec8ef]' : ''}`}>AI Assisted</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       {isSearching ? <Loader2 className="h-5 w-5 text-gray-400 animate-spin" /> : <Search className="h-5 w-5 text-gray-400" />}
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="Describe your issue or question..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {faqs.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Answers</h4>
                    {faqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <button
                          type="button"
                          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left font-bold text-gray-800 text-[13px]"
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        >
                          {faq.question}
                          {expandedFaq === faq.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </button>
                        <AnimatePresence>
                          {expandedFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 py-3 text-sm text-gray-600 bg-white border-t border-gray-100 leading-relaxed font-medium"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">Still need help?</span>
                  <button
                    type="button"
                    onClick={() => {
                       setDescription(searchQuery);
                       setStep(2);
                    }}
                    className="text-sm font-bold text-[#023dbb] hover:text-[#308fef] transition-colors"
                  >
                    Contact Support Team &rarr;
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="flex items-center justify-between mb-2">
                   <button type="button" onClick={() => setStep(1)} className="text-[13px] font-bold text-gray-500 hover:text-gray-800 transition-colors">
                     &larr; Back to Search
                   </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block text-[13px] font-bold text-[#191919] uppercase tracking-wide">
                        Title
                      </label>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#308fef]">
                        <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin text-[#4ec8ef]' : 'animate-pulse'}`} />
                        <span className={`${isSearching ? 'animate-pulse text-[#4ec8ef]' : ''}`}>AI Assisted</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={150}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919]"
                      placeholder="Brief summary of your issue or idea"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {faqs.length > 0 && (
                    <div className="col-span-2 space-y-2 mb-2">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Answers</h4>
                      {faqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                          <button
                            type="button"
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left font-bold text-gray-800 text-[13px]"
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          >
                            {faq.question}
                            {expandedFaq === faq.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </button>
                          <AnimatePresence>
                            {expandedFaq === faq.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 py-3 text-sm text-gray-600 bg-white border-t border-gray-100 leading-relaxed font-medium"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[13px] font-bold text-[#191919] mb-1.5 uppercase tracking-wide">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919] appearance-none"
                      >
                        <option value="feedback">Feedback / Suggestion</option>
                        <option value="error">Report an Error</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#191919] mb-1.5 uppercase tracking-wide">
                    Detailed Description
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all font-medium text-[#191919] resize-none"
                    placeholder="Please provide as much detail as possible..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#023dbb] hover:bg-[#308fef] text-white rounded-xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
