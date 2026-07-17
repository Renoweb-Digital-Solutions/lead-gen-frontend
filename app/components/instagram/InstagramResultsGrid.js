"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, Copy, Check, Filter } from "lucide-react";

export default function InstagramResultsGrid({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("all");
  const [copiedText, setCopiedText] = useState(null);

  const itemsPerPage = 15;

  // Dynamically extract columns from the first data item
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Determine if there is a category field to filter by (e.g. 'type', 'category', 'source_type')
  const categoryField = useMemo(() => {
    if (!columns.length) return null;
    const possibleFields = ["category", "type", "source_type", "source"];
    return possibleFields.find(field => columns.includes(field)) || null;
  }, [columns]);

  const uniqueCategories = useMemo(() => {
    if (!categoryField || !data) return [];
    const categories = new Set(data.map(item => item[categoryField]).filter(Boolean));
    return Array.from(categories);
  }, [data, categoryField]);

  // Filter data based on category dropdown
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (filterCategory === "all" || !categoryField) return data;
    return data.filter(item => String(item[categoryField]).toLowerCase() === filterCategory.toLowerCase());
  }, [data, filterCategory, categoryField]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatHeader = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-gray-100 shrink-0 bg-gray-50/50">
        <div className="text-sm font-semibold text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + (filteredData.length > 0 ? 1 : 0)}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
        </div>
        
        {categoryField && uniqueCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category:</label>
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors cursor-pointer outline-none capitalize"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{String(cat).capitalize ? String(cat).capitalize() : cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dynamic Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredData.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {formatHeader(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {currentData.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-pink-50/30 transition-colors group"
                  >
                    {columns.map((col) => {
                      const val = row[col];
                      const isUrl = typeof val === 'string' && val.startsWith('http');
                      const isEmail = typeof val === 'string' && val.includes('@') && !val.includes(' ');
                      const isHashtags = col.toLowerCase().includes('hashtag');
                      const isUsername = col.toLowerCase() === 'username';
                      const displayVal = val === null || val === undefined ? "-" : String(val);
                      
                      return (
                        <td key={col} className={`p-4 text-sm text-gray-700 align-top ${isHashtags ? 'min-w-[250px]' : 'max-w-xs truncate'}`} title={isHashtags ? '' : displayVal}>
                          {isUsername && displayVal !== "-" ? (
                            <a href={`https://www.instagram.com/${val}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline font-semibold flex items-center gap-1">
                              @{displayVal}
                            </a>
                          ) : isUrl ? (
                            <a href={val} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline hover:text-pink-800 font-medium flex items-center gap-1">
                              {displayVal.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          ) : isEmail ? (
                            <div className="flex items-center gap-2">
                              <span>{displayVal}</span>
                              <button
                                onClick={() => handleCopy(val, `${idx}-${col}`)}
                                className="text-gray-400 hover:text-pink-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Copy"
                              >
                                {copiedText === `${idx}-${col}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          ) : isHashtags && displayVal !== "-" ? (
                            <div className="flex flex-wrap gap-1.5 pr-1">
                              {displayVal.split(',').map((tag, i) => tag.trim() ? (
                                <a 
                                  href={`https://www.instagram.com/explore/tags/${tag.trim()}/`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  key={i} 
                                  className="inline-block px-2 py-1 bg-pink-50 text-pink-700 hover:bg-pink-100 hover:text-pink-800 rounded-md text-[11px] font-medium border border-pink-100 transition-colors"
                                >
                                  #{tag.trim()}
                                </a>
                              ) : null)}
                            </div>
                          ) : (
                            displayVal
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
            <Camera className="w-12 h-12 mb-4 opacity-20" />
            <p>No valid data to display.</p>
          </div>
        )}
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
                        ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/20' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-pink-600 hover:bg-pink-50 active:bg-pink-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all border border-transparent hover:border-pink-100"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
