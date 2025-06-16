"use client"
import React from "react"
import BorrowCard from "./BorrowCard"
import LoadingIndicator from "./LoadingIndicator"
import NoDataMessage from "./NoDataMessage"
import "./BorrowsView.css"

const BorrowsView = ({ borrows, loading, onReturnBook, onOpenPaymentModal, returnLoading, isOverdue }) => {
  // Check if user has any unpaid fines
  const hasUnpaidFines = borrows.some(borrow => 
    borrow.status === "returned" && 
    borrow.fine > 0 && 
    !borrow.finePaid
  )

  return (
    <div className="borrows-view-component">
      <h2>My Borrowed Books</h2>
      
      {/* Show warning if user has unpaid fines */}
      {hasUnpaidFines && (
        <div className="unpaid-fines-warning">
          <p>⚠️ <strong>Warning:</strong> You have unpaid fines. Please pay all fines before returning any books.</p>
        </div>
      )}
      
      {loading ? (
        <LoadingIndicator text="Loading your borrows..." />
      ) : borrows.length > 0 ? (
        <div className="borrows-list-component">
          {borrows.map((borrow) => (
            <BorrowCard
              key={borrow._id}
              borrow={borrow}
              onReturn={onReturnBook}
              onPayFineClick={onOpenPaymentModal}
              returnLoading={returnLoading}
              isOverdue={isOverdue}
              hasUnpaidFines={hasUnpaidFines} // Pass this to each card
            />
          ))}
        </div>
      ) : (
        <NoDataMessage text="You haven't borrowed any books yet." />
      )}
    </div>
  )
}

export default BorrowsView
