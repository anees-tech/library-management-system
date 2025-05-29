"use client"
import React from "react"

import "../../styles/Modal.css"

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal confirm-dialog">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <p>{message}</p>
          <div className="confirm-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="delete-button" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
