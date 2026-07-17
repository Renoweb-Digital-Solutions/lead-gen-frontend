"use client";

import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { X, Download, GripHorizontal } from "lucide-react";
import InstagramResultsGrid from "./InstagramResultsGrid";

export default function InstagramResultsBottomSheet({ isOpen, onOpen, onClose, onExport, data, subtitle }) {
  // Height of the bottom sheet (vh)
  const SHEET_HEIGHT_VH = 85;
  const [sheetHeightPx, setSheetHeightPx] = useState(800);

  useEffect(() => {
    setSheetHeightPx((window.innerHeight * SHEET_HEIGHT_VH) / 100);
  }, []);

  const closedY = sheetHeightPx * 0.90; // 10% visible

  // Spring for the Y position of the sheet
  const [{ y }, api] = useSpring(() => ({
    y: closedY,
    config: { tension: 280, friction: 32 }
  }));

  // Spring for backdrop opacity
  const [{ opacity }, backdropApi] = useSpring(() => ({
    opacity: 0,
    config: { tension: 250, friction: 25 }
  }));

  // Open / Close animation logic
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

  // Drag gesture handler
  const bind = useDrag(({ active, offset: [, oy], velocity: [, vy], direction: [, dy], cancel }) => {
    // Prevent dragging up past the top
    if (oy < 0) {
      cancel();
      oy = 0;
    }

    if (active) {
      api.start({ y: oy, immediate: true });
    } else {
      // Finger released. Determine if we should close or snap back.
      const shouldClose = oy > sheetHeightPx * 0.3 || (vy > 0.5 && dy > 0);

      if (shouldClose) {
        onClose();
      } else {
        if (onOpen) onOpen(); // Set parent state to open
        api.start({ y: 0, immediate: false });
      }
    }
  }, {
    from: () => [0, y.get()],
    bounds: { top: 0 },
    rubberband: true
  });

  return (
    <>
      {/* Backdrop */}
      <animated.div
        style={{
          opacity,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-[100] bg-pink-900/15 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <animated.div
        style={{
          y,
          height: `${SHEET_HEIGHT_VH}vh`
        }}
        className="fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(219,39,119,0.1)] flex flex-col will-change-transform"
      >
        <div
          {...bind()}
          onClick={() => { if (!isOpen && onOpen) onOpen(); }}
          className="relative w-full pt-3 pb-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none group hover:bg-pink-50/[0.5] transition-colors rounded-t-[32px]"
        >
          {/* Main Grip Handle */}
          <div className="flex items-center justify-center w-16 h-1.5 rounded-full bg-gray-200 group-hover:bg-pink-400/40 transition-colors mb-2" />

          {/* Subtle icon/hint visible mainly when closed */}
          {!isOpen && (
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-pink-600/60 group-hover:text-pink-600 transition-colors">
              <GripHorizontal className="w-3.5 h-3.5" />
              Pull to open
            </div>
          )}
        </div>

        {/* Header */}
        <div className="px-8 pb-4 border-b border-pink-500/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-dark leading-tight">
              Instagram Extraction Results
            </h2>
            <p className="text-[13px] font-medium text-gray-500">
              {subtitle || `${data?.length || 0} leads ready for export`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-[13px] hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-brand-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body / Grid */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-4 sm:p-6 pb-8">
          <InstagramResultsGrid data={data} />
        </div>
      </animated.div>
    </>
  );
}
