// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\BooksView.jsx
import React from 'react';
import BookCard from './BookCard';
import LoadingIndicator from './LoadingIndicator';
import NoDataMessage from './NoDataMessage';
import './BooksView.css';

const BooksView = ({
  books,
  loading,
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  onBorrowBook,
  borrowLoading,
}) => {
  return (
    <div className="books-view-component">
      <h2>Available Books</h2>
      <div className="search-container-component">
        <input
          type="text"
          placeholder="Search by title, author, ISBN or category..."
          value={searchTerm}
          onChange={onSearchTermChange}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
        />
        <button onClick={onSearch}>Search</button>
        {searchTerm && (
          <button className="clear-search-button" onClick={onClearSearch}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <LoadingIndicator text="Loading books..." />
      ) : books.length > 0 ? (
        <div className="books-grid-component">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={onBorrowBook}
              borrowLoading={borrowLoading}
            />
          ))}
        </div>
      ) : (
        <NoDataMessage text="No books found." />
      )}
    </div>
  );
};

export default BooksView;