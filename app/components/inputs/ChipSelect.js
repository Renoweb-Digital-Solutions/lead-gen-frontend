"use client";

export default function ChipSelect({
  label,
  hint,
  options = [],
  selected = [],
  onChange,
}) {
  const toggleChip = (chipValue) => {
    if (selected.includes(chipValue)) {
      onChange(selected.filter((s) => s !== chipValue));
    } else {
      onChange([...selected, chipValue]);
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const chipLabel = typeof opt === "string" ? opt : opt.label;
          const chipValue = typeof opt === "string" ? opt : opt.value;
          const isSelected = selected.includes(chipValue);

          return (
            <button
              key={chipValue}
              type="button"
              className="rw-chip"
              data-selected={isSelected}
              onClick={() => toggleChip(chipValue)}
            >
              {isSelected && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {chipLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
