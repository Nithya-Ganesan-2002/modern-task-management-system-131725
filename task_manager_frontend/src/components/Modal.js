import React from "react";
import "./Modal.css";

// PUBLIC_INTERFACE
function Modal({ title, open, onClose, children }) {
  /** Modal overlay, centered */
  if (!open) return null;
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </header>
        <main className="modal__content">{children}</main>
      </div>
    </div>
  );
}

export default Modal;
