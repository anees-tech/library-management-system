"use client"
import React from "react"
import "./BookCard.css"

const BookCard = ({ book, onBorrow, loadingBookIds }) => {
  const isLoading = loadingBookIds[book._id] || false
  const isAvailable = book.availableQuantity > 0

  const handleBorrow = () => {
    if (!isLoading && isAvailable) {
      onBorrow(book._id)
    }
  }

  const handleImageError = (e) => {
    e.target.src = ""
  }

  return (
    <div className="book-card-component">
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
  )
}

export default BookCard
