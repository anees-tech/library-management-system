// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\MessageDisplay.jsx
import React from 'react';
import './MessageDisplay.css';

const MessageDisplay = ({ message, onClose }) => {
  if (!message || !message.text) {
    return null;
  }

  return (
    <div className={`message-display ${message.type}`}>
      {message.text}
      <button onClick={onClose} className="close-message-button">
        ×
      </button>
    </div>
  );
};

export default MessageDisplay;