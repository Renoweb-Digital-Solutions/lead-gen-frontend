"use client";

import { STEPS } from "../lib/constants";

export default function Sidebar({ activeStep, onStepChange, completedSteps = {} }) {
  return (
    <nav
      style={{
        width: 250,
        minHeight: "calc(100vh - 57px)",
        background:
          "linear-gradient(165deg, rgba(235, 243, 255, 0.85) 0%, rgba(220, 235, 255, 0.75) 40%, rgba(200, 225, 255, 0.7) 100%)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        borderRight: "1px solid rgba(255, 255, 255, 0.5)",
        padding: "28px 0",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flexShrink: 0,
        boxShadow:
          "inset -1px 0 0 rgba(255, 255, 255, 0.6), 4px 0 24px rgba(48, 143, 239, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glass shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(255, 255, 255, 0.2) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Steps */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps[step.id];

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(index)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                border: "none",
                background: isActive
                  ? "rgba(48, 143, 239, 0.12)"
                  : "transparent",
                borderLeft: isActive
                  ? "3px solid var(--rw-bright-blue)"
                  : "3px solid transparent",
                borderRight: "none",
                borderTop: "none",
                borderBottom: "none",
                cursor: "pointer",
                transition: "all 0.25s ease",
                textAlign: "left",
                fontFamily: "inherit",
                borderRadius: isActive ? "0 8px 8px 0" : "0",
                margin: isActive ? "2px 8px 2px 0" : "0",
                boxShadow: isActive
                  ? "0 2px 12px rgba(48, 143, 239, 0.1), inset 0 0 0 1px rgba(48, 143, 239, 0.08)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(48, 143, 239, 0.06)";
                  e.currentTarget.style.borderRadius = "0 8px 8px 0";
                  e.currentTarget.style.margin = "2px 8px 2px 0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderRadius = "0";
                  e.currentTarget.style.margin = "0";
                }
              }}
            >
              {/* Step number / check */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  background: isCompleted
                    ? "var(--rw-success)"
                    : isActive
                    ? "var(--rw-gradient-primary)"
                    : "rgba(48, 143, 239, 0.08)",
                  color: isCompleted || isActive ? "#ffffff" : "var(--rw-bright-blue)",
                  transition: "all 0.3s ease",
                  border:
                    !isCompleted && !isActive
                      ? "1.5px solid rgba(48, 143, 239, 0.15)"
                      : "1.5px solid transparent",
                  boxShadow:
                    isActive
                      ? "0 4px 12px rgba(48, 143, 239, 0.25)"
                      : "none",
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7L6 10L11 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? "var(--rw-deep-blue)"
                      : "#4a5568",
                    transition: "all 0.2s ease",
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: isActive
                      ? "var(--rw-bright-blue)"
                      : "#94a3b8",
                    marginTop: 2,
                    transition: "all 0.2s ease",
                  }}
                >
                  {step.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer branding */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(48, 143, 239, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          Renoweb Digital Solutions
          <br />
          Lead Generation Pipeline
        </div>
      </div>
    </nav>
  );
}
