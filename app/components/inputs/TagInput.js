"use client";

import { useState, useRef } from "react";

export default function TagInput({
  label,
  hint,
  tags = [],
  onChange,
  placeholder = "Type and press Enter...",
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addTag = (value) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      const newTagsList = [...tags];
      const lastPart = parts.pop();
      let added = false;

      parts.forEach((p) => {
        const trimmed = p.trim();
        if (trimmed && !newTagsList.includes(trimmed)) {
          newTagsList.push(trimmed);
          added = true;
        }
      });

      setInputValue(lastPart.trimStart());
      if (added) {
        onChange(newTagsList);
      }
    } else {
      setInputValue(val);
    }
  };

  return (
    <div className="rw-field">
      {label && (
        <label className="rw-label">
          {label}
          {hint && <span className="rw-label-hint">{hint}</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "8px 12px",
          minHeight: 42,
          background: "var(--rw-surface)",
          border: "1.5px solid var(--rw-border)",
          borderRadius: "var(--rw-radius-md)",
          cursor: "text",
          transition: "border-color var(--rw-transition-fast), box-shadow var(--rw-transition-fast)",
        }}
        onFocus={() => {}}
      >
        {tags.map((tag) => (
          <span key={tag} className="rw-tag">
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{
            flex: "1 1 120px",
            minWidth: 120,
            border: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "inherit",
            background: "transparent",
            color: "var(--rw-text)",
            padding: "2px 4px",
          }}
        />
      </div>
    </div>
  );
}
