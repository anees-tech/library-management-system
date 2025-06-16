"use client"
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaBook, FaUser, FaCalendar, FaTag, FaBoxes } from "react-icons/fa"
import "../styles/BookDetail.css"

const BookDetail = ({ user, onBorrowBook }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [borrowing, setBorrowing] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const API_BASE_URL = "http://localhost:5000/api"

    useEffect(() => {
        fetchBookDetail()
    }, [id])

    const fetchBookDetail = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch book details")
            }

            setBook(data.data)
        } catch (error) {
            console.error("Error fetching book details:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleBorrowBook = async () => {
        if (!user) {
            setMessage({ type: "error", text: "Please login to borrow books" })
            return
        }

        setBorrowing(true)
        try {
            const dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + 14)

            const response = await fetch(`${API_BASE_URL}/borrows`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookId: book._id,
                    userId: user._id,
                    dueDate: dueDate.toISOString(),
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || "Failed to borrow book")

            setMessage({
                type: "success",
                text: `Book borrowed successfully! Due: ${new Date(dueDate).toLocaleDateString()}`
            })

            // Refresh book details to update availability
            fetchBookDetail()

        } catch (error) {
            console.error("Error borrowing book:", error)
            setMessage({ type: "error", text: error.message || "Failed to borrow book." })
        } finally {
            setBorrowing(false)
        }
    }

    const handleGoBack = () => {
        navigate(-1) // Go back to previous page
    }

    const handleImageError = (e) => {
        e.target.src = "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3N2MTU5NDA3LWltYWdlLXJtNjQ5LWFfMS5wbmc.png"
    }

    if (loading) {
        return (
            <div className="book-detail-container">
                <div className="loading-detail">Loading book details...</div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="book-detail-container">
                <div className="error-detail">
                    <h2>Book Not Found</h2>
                    <p>{error || "The requested book could not be found."}</p>
                    <button onClick={handleGoBack} className="back-button">
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        )
    }

    const isAvailable = book.availableQuantity > 0

    return (
        <>
            <div className="book-detail-container">
                <button onClick={handleGoBack} className="back-button">
                    <FaArrowLeft /> Back
                </button>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                        <button onClick={() => setMessage({ type: "", text: "" })}>×</button>
                    </div>
                )}

                <div className="book-detail-content">
                    <div className="book-image-section">
                        <img
                            src={book.imageUrl || book.coverImage || ""}
                            alt={book.title}
                            className="book-detail-image"
                            onError={handleImageError}
                        />
                    </div>

                    <div className="book-info-section">
                        <h1 className="book-title">{book.title}</h1>

                        <div className="book-meta">
                            <div className="meta-item">
                                <FaUser className="meta-icon" />
                                <span className="meta-label">Author:</span>
                                <span className="meta-value">{book.author}</span>
                            </div>

                            <div className="meta-item">
                                <FaTag className="meta-icon" />
                                <span className="meta-label">Category:</span>
                                <span className="meta-value">{book.category}</span>
                            </div>

                            <div className="meta-item">
                                <FaBook className="meta-icon" />
                                <span className="meta-label">ISBN:</span>
                                <span className="meta-value">{book.isbn}</span>
                            </div>

                            <div className="meta-item">
                                <FaBoxes className="meta-icon" />
                                <span className="meta-label">Availability:</span>
                                <span className={`meta-value availability ${isAvailable ? "available" : "unavailable"}`}>
                                    {book.availableQuantity} of {book.quantity} available
                                </span>
                            </div>

                            {book.purchaseDate && (
                                <div className="meta-item">
                                    <FaCalendar className="meta-icon" />
                                    <span className="meta-label">Added:</span>
                                    <span className="meta-value">
                                        {new Date(book.purchaseDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="book-description">
                            <h3>Description</h3>
                            <p>{book.description || "No description available."}</p>
                        </div>

                        <div className="book-actions">
                            <button
                                className={`borrow-button ${!isAvailable || borrowing ? "disabled" : ""}`}
                                onClick={handleBorrowBook}
                                disabled={!isAvailable || borrowing}
                            >
                                {borrowing ? "Processing..." : !isAvailable ? "Not Available" : "Borrow Book"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookDetail