import type { ReactNode } from "react";

export interface CartModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function CartModal({ open, onClose, children }: CartModalProps) {
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity 0.25s ease",
          zIndex: 9998,
        }}
      />

      {/* SLIDE-IN PANEL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "340px",
          background: "#ffffff",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          zIndex: 9999,
          padding: "20px",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          overflowY: "auto",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            color: "#444",
            border: "none",
            fontSize: "20px",
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {children}
      </div>
    </>
  );
}
