"use client";

import { useState, useRef } from "react";

export default function TagInput({
  label,
  hint,
  tags = [],
  onChange,
  placeholder = "Type and press Enter...",
  icon: Icon,
  theme = "blue",
}) {
  const isRed = theme === "red";
  const containerClasses = isRed 
    ? "focus-within:border-red-500 focus-within:ring-red-500/10 hover:border-red-500/40"
    : "focus-within:border-brand-sky focus-within:ring-brand-sky/10 hover:border-brand-sky/40";
  const iconClasses = isRed 
    ? "group-focus-within:text-red-500" 
    : "group-focus-within:text-brand-sky";

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
        className={`group flex flex-wrap items-center gap-1.5 p-2 min-h-[42px] bg-white border-1.5 border-gray-200 rounded-xl cursor-text transition-all focus-within:ring-4 ${containerClasses}`}
      >
        {Icon && (
          <div className={`pl-1.5 pr-1 text-gray-400 transition-colors flex items-center h-full ${iconClasses}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        {tags.map((tag) => (
          <span key={tag} className={`rw-tag ${isRed ? 'rw-tag-red' : ''}`}>
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
