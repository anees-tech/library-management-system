// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\BorrowsView.jsx
import React from 'react';
import BorrowCard from './BorrowCard';
import LoadingIndicator from './LoadingIndicator';
import NoDataMessage from './NoDataMessage';
import './BorrowsView.css';

const BorrowsView = ({
  borrows,
  loading,
  onReturnBook,
  onOpenPaymentModal,
  returnLoading,
  isOverdue,
}) => {
  return (
    <div className="borrows-view-component">
      <h2>My Borrowed Books</h2>
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
            />
          ))}
        </div>
      ) : (
        <NoDataMessage text="You haven't borrowed any books yet." />
      )}
    </div>
  );
};

export default BorrowsView;