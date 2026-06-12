"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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

  useEffect(() => {
    if (!isDragging) {
      setInputValue(value.toString());
    }
  }, [value, isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

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
    updateValue(e.clientX);

    const handleMouseMove = (e) => updateValue(e.clientX);
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);

    const handleTouchMove = (e) => {
      e.preventDefault();
      updateValue(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const displayValue = formatValue ? formatValue(value) : value.toLocaleString();

  return (
    <div className="rw-field">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label className="rw-label" style={{ marginBottom: 0 }}>
          {label}
          {hint && <span className="rw-label-hint">{hint}</span>}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - step))}
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: "1px solid var(--rw-border)",
              background: "var(--rw-surface)",
              color: "var(--rw-text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--rw-surface-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--rw-surface)"}
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
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--rw-deep-blue)",
              fontVariantNumeric: "tabular-nums",
              width: 70,
              textAlign: "center",
              border: "1px solid transparent",
              borderRadius: 6,
              padding: "2px 0",
              background: "transparent",
              transition: "all 0.15s ease",
              outline: "none",
            }}
            onFocus={(e) => e.currentTarget.style.border = "1px solid var(--rw-border)"}
            onBlurCapture={(e) => e.currentTarget.style.border = "1px solid transparent"}
          />
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + step))}
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: "1px solid var(--rw-border)",
              background: "var(--rw-surface)",
              color: "var(--rw-text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--rw-surface-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--rw-surface)"}
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="rw-slider-track"
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
        <div className="rw-slider-fill" style={{ width: `${percentage}%` }} />
        <div
          className="rw-slider-thumb"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 11,
          color: "var(--rw-text-muted)",
        }}
      >
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
