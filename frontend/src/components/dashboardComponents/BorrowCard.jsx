// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\BorrowCard.jsx
import React from 'react';
import './BorrowCard.css';

const BorrowCard = ({ borrow, onReturn, onPayFineClick, returnLoading, isOverdue }) => {
  const overdue = isOverdue(borrow.dueDate) && borrow.status !== "returned";
  const currentFine = overdue
    ? Math.max(0, Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24))) * 10 // Assuming fine is 10 per day
    : 0;
  const displayFine = borrow.status === "returned" ? borrow.fine : currentFine;

  return (
    <div className={`borrow-card-component ${overdue ? "overdue" : ""}`}>
      <div className="borrow-details-component">
        <h3>{borrow.book.title}</h3>
        <p>
          <strong>Author:</strong> {borrow.book.author}
        </p>
        <p>
          <strong>Borrowed On:</strong> {new Date(borrow.borrowDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Due Date:</strong> {new Date(borrow.dueDate).toLocaleDateString()}
          {overdue && <span className="overdue-badge-component"> OVERDUE</span>}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge-component ${borrow.status}`}>{borrow.status}</span>
        </p>
        {(displayFine > 0) && (
          <p className="fine-info-component">
            <strong>Fine:</strong> Rs. {displayFine}
          </p>
        )}
      </div>
      <div className="borrow-actions-component">
        {borrow.status !== "returned" && (
          <button
            className="return-button-component"
            onClick={() => onReturn(borrow._id)}
            disabled={returnLoading}
          >
            {returnLoading ? "Processing..." : "Return Book"}
          </button>
        )}
        {displayFine > 0 && borrow.status !== "returned" && ( // Show pay fine only if not returned and fine exists
          <button
            className="pay-button-component"
            onClick={() => onPayFineClick(borrow)}
          >
            Pay Fine
          </button>
        )}
         {borrow.status === "returned" && borrow.fine > 0 && !borrow.finePaid && ( // If returned, fine exists and not paid
              <p className="fine-info-component">Fine of Rs. {borrow.fine} pending.</p> // Or a pay button if payment is separate after return
         )}
      </div>
    </div>
  );
};

export default BorrowCard;