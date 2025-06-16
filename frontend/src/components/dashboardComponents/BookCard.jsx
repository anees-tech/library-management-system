"use client"
import React from "react"
import "./BookCard.css"

const BookCard = ({ book, onBorrow, loadingBookIds, onViewDetails }) => {
  const isLoading = loadingBookIds[book._id] || false
  const isAvailable = book.availableQuantity > 0

  const handleBorrow = (e) => {
    e.stopPropagation() // Prevent modal from opening when clicking borrow
    if (!isLoading && isAvailable) {
      onBorrow(book._id)
    }
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    onViewDetails(book) // Pass the book object instead of navigating
  }

  const handleCardClick = () => {
    onViewDetails(book) // Open modal when clicking anywhere on the card
  }

  const handleImageError = (e) => {
    e.target.src = ""
  }

  return (
    <div className="book-card-component" onClick={handleCardClick}>
      <div className="book-image-container">
        <img
          src={book.imageUrl || book.coverImage || ""}
          alt={book.title}
          className="book-image"
          onError={handleImageError}
        />
      </div>
      <div className="book-content">
        <h3 title={book.title}>{book.title}</h3>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>
        <p>
          <strong>Category:</strong> {book.category}
        </p>
        <p className={`availability ${isAvailable ? "available" : "unavailable"}`}>
          <strong>Available:</strong> {book.availableQuantity} / {book.quantity}
        </p>
        
        <div className="book-card-actions">
          <button
            className="view-details-button"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button
            className={`borrow-button-component ${!isAvailable ? "unavailable" : ""}`}
            onClick={handleBorrow}
            disabled={!isAvailable || isLoading}
            title={!isAvailable ? "Book is not available" : "Borrow this book"}
          >
            {isLoading ? "Processing..." : !isAvailable ? "Not Available" : "Borrow"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard
