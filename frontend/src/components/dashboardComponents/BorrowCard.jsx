"use client"
import React from "react"
import "./BorrowCard.css"

const BorrowCard = ({ borrow, onReturn, onPayFineClick, returnLoading, isOverdue, hasUnpaidFines }) => {
  const overdue = isOverdue(borrow.dueDate) && borrow.status !== "returned"
  const currentFine = overdue
    ? Math.max(0, Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24))) * 10
    : 0
  const displayFine = borrow?.status === "returned" ? borrow?.fine : currentFine
  
  // Check if this specific borrow has unpaid fine
  const hasUnpaidFineThisBorrow = borrow?.status === "returned" && borrow?.fine > 0 && !borrow?.finePaid
  
  // Also check for overdue books that will have current fine
  const hasCurrentFine = overdue && currentFine > 0
  
  // Disable return if user has any unpaid fines from other books
  const canReturn = borrow.status === "borrowed" && !hasUnpaidFines

  return (
    <div className={`borrow-card-component ${overdue ? "overdue" : ""} ${hasUnpaidFineThisBorrow ? "unpaid-fine" : ""}`}>
      <div className="borrow-details-component">
        <h3>{borrow.book?.title || "Unknown Book"}</h3>
        <p>
          <strong>Author:</strong> {borrow.book?.author || "Unknown"}
        </p>
        <p>
          <strong>Borrowed:</strong> {new Date(borrow.borrowedDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Due:</strong> {new Date(borrow.dueDate).toLocaleDateString()}
        </p>
        {borrow.returnedDate && (
          <p>
            <strong>Returned:</strong> {new Date(borrow.returnedDate).toLocaleDateString()}
          </p>
        )}
        {displayFine > 0 && (
          <p className="fine-amount">
            <strong>Fine:</strong> Rs. {displayFine}
            {hasUnpaidFineThisBorrow && <span className="unpaid-label"> (Unpaid)</span>}
            {borrow?.finePaid && <span className="paid-label"> (Paid)</span>}
            {hasCurrentFine && <span className="current-fine-label"> (Current)</span>}
          </p>
        )}
        
        {/* Warning message if user has unpaid fines */}
        {hasUnpaidFines && borrow.status === "borrowed" && (
          <p className="warning-message">
            ⚠️ Cannot return books until all fines are paid
          </p>
        )}
      </div>

      <div className="borrow-actions-component">
        <div
          className={`status-badge-component ${
            borrow.status === "returned" ? "returned" : overdue ? "overdue" : "borrowed"
          }`}
        >
          {borrow.status === "returned" ? "Returned" : overdue ? "Overdue" : "Borrowed"}
        </div>

        <div className="action-buttons">
          {borrow.status === "borrowed" && (
            <button
              className="return-button-component"
              onClick={() => onReturn(borrow._id)}
              disabled={returnLoading || !canReturn}
              title={!canReturn ? "Pay all fines before returning books" : "Return this book"}
            >
              {returnLoading ? "Returning..." : "Return Book"}
            </button>
          )}

          {/* Pay Fine button for returned books with unpaid fines */}
          {hasUnpaidFineThisBorrow && (
            <button
              className="pay-button-component"
              onClick={() => onPayFineClick(borrow)}
            >
              Pay Fine (Rs. {borrow.fine})
            </button>
          )}

          {/* Pay Fine button for overdue books (current fine) */}
          {hasCurrentFine && borrow.status === "borrowed" && (
            <button
              className="pay-button-component overdue-pay"
              onClick={() => onPayFineClick({
                ...borrow,
                fine: currentFine, // Use current calculated fine
                isCurrentFine: true // Flag to indicate this is a current fine
              })}
            >
              Pay Current Fine (Rs. {currentFine})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BorrowCard
