"use client"
import React from "react"
import "./MessageDisplay.css"

const MessageDisplay = ({ message, onClose }) => {
  if (!message || !message.text) {
    return null
  }

  return (
    <div className={`message-display ${message.type}`}>
      <span>{message.text}</span>
      <button onClick={onClose} className="close-message-button">
        ×
      </button>
    </div>
  )
}

export default MessageDisplay
