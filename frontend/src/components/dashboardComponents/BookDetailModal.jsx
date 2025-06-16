"use client"
import React, { useState, useEffect } from "react"
import { FaBook, FaUser, FaCalendar, FaTag, FaBoxes, FaTimes } from "react-icons/fa"
import "./BookDetailModal.css"

const BookDetailModal = ({ isOpen, onClose, book, user, onBorrowBook }) => {
  const [borrowing, setBorrowing] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Clear message when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setMessage({ type: "", text: "" })
      setBorrowing(false)
    }
  }, [isOpen])

  const handleBorrowBook = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Please login to borrow books" })
      return
    }

    setBorrowing(true)
    try {
      await onBorrowBook(book._id)
      setMessage({ 
        type: "success", 
        text: "Book borrowed successfully! Check 'My Borrows' tab." 
      })
      
      // Auto close modal after successful borrow
      setTimeout(() => {
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error("Error borrowing book:", error)
      setMessage({ type: "error", text: error.message || "Failed to borrow book." })
    } finally {
      setBorrowing(false)
    }
  }

  const handleImageError = (e) => {
    e.target.src = "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3N2MTU5NDA3LWltYWdlLXJtNjQ5LWFfMS5wbmc.png"
  }

  if (!isOpen || !book) return null

  const isAvailable = book.availableQuantity > 0

  return (
    <div className="book-detail-modal-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {message.text && (
          <div className={`book-detail-message ${message.type}`}>
            {message.text}
            <button onClick={() => setMessage({ type: "", text: "" })}>×</button>
          </div>
        )}

        <div className="book-detail-modal-content">
          <div className="book-detail-image-section">
            <div className="book-image-wrapper">
              <img
                src={book.imageUrl || book.coverImage || ""}
                alt={book.title}
                className="book-detail-modal-image"
                onError={handleImageError}
              />
            </div>
          </div>

          <div className="book-detail-info-section">
            <h1 className="book-detail-title">{book.title}</h1>
            
            <div className="book-detail-meta">
              <div className="meta-row">
                <FaUser className="meta-icon" />
                <span className="meta-label">Author:</span>
                <span className="meta-value">{book.author}</span>
              </div>
              
              <div className="meta-row">
                <FaTag className="meta-icon" />
                <span className="meta-label">Category:</span>
                <span className="meta-value">{book.category}</span>
              </div>
              
              <div className="meta-row">
                <FaBook className="meta-icon" />
                <span className="meta-label">ISBN:</span>
                <span className="meta-value">{book.isbn}</span>
              </div>
              
              <div className="meta-row">
                <FaBoxes className="meta-icon" />
                <span className="meta-label">Availability:</span>
                <span className={`meta-value availability ${isAvailable ? "available" : "unavailable"}`}>
                  {book.availableQuantity} of {book.quantity} available
                </span>
              </div>
              
              {book.purchaseDate && (
                <div className="meta-row">
                  <FaCalendar className="meta-icon" />
                  <span className="meta-label">Added:</span>
                  <span className="meta-value">
                    {new Date(book.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="book-detail-description">
              <h3>Description</h3>
              <p>{book.description || "No description available."}</p>
            </div>

            <div className="book-detail-actions">
              <button
                className={`borrow-btn-modal ${!isAvailable || borrowing ? "disabled" : ""}`}
                onClick={handleBorrowBook}
                disabled={!isAvailable || borrowing}
              >
                {borrowing ? "Processing..." : !isAvailable ? "Not Available" : "Borrow Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailModal