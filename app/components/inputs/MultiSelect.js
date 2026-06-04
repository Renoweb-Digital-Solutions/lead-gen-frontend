"use client";

import { useState, useRef, useEffect } from "react";

export default function MultiSelect({
  label,
  hint,
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  searchable = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close on outside click
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

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const removeTag = (opt) => {
    onChange(selected.filter((s) => s !== opt));
  };

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
          style={{ minHeight: 42 }}
        >
          <span style={{ flex: 1, textAlign: "left" }}>
            {selected.length === 0 ? (
              <span style={{ color: "var(--rw-text-muted)" }}>{placeholder}</span>
            ) : (
              <span style={{ color: "var(--rw-text)" }}>
                {selected.length} selected
              </span>
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
            {searchable && (
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
                  const isSelected = selected.includes(opt);
                  return (
                    <div
                      key={opt}
                      className="rw-dropdown-item"
                      data-selected={isSelected}
                      onClick={() => toggleOption(opt)}
                    >
                      <div className="rw-checkbox" data-checked={isSelected} />
                      <span>{opt}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
          }}
        >
          {selected.map((tag) => (
            <span key={tag} className="rw-tag">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
