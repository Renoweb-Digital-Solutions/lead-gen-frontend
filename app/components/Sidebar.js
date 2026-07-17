"use client";

import { motion } from "framer-motion";
import { Users, Building2, Briefcase, Zap, Rocket, Check, Target, Map, Trash2, LogOut, X, Activity, Menu, Camera } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { STEPS } from "../lib/constants";

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
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <nav className={`rw-sidebar relative ${isOpen ? "open" : ""}`}>
      {/* Glass shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(255, 255, 255, 0.2) 100%)",
        }}
      />

      <div className="rw-sidebar-steps px-6 pt-4 pb-8 flex flex-col relative z-10">
        {/* Mobile Header (Logo + Close Button) */}
        <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
          <div
            className="flex items-center gap-1 font-[800] text-[20px] tracking-[-0.02em] cursor-pointer"
            onClick={() => { router.push('/'); onClose?.(); }}
          >
            <span style={{ color: "var(--rw-deep-blue)" }}>RENO</span>
            <span style={{ color: "var(--rw-bright-blue)" }}>WEB</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Top Navigation */}
        <div className="md:hidden flex flex-col gap-1 mb-6 pb-6 border-b border-gray-200">
          <button 
             onClick={() => { onModuleChange?.('leadgen'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'leadgen' ? 'bg-blue-50 text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}
          >
             <Target className="w-5 h-5" />
             <span className="text-[14px]">Lead Gen Pipeline</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('gmaps'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'gmaps' ? 'bg-blue-50 text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}
          >
             <Map className="w-5 h-5" />
             <span className="text-[14px]">Google Maps</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('youtube'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'youtube' ? 'bg-blue-50 text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}
          >
             <Activity className="w-5 h-5" />
             <span className="text-[14px]">YouTube Scraper</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('instagram'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'instagram' ? 'bg-blue-50 text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}
          >
             <Camera className="w-5 h-5" />
             <span className="text-[14px]">Instagram Scraper</span>
          </button>
          <button 
             onClick={() => { onModuleChange?.('b2b'); onClose?.(); }}
             className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeModule === 'b2b' ? 'bg-blue-50 text-brand-blue font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}
          >
             <Menu className="w-5 h-5" />
             <span className="text-[14px]">B2B Scraper</span>
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
                <div className="absolute left-6 top-10 w-[2px] h-full -ml-px bg-brand-blue/10 rounded-full">
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
                      ? "bg-gradient-to-br from-brand-blue via-brand-sky to-brand-cyan text-white shadow-[0_0_20px_rgba(48,143,239,0.3)]" 
                      : isCompleted 
                        ? "bg-brand-cyan text-white shadow-md"
                        : "bg-white border-2 border-brand-blue/10 text-brand-blue/40 group-hover:border-brand-blue/30 group-hover:text-brand-blue/60"
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
                      isActive ? "text-brand-blue" : isCompleted ? "text-brand-dark" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span 
                    className={`text-[12px] mt-0.5 transition-colors duration-200 ${
                      isActive ? "text-brand-sky font-medium" : "text-gray-400/60"
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
        <div className="flex items-center gap-3 mb-5 p-2.5 rounded-xl border border-transparent hover:border-brand-blue/10 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-white flex items-center justify-center font-bold text-[14px] shadow-[0_2px_10px_rgba(2,61,187,0.2)] shrink-0">
            {avatarLetter}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-brand-dark truncate leading-tight">{userName}</span>
            <span className="text-[11px] text-gray-500 truncate mt-0.5">{userEmail}</span>
          </div>
        </div>
        <div className="text-[10px] text-brand-blue/50 font-bold tracking-[0.1em] uppercase px-2.5">
          Renoweb Digital Solutions
          <br />
          <span className="text-gray-400 font-medium tracking-normal">Lead Gen Pipeline</span>
        </div>
      </div>
    </nav>
    </>
  );
}
