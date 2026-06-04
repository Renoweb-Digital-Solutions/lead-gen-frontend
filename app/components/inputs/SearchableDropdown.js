"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchableDropdown({
  label,
  hint,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((opt) => {
    const optLabel = typeof opt === "string" ? opt : opt.label;
    return optLabel.toLowerCase().includes(search.toLowerCase());
  });

  const selectedLabel = (() => {
    if (value === null || value === undefined) return null;
    const found = options.find((opt) => {
      const optValue = typeof opt === "string" ? opt : opt.value;
      return optValue === value;
    });
    if (!found) return String(value);
    return typeof found === "string" ? found : found.label;
  })();

  return (
    <div className="rw-field">
      {label && (
        <label className="rw-label">
          {label}
          {hint && <span className="rw-label-hint">{hint}</span>}
        </label>
      )}

      <div className="rw-dropdown" ref={containerRef} style={isOpen ? { zIndex: 60 } : undefined}>
        <button
          type="button"
          className="rw-dropdown-trigger"
          data-open={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ flex: 1, textAlign: "left" }}>
            {selectedLabel ? (
              <span>{selectedLabel}</span>
            ) : (
              <span style={{ color: "var(--rw-text-muted)" }}>{placeholder}</span>
            )}
          </span>
          <svg
            className="rw-dropdown-chevron"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="rw-dropdown-menu">
            {options.length > 5 && (
              <div className="rw-dropdown-search">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="rw-dropdown-list">
              {filtered.length === 0 ? (
                <div className="rw-dropdown-empty">No options found</div>
              ) : (
                filtered.map((opt) => {
                  const optLabel = typeof opt === "string" ? opt : opt.label;
                  const optValue = typeof opt === "string" ? opt : opt.value;
                  const isSelected = optValue === value;

                  return (
                    <div
                      key={String(optValue)}
                      className="rw-dropdown-item"
                      data-selected={isSelected}
                      onClick={() => {
                        onChange(optValue);
                        setIsOpen(false);
                        setSearch("");
                      }}
                    >
                      {optLabel}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
