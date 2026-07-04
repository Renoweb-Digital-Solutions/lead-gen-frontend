"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Star, Navigation } from "lucide-react";

// Helper components for the three states

const PopularSearchPill = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-white border border-brand-blue/10 rounded-full text-[13px] font-medium text-brand-dark hover:border-brand-sky hover:text-brand-blue hover:shadow-sm transition-all duration-200 flex items-center gap-2"
  >
    <Navigation className="w-3.5 h-3.5 text-brand-sky" />
    {label}
  </button>
);

const EmptyState = ({ setKeywords, setLocation, onSearch }) => {
  const handleQuickSearch = (keywords, location) => {
    setKeywords(keywords);
    setLocation(location);
    // Slight delay to allow state to update before triggering search
    setTimeout(onSearch, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Animated radiating rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 2], opacity: [0.3, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-24 h-24 bg-brand-sky rounded-full blur-xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1.6], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute w-24 h-24 bg-brand-cyan rounded-full blur-lg"
        />
        
        {/* Geometric Map Pin */}
        <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(48,143,239,0.4)]">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-brand-amber rounded-full" />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 border-[10px] border-transparent border-t-brand-cyan w-0 h-0" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-brand-dark mb-2">Ready to find local businesses</h3>
      <p className="text-[14px] text-gray-500 mb-8 max-w-md text-center">
        Enter a keyword and location above to start discovering leads, or try one of these popular searches.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
        <PopularSearchPill label="Dentists in London" onClick={() => handleQuickSearch(["dentist"], "London, UK")} />
        <PopularSearchPill label="Restaurants in Manchester" onClick={() => handleQuickSearch(["restaurant"], "Manchester, UK")} />
        <PopularSearchPill label="Plumbers in Chicago" onClick={() => handleQuickSearch(["plumber"], "Chicago, IL")} />
        <PopularSearchPill label="Coffee Shops in Seattle" onClick={() => handleQuickSearch(["coffee shop", "cafe"], "Seattle, WA")} />
      </div>
    </div>
  );
};

const ShimmerSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="relative overflow-hidden bg-white border border-brand-blue/5 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-50 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3 mt-4 pt-4 border-t border-gray-50">
          <div className="h-3 bg-gray-50 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-gray-50 rounded w-2/3 animate-pulse" />
        </div>
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/[0.03] to-transparent bg-[length:200%_100%] animate-[rw-shimmer_1.5s_infinite_linear]"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      </div>
    ))}
  </div>
);

const ResultCard = ({ result }) => {
  const name = result.title || result.name || "Unknown Business";
  const category = result.category || result.type || "Local Business";
  const address = result.address || result.formatted_address || "No address provided";
  const phone = result.phone || result.phone_number || "No phone";
  const rating = result.rating ? Number(result.rating) : null;
  const reviews = result.reviews || result.user_ratings_total || 0;
  
  // Extract first letter for avatar
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-brand-blue/10 rounded-2xl p-5 shadow-[0_2px_8px_rgba(2,61,187,0.04)] hover:shadow-[0_8px_24px_rgba(2,61,187,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-sky/10 to-brand-cyan/10 text-brand-blue font-bold flex items-center justify-center shrink-0 border border-brand-blue/10 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-bold text-brand-dark truncate mb-1" title={name}>{name}</h4>
          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-md truncate max-w-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-2.5 mt-2 pt-4 border-t border-gray-50 text-[13px]">
        <div className="flex items-start gap-2.5 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{address}</span>
        </div>
        
        {phone !== "No phone" && (
          <div className="flex items-center gap-2.5 text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </div>

      {(rating || reviews > 0) && (
        <div className="mt-4 pt-4 flex items-center gap-1.5 border-t border-gray-50">
          <Star className="w-4 h-4 text-brand-amber fill-brand-amber" />
          <span className="text-[13px] font-bold text-brand-dark">{rating || "N/A"}</span>
          <span className="text-[12px] text-gray-400 ml-1">({reviews} reviews)</span>
        </div>
      )}
    </div>
  );
};


export default function ResultsPreviewZone({
  isSearching,
  results,
  setKeywords,
  setLocation,
  onSearch
}) {
  if (isSearching) {
    return <ShimmerSkeletonGrid />;
  }

  if (!results || results.length === 0) {
    return (
      <EmptyState 
        setKeywords={setKeywords} 
        setLocation={setLocation} 
        onSearch={onSearch} 
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-6 pb-24" /* pb-24 leaves room for sticky export bar */
    >
      {results.map((result, index) => (
        <motion.div
          key={result.place_id || result.id || index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <ResultCard result={result} />
        </motion.div>
      ))}
    </motion.div>
  );
}
