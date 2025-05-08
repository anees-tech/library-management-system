// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\BookCard.jsx
import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onBorrow, borrowLoading }) => {
  return (
    <div className="book-card-component">
      <h3>{book.title}</h3>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn}
      </p>
      <p>
        <strong>Category:</strong> {book.category}
      </p>
      <p>
        <strong>Available:</strong> {book.availableQuantity} / {book.quantity}
      </p>
      <button
        className="borrow-button-component"
        onClick={() => onBorrow(book._id)}
        disabled={book.availableQuantity === 0 || borrowLoading}
      >
        {borrowLoading ? "Processing..." : book.availableQuantity === 0 ? "Not Available" : "Borrow"}
      </button>
    </div>
  );
};

export default BookCard;