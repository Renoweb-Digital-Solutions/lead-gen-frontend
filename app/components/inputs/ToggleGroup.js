"use client";

export default function ToggleGroup({
  label,
  hint,
  options = [],
  value,
  onChange,
}) {
  return (
    <div className="rw-field">
      {label && (
        <label className="rw-label">
          {label}
          {hint && <span className="rw-label-hint">{hint}</span>}
        </label>
      )}
      <div className="rw-radio-group">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            className="rw-radio-item"
            data-active={value === opt.value || (value === null && opt.value === null)}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
