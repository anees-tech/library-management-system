"use client"
import React from "react"

import "./PaymentModal.css"

const PaymentModal = ({ isOpen, onClose, selectedBorrow, onPayFine }) => {
  if (!isOpen || !selectedBorrow) {
    return null
  }

  const fineAmount =
    selectedBorrow.status === "returned"
      ? selectedBorrow.fine
      : Math.max(0, Math.ceil((new Date() - new Date(selectedBorrow.dueDate)) / (1000 * 60 * 60 * 24))) * 10

  const handlePayment = () => {
    onPayFine(selectedBorrow._id, fineAmount)
  }

  return (
    <div className="modal-overlay-component">
      <div className="modal-component">
        <div className="modal-header-component">
          <h2>Pay Fine</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content-component">
          <p>
            <strong>Book:</strong> {selectedBorrow.book?.title || "N/A"}
          </p>
          <p>
            <strong>Author:</strong> {selectedBorrow.book?.author || "N/A"}
          </p>
          <p>
            <strong>Due Date:</strong> {new Date(selectedBorrow.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Fine Amount:</strong> Rs. {fineAmount}
          </p>

          <div className="payment-form-component">
            <div className="form-group-component">
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="form-row-component">
              <div className="form-group-component">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="form-group-component">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="form-group-component">
              <label htmlFor="cardName">Name on Card</label>
              <input type="text" id="cardName" placeholder="John Doe" />
            </div>

            <div className="form-actions-component">
              <button className="cancel-button-component" onClick={onClose}>
                Cancel
              </button>
              <button className="pay-now-button-component" onClick={handlePayment}>
                Pay Rs. {fineAmount} (Mock)
              </button>
            </div>
            <p className="mock-payment-note">Note: This is a mock payment form. No actual transaction will occur.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
