"use client";

import React, { useEffect, useRef } from "react";

/**
 * ScrollProgressLine
 * 
 * Slim 2px reading-progress line fixed to the right edge of the viewport.
 * Runs the full height of the viewport inside the scrollbar lane, behind the thumb.
 * Filled in --scroll-accent, growing from top via scaleY (transform & opacity only).
 * Decorative only, aria-hidden, pointer-events: none, zero layout shift.
 */
export default function ScrollProgressLine() {
  const fillRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const updateScrollProgress = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop || 0;
      const scrollHeight = (docEl.scrollHeight || document.body.scrollHeight) - window.innerHeight;

      if (scrollHeight <= 0) {
        if (fillRef.current) {
          fillRef.current.style.transform = "scaleY(0)";
          fillRef.current.style.opacity = "0";
        }
        return;
      }

      const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;

        // At scroll progress 0, fill is hidden. At 100%, it holds full length and fades slightly.
        if (progress <= 0.005) {
          fillRef.current.style.opacity = "0";
        } else if (progress >= 0.99) {
          fillRef.current.style.opacity = "0.75";
        } else {
          fillRef.current.style.opacity = "1";
        }
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateScrollProgress();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial check
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="reading-progress-rail fixed top-0 bottom-0 right-0 w-[2px] h-screen pointer-events-none z-[9999]"
    >
      {/* Faint 1px track under the fill at 10% opacity */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-slate-400/10 dark:bg-white/10" />

      {/* 2px progress fill in --scroll-accent growing from top */}
      <div
        ref={fillRef}
        style={{
          backgroundColor: "var(--scroll-accent, #023dbb)",
          transformOrigin: "top",
          transform: "scaleY(0)",
          opacity: 0,
        }}
        className="absolute inset-y-0 right-0 w-[2px] h-full"
      />
    </div>
  );
}
