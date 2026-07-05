"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function SliderInput({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 5000,
  step = 10,
  formatValue,
}) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isDragging) {
      setInputValue(value.toString());
    }
  }, [value, isDragging]);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const updateValue = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      onChange(clamped);
    },
    [min, max, step, onChange]
  );

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    controls.start("dragging");
    updateValue(e.clientX);

    const handleMouseMove = (e) => updateValue(e.clientX);
    const handleMouseUp = () => {
      setIsDragging(false);
      controls.start("idle");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    controls.start("dragging");
    updateValue(e.touches[0].clientX);

    const handleTouchMove = (e) => {
      e.preventDefault();
      updateValue(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
      controls.start("idle");
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="rw-field mb-6">
      <div className="flex justify-between items-baseline mb-4">
        <label className="text-[13px] font-semibold text-brand-dark block uppercase tracking-wide m-0">
          {label}
          {hint && <span className="text-[12px] font-normal text-gray-400 ml-2 normal-case">{hint}</span>}
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - step))}
            className="w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 flex items-center justify-center text-lg leading-none transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              let val = parseInt(inputValue, 10);
              if (isNaN(val)) val = min;
              val = Math.max(min, Math.min(max, val));
              onChange(val);
              setInputValue(val.toString());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur();
              }
            }}
            className="text-lg font-bold text-brand-blue tabular-nums w-16 text-center bg-transparent border border-transparent rounded-md focus:border-brand-sky/30 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + step))}
            className="w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 flex items-center justify-center text-lg leading-none transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative w-full h-2 rounded-full bg-gray-100 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            onChange(Math.min(max, value + step));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            onChange(Math.max(min, value - step));
          }
        }}
      >
        <div 
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-amber ${!isDragging ? 'transition-all duration-100 ease-out' : ''}`} 
          style={{ width: `${percentage}%` }} 
        />
        <motion.div
          animate={controls}
          variants={{
            idle: { scale: 1, boxShadow: "0 2px 4px rgba(2,61,187,0.15)" },
            dragging: { scale: 1.25, boxShadow: "0 0 0 6px rgba(48,143,239,0.15), 0 4px 12px rgba(2,61,187,0.2)" }
          }}
          initial="idle"
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute top-1/2 w-[18px] h-[18px] rounded-full bg-white border-2 border-brand-blue -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${percentage}%`, zIndex: 10 }}
        >
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -30, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute whitespace-nowrap bg-brand-dark text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg pointer-events-none"
            >
              {value}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-dark" />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-between mt-2 text-[11px] font-medium text-gray-400">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
