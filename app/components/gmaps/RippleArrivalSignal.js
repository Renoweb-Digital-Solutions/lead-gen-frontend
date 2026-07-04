"use client";

import { useEffect, useState } from "react";

/**
 * RippleArrivalSignal
 * 
 * A pure, textless, borderless water ripple effect.
 * Triggers once when results arrive, pulsing 3-4 soft gradient rings 
 * outward to draw attention to the bottom sheet peek area.
 * 
 * PROPS:
 * - isActive (boolean): Trigger to play the animation.
 */
export default function RippleArrivalSignal({ isActive }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      
      // The longest animation cycle (last ring + its duration) takes ~4.5s
      // Unmount after 5 seconds to clean up DOM and prevent looping
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center justify-center w-0 h-0">
      <style>
        {`
          @keyframes rw-water-ripple {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            15% {
              /* Peak opacity is very low to keep it barely-there and elegant */
              opacity: 0.15;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }

          .rw-ripple-ring {
            position: absolute;
            /* Max diameter 300px */
            width: 300px;
            height: 300px;
            border-radius: 50%;
            /* Soft brand gradient */
            background: radial-gradient(circle, rgba(78, 200, 239, 0.8) 0%, rgba(48, 143, 239, 0.8) 60%, transparent 100%);
            /* Heavy blur for a diffused, watery edge */
            filter: blur(20px);
            /* Ease-out mimics water ripple losing energy as it expands */
            animation: rw-water-ripple 3s cubic-bezier(0.1, 0.7, 0.1, 1) forwards;
            opacity: 0; /* Base state is hidden */
            transform-origin: center;
          }
        `}
      </style>

      {/* 
        3 concentric staggered rings.
        Delay determines when each ring fires.
      */}
      <div className="rw-ripple-ring" style={{ animationDelay: "0s" }} />
      <div className="rw-ripple-ring" style={{ animationDelay: "0.8s" }} />
      <div className="rw-ripple-ring" style={{ animationDelay: "1.6s" }} />
    </div>
  );
}
