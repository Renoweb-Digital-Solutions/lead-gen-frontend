"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, onConfirm, title, description }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="rw-modal-backdrop" onClick={onClose}>
      <div className="rw-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Warning icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: 24,
          }}
        >
          ⚠️
        </div>

        <h3 className="rw-modal-title">{title}</h3>
        <p className="rw-modal-desc">{description}</p>

        <div className="rw-modal-actions">
          <button type="button" className="rw-btn rw-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="rw-btn rw-btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
}
