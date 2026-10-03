"use client";

import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { X, Download, ChevronUp, Database } from "lucide-react";
import ResultsTable from "../ResultsTable";
import { EXPORT_FORMATS } from "../../lib/constants";

export default function ExportBottomSheet({ 
  isOpen, 
  onOpen, 
  onClose, 
  data, 
  exportResultFile, 
  formState, 
  onDownload 
}) {
  const SHEET_HEIGHT_VH = 85; 
  const [sheetHeightPx, setSheetHeightPx] = useState(800);

  useEffect(() => {
    setSheetHeightPx((window.innerHeight * SHEET_HEIGHT_VH) / 100);
  }, []);

  const closedY = sheetHeightPx * 0.90; // 10% visible

  const [{ y }, api] = useSpring(() => ({ 
    y: closedY,
    config: { tension: 280, friction: 32 } 
  }));

  const [{ opacity }, backdropApi] = useSpring(() => ({
    opacity: 0,
    config: { tension: 250, friction: 25 }
  }));

  useEffect(() => {
    if (isOpen) {
      api.start({ y: 0 });
      backdropApi.start({ opacity: 1 });
      document.body.style.overflow = 'hidden'; 
    } else {
      api.start({ y: closedY });
      backdropApi.start({ opacity: 0 });
      document.body.style.overflow = '';
    }
  }, [isOpen, api, backdropApi, closedY]);

  const bind = useDrag(({ active, offset: [, oy], velocity: [, vy], direction: [, dy], cancel }) => {
    if (oy < 0) {
      cancel();
      oy = 0;
    }
    if (active) {
      api.start({ y: oy, immediate: true });
    } else {
      const shouldClose = oy > sheetHeightPx * 0.3 || (vy > 0.5 && dy > 0);
      if (shouldClose) {
        onClose(); 
      } else {
        if (onOpen) onOpen();
        api.start({ y: 0, immediate: false });
      }
    }
  }, {
    from: () => [0, y.get()],
    bounds: { top: 0 },
    rubberband: true
  });

  const formatLabel = EXPORT_FORMATS.find((f) => f.id === formState.exportFormat)?.label || "Data";

  return (
    <>
      {/* Backdrop */}
      <animated.div
        style={{ opacity, pointerEvents: isOpen ? "auto" : "none" }}
        className="fixed inset-0 z-[100] bg-[#023dbb]/15 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <animated.div
        style={{ y, height: `${SHEET_HEIGHT_VH}vh` }}
        className="fixed bottom-0 left-0 right-0 z-[110] bg-[var(--rw-surface)] rounded-t-[32px] border-t border-[var(--rw-border)] shadow-[0_-15px_40px_rgba(48,143,239,0.15)] flex flex-col will-change-transform"
      >
        <div 
          {...bind()} 
          onClick={() => { if (!isOpen && onOpen) onOpen(); }}
          className="relative w-full pt-3 pb-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none group hover:bg-brand-sky/[0.02] transition-colors rounded-t-[32px]"
        >
          <div className="flex items-center justify-center w-16 h-1.5 rounded-full bg-gray-400/50 group-hover:bg-brand-sky/60 transition-colors mb-2" />
          
          {/* Subtle animated arrows visible mainly when closed */}
          {!isOpen && (
            <div className="flex flex-col items-center -mt-1 mb-1 animate-bounce">
              <ChevronUp className="w-5 h-5 text-brand-sky opacity-100" />
              <ChevronUp className="w-5 h-5 text-brand-sky opacity-50 -mt-3" />
            </div>
          )}

          {!isOpen && (
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-sky/80 group-hover:text-brand-sky transition-colors">
              Pull to view preview
            </div>
          )}
        </div>

        {/* Header */}
        <div className="px-8 pb-4 border-b border-brand-blue/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-dark leading-tight">
              {formState.exportFormat === "bundle" ? "Bundle Export Ready" : `Preview: ${formatLabel}`}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {exportResultFile && (
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-sky text-white rounded-xl font-bold text-[13px] hover:shadow-lg hover:shadow-brand-sky/20 transition-all duration-300"
                onClick={onDownload}
              >
                <Download className="w-4 h-4" />
                Download {exportResultFile.filename}
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[var(--rw-border)] flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-brand-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body / Table */}
        <div className="flex-1 overflow-auto p-6 bg-[var(--rw-surface-hover)]">
          {formState.exportFormat === "bundle" ? (
            <div className="p-10 text-center bg-surface rounded-xl border border-dashed border-brand-blue/20 flex flex-col items-center h-full justify-center shadow-sm">
              <Database className="w-12 h-12 text-brand-sky mb-4" />
              <div className="font-semibold text-brand-dark mb-1">Bundle processing complete</div>
              <div className="text-sm text-gray-500">Preview is not available for ZIP bundles. Click download to view contents.</div>
            </div>
          ) : (
            <div className="h-full bg-surface rounded-2xl shadow-sm border border-brand-blue/5">
              <ResultsTable data={data} />
            </div>
          )}
        </div>
      </animated.div>
    </>
  );
}
