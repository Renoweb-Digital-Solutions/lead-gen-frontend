"use client";

import { motion } from "framer-motion";
import { Users, Building2, Briefcase, Zap, Rocket, Check, Target, Map, Trash2, LogOut, X, Activity, Menu, Camera } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { STEPS } from "../lib/constants";
import { useSessionState } from "../hooks/useSessionState";

const ICON_MAP = {
  Users: Users,
  Building2: Building2,
  Briefcase: Briefcase,
  Zap: Zap,
  Rocket: Rocket,
};

export default function Sidebar({ 
  activeStep, 
  onStepChange, 
  completedSteps = {}, 
  isOpen, 
  onClose,
  activeModule,
  onModuleChange,
  onClearAll,
  isMobileOnly
}) {
  const { logout, token } = useAuth();
  const router = useRouter();
  const [isDark] = useSessionState("renoweb-theme-dark", false);

  let userEmail = "admin@renoweb.com";
  let userName = "Noah Smith";
  
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      
      userEmail = payload.email || payload.sub || userEmail;
      
      if (payload.name) {
        userName = payload.name;
      } else if (payload.username) {
        userName = payload.username;
      } else {
        const namePart = userEmail.split('@')[0];
        userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    } catch (e) {
      console.error("Failed to parse JWT", e);
    }
  }

  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "U";
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <nav className={`rw-sidebar relative ${isOpen ? "open" : ""} ${isMobileOnly ? "lg:!hidden" : ""}`}>
      {/* Glass shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--rw-sidebar-shimmer)" }}
      />

      <div className="rw-sidebar-steps px-6 pt-4 pb-8 flex flex-col relative z-10">
        {/* Mobile Header (Logo + Close Button) */}
        <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div
            className="flex items-center gap-1 font-[800] text-[20px] tracking-[-0.02em] cursor-pointer"
            onClick={() => { router.push('/dashboard'); onClose?.(); }}
          >
            <span style={{ color: "var(--rw-deep-blue)" }}>RENO</span>
            <span style={{ color: "var(--rw-bright-blue)" }}>WEB</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-[var(--rw-border)] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Top Navigation */}
        <div className="lg:hidden flex flex-col gap-1 mb-6 pb-6 border-b border-border">
          <button 
             onClick={() => { onModuleChange?.('leadgen'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'leadgen' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Target className="w-5 h-5" />
             <span className="text-[14px]">Lead Gen Pipeline</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('gmaps'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'gmaps' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Map className="w-5 h-5" />
             <span className="text-[14px]">Google Maps</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('youtube'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'youtube' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Activity className="w-5 h-5" />
             <span className="text-[14px]">YouTube Scraper</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('instagram'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'instagram' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Camera className="w-5 h-5" />
             <span className="text-[14px]">Instagram Scraper</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('b2b'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'b2b' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Menu className="w-5 h-5" />
             <span className="text-[14px]">B2B Scraper</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('investors'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'investors' ? 'bg-[var(--rw-surface-hover)] text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-[var(--rw-surface-hover)] font-medium'}`}
          >
             <Activity className="w-5 h-5" />
             <span className="text-[14px]">Investor Pipeline</span>
          </button>
          
          <div className="h-px w-full bg-gray-200/60 my-2" />
          
          <button 
             onClick={() => { onClearAll?.(); onClose?.(); }}
             className="flex items-center gap-3 p-3 rounded-xl transition-colors text-red-500 hover:bg-red-50 font-medium"
          >
             <Trash2 className="w-5 h-5" />
             <span className="text-[14px]">Clear Data</span>
          </button>
        </div>

        {/* Steps for Lead Gen */}
        {activeModule === 'leadgen' && STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps[step.id] || index < activeStep; // Auto-complete previous steps
          const Icon = ICON_MAP[step.iconName];

          return (
            <div key={step.id} className="relative flex">
              {/* Connecting Line (except last) */}
              {index < STEPS.length - 1 && (
                <div className={`absolute left-6 top-10 w-[2px] h-full -ml-px rounded-full ${isDark ? "bg-[#334155]" : "bg-brand-blue/10"}`}>
                  {/* Filled portion of the line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => onStepChange(index)}
                className={`group relative flex items-start gap-4 py-3 w-full text-left transition-all duration-300 ${isActive ? "scale-105 origin-left" : ""}`}
              >
                {/* Step Icon/Indicator */}
                <div 
                  className={`
                    relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 z-10
                    ${isActive 
                      ? isDark ? "bg-[#3B82F6] text-[#FFFFFF] shadow-[0_0_20px_rgba(48,143,239,0.3)]" : "bg-gradient-to-br from-brand-blue via-brand-sky to-brand-cyan text-white shadow-[0_0_20px_rgba(48,143,239,0.3)]"
                      : isCompleted 
                        ? isDark ? "bg-[#3B82F6] text-[#FFFFFF] shadow-md" : "bg-brand-cyan text-white shadow-md"
                        : isDark ? "bg-[#1E293B] border border-[#334155] text-[#94A3B8]" : "bg-surface border-2 border-border text-brand-blue/40 group-hover:border-brand-blue/30 group-hover:text-brand-blue/60"
                    }
                  `}
                >
                  {isCompleted && !isActive ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </div>

                {/* Step Text */}
                <div className="flex flex-col pt-1.5">
                  <span 
                    className={`text-[15px] font-bold tracking-wide transition-colors duration-200 ${
                      isActive ? (isDark ? "text-[#60A5FA]" : "text-brand-blue") : isCompleted ? (isDark ? "text-[#FFFFFF]" : "text-brand-dark") : (isDark ? "text-[#E2E8F0]" : "text-gray-400 group-hover:text-gray-600")
                    }`}
                  >
                    {step.label}
                  </span>
                  <span 
                    className={`text-[12px] mt-0.5 transition-colors duration-200 ${
                      isActive ? (isDark ? "text-[#93C5FD] font-medium" : "text-brand-sky font-medium") : isCompleted ? (isDark ? "text-[#94A3B8]" : "text-gray-400/60") : (isDark ? "text-[#64748B]" : "text-gray-400/60")
                    }`}
                  >
                    {step.description.charAt(0).toUpperCase() + step.description.slice(1).toLowerCase()}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer branding */}
      <div className="rw-sidebar-footer relative z-10 mt-auto pt-6 pb-2">
        <div className="flex items-center gap-3 mb-5 p-2.5 rounded-xl border border-transparent hover:border-[var(--rw-border)] hover:bg-[var(--rw-surface-hover)] transition-all cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-white flex items-center justify-center font-bold text-[14px] shadow-sm shrink-0">
            {avatarLetter}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[var(--rw-text)] truncate leading-tight">{userName}</span>
            <span className="text-[11px] text-[var(--rw-text-muted)] truncate mt-0.5">{userEmail}</span>
          </div>
        </div>
        <div className="text-[10px] text-brand-sky font-bold tracking-[0.1em] uppercase px-2.5">
          Renoweb Digital Solutions
          <br />
          <span className="text-[var(--rw-text-muted)] font-medium tracking-normal">Lead Gen Pipeline</span>
        </div>
      </div>
    </nav>
    </>
  );
}
