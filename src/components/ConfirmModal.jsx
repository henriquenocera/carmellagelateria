import React from "react";

const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        style={{ maxWidth: "400px", textAlign: "center", padding: "30px" }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "var(--secondary-color)",
            margin: "0 0 16px 0",
          }}
        >
          Atenção
        </h3>
        <p
          style={{
            fontSize: "1.4rem",
            color: "var(--text-muted)",
            margin: "0 0 24px 0",
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#fff",
              color: "#475569",
              cursor: "pointer",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary-color)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
