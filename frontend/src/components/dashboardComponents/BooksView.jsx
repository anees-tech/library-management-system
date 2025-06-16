"use client"
import React from "react"
import BookCard from "./BookCard"
import LoadingIndicator from "./LoadingIndicator"
import NoDataMessage from "./NoDataMessage"
import "./BooksView.css"

const BooksView = ({
  books,
  loading,
  searchLoading,
  searchTerm,
  onBorrowBook,
  loadingBookIds,
  onViewBookDetails, // New prop for modal handler
}) => {
  return (
    <div className="books-view-component">
      <h2>Available Books</h2>

      {/* Show search loading indicator */}
      {searchLoading && (
        <div className="search-loading">
          <LoadingIndicator text="Searching books..." />
        </div>
      )}

      {/* Show main loading only when no books and not searching */}
      {loading && !searchLoading ? (
        <LoadingIndicator text="Loading books..." />
      ) : books.length > 0 ? (
        <>
          {searchTerm && (
            <div className="search-results-info">
              <p>
                Found <strong>{books.length}</strong> book{books.length !== 1 ? "s" : ""} 
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}
          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBorrow={onBorrowBook}
                loadingBookIds={loadingBookIds}
                onViewDetails={onViewBookDetails} // Pass the modal handler
              />
            ))}
          </div>
        </>
      ) : (
        <NoDataMessage
          message={searchTerm ? `No books found matching "${searchTerm}"` : "No books available"}
        />
      )}
    </div>
  )
}

export default BooksView
