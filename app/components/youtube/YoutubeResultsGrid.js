"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Link as LinkIcon, ChevronLeft, ChevronRight, List, Copy, Check, Video, Eye, MapPin } from "lucide-react";

export default function YoutubeResultsGrid({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("subscribers_desc");
  const [copiedId, setCopiedId] = useState(null);

  const itemsPerPage = 15; // 3 columns x 5 rows

  // New helpers matching the exact JSON structure provided
  const getSubscribers = (row) => Number(row.subscribers || 0);
  const getTitle = (row) => row.channel_name || "Unknown Channel";
  const getEmail = (row) => row.email || "";
  const getUrl = (row) => row.channel_url || "";
  const getBio = (row) => row.brief_bio || "";
  const getNiche = (row) => row.niche || "";
  const getTotalVideos = (row) => Number(row.total_videos || 0);
  const getTotalViews = (row) => Number(row.total_views || 0);
  const getLocation = (row) => row.location || "";

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (sortBy === "subscribers_desc") return getSubscribers(b) - getSubscribers(a);
      if (sortBy === "subscribers_asc") return getSubscribers(a) - getSubscribers(b);
      return 0;
    });
  }, [data, sortBy]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedId(email);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-b border-gray-100 shrink-0">
        <div className="text-sm font-semibold text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + (sortedData.length > 0 ? 1 : 0)}-{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} channels
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort by:</label>
          <select 
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky transition-colors cursor-pointer outline-none"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to page 1 on sort change
            }}
          >
            <option value="subscribers_desc">Subscribers (High to Low)</option>
            <option value="subscribers_asc">Subscribers (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-var(--rw-bg, #f5f7fb)">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentData.map((channel, idx) => (
              <motion.div
                key={channel.channel_url || channel.channel_name || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_24px_rgba(2,61,187,0.08)] hover:border-brand-sky/40 transition-all overflow-hidden flex flex-col"
              >
                {/* Card Header (No Logo) */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight flex-1" title={getTitle(channel)}>
                      {getUrl(channel) ? (
                        <a href={getUrl(channel)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue hover:underline transition-colors">
                          {getTitle(channel)}
                        </a>
                      ) : (
                        getTitle(channel)
                      )}
                    </h3>
                    {getLocation(channel) && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md shrink-0" title={getLocation(channel)}>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{getLocation(channel)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed" title={getBio(channel)}>
                    {getBio(channel) || "No bio available."}
                  </p>
                </div>

                {/* Card Stats */}
                <div className="grid grid-cols-2 gap-px bg-gray-100/50 border-y border-gray-100/50">
                  <div className="p-3 text-center flex flex-col items-center justify-center gap-1 bg-white">
                    <div className="bg-brand-blue/5 p-1.5 rounded-full mb-0.5"><Users className="w-3.5 h-3.5 text-brand-blue" /></div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Subscribers</span>
                    <span className="text-sm font-bold text-gray-800">{formatNumber(getSubscribers(channel))}</span>
                  </div>
                  <div className="p-3 text-center flex flex-col items-center justify-center gap-1 bg-white">
                    <div className="bg-brand-cyan/5 p-1.5 rounded-full mb-0.5"><List className="w-3.5 h-3.5 text-brand-cyan" /></div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Niche</span>
                    <span className="text-sm font-bold text-gray-800 capitalize truncate w-full px-2" title={getNiche(channel)}>{getNiche(channel) || "N/A"}</span>
                  </div>
                  <div className="p-3 text-center flex flex-col items-center justify-center gap-1 bg-white">
                    <div className="bg-emerald-500/5 p-1.5 rounded-full mb-0.5"><Video className="w-3.5 h-3.5 text-emerald-500" /></div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Videos</span>
                    <span className="text-sm font-bold text-gray-800">{formatNumber(getTotalVideos(channel))}</span>
                  </div>
                  <div className="p-3 text-center flex flex-col items-center justify-center gap-1 bg-white">
                    <div className="bg-purple-500/5 p-1.5 rounded-full mb-0.5"><Eye className="w-3.5 h-3.5 text-purple-500" /></div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Views</span>
                    <span className="text-sm font-bold text-gray-800">{formatNumber(getTotalViews(channel))}</span>
                  </div>
                </div>

                {/* Card Footer (Contact/Links) */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    {(() => {
                      const email = getEmail(channel);
                      if (email) {
                        const isCopied = copiedId === email;
                        return (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-sky/10 text-brand-dark text-xs font-semibold border border-brand-sky/20 truncate max-w-full">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
                            <span className="truncate">{email}</span>
                            <button
                              onClick={() => handleCopyEmail(email)}
                              className={`ml-1 p-1 rounded-md transition-colors ${isCopied ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-brand-blue hover:bg-brand-blue/10 hover:text-brand-dark'}`}
                              title="Copy email"
                            >
                              {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-xs font-medium border border-gray-100">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>No Email</span>
                        </div>
                      );
                    })()}
                    
                    {getUrl(channel) && (
                      <a 
                        href={getUrl(channel)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors cursor-pointer shrink-0" 
                        title="Open Channel"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {sortedData.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p>No valid channel data to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all border border-transparent hover:border-gray-200"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          
          <div className="flex items-center gap-1 hidden sm:flex">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                      currentPage === pageNum 
                        ? 'bg-gradient-to-br from-brand-blue to-brand-cyan text-white shadow-md shadow-brand-blue/20' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 || 
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="text-gray-300 px-2 font-bold">...</span>;
              }
              return null;
            })}
          </div>
          
          <div className="sm:hidden text-sm font-bold text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-brand-blue hover:bg-brand-blue/5 active:bg-brand-blue/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all border border-transparent hover:border-brand-blue/10"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
