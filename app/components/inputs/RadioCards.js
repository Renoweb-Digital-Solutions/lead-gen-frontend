"use client";

export default function RadioCards({
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
      <div className="rw-radio-cards">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="rw-radio-card"
            data-selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          >
            <span className="rw-radio-card-icon">{opt.icon}</span>
            <span className="rw-radio-card-label">{opt.label}</span>
            <span className="rw-radio-card-desc">{opt.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
