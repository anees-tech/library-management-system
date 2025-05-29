"use client"
import React from "react"
import { FaEye } from "react-icons/fa"; 

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import BookForm from "../../components/admin/BookForm"
import Modal from "../../components/admin/Modal"
import ConfirmDialog from "../../components/admin/ConfirmDialog"
import "../../styles/AdminPages.css"

// Define or import book categories here
const bookCategories = [
  "Science", // "All" is usually for filtering, not for assigning to a book
  "English",
  "Math",
  "Classic",
  "Fiction",
  "History",
  "Technology",
  "Fantasy",
  "Biography",
  "Mystery",
  // Add more categories as needed
];


const AdminBooks = ({ user, onLogout }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  // New state for book borrows modal
  const [isViewBookBorrowsModalOpen, setIsViewBookBorrowsModalOpen] = useState(false);
  const [currentBookForBorrows, setCurrentBookForBorrows] = useState(null);
  const [bookBorrows, setBookBorrows] = useState([]);
  const [loadingBookBorrows, setLoadingBookBorrows] = useState(false);

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/books")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books")
      }

      setBooks(data.data)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBooks()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/books/search?query=${searchTerm}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to search books")
      }

      setBooks(data.data)
    } catch (error) {
      setError(error.message)
      console.error("Error searching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = () => {
    setCurrentBook(null)
    setIsModalOpen(true)
  }

  const handleEditBook = (book) => {
    setCurrentBook(book)
    setIsModalOpen(true)
  }

  const handleDeleteBook = (book) => {
    setCurrentBook(book)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitBook = async (formData) => {
    try {
      let response

      if (currentBook) {
        // Update existing book
        response = await fetch(`http://localhost:5000/api/books/${currentBook._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new book
        response = await fetch("http://localhost:5000/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save book")
      }

      setSuccessMessage(currentBook ? "Book updated successfully!" : "Book added successfully!")
      setIsModalOpen(false)
      fetchBooks()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error saving book:", error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${currentBook._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book")
      }

      setSuccessMessage("Book deleted successfully!")
      setIsDeleteDialogOpen(false)
      fetchBooks()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error deleting book:", error)
    }
  }

  // Function to fetch borrows for a specific book
  const fetchBookBorrows = async (bookId) => {
    setLoadingBookBorrows(true);
    setError(null); // Clear previous errors
    try {
      // Assuming your API can filter borrows by bookId, e.g., /api/borrows?bookId=THE_BOOK_ID
      // Or, if you fetch all borrows and filter client-side (less ideal for many borrows):
      // const response = await fetch(`http://localhost:5000/api/borrows`);
      const response = await fetch(`http://localhost:5000/api/borrows?bookId=${bookId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch borrow history for the book.");
      }
      // If filtering client-side:
      // setBookBorrows(data.data.filter(borrow => borrow.book._id === bookId));
      setBookBorrows(data.data); // Assuming backend filters
    } catch (err) {
      setError(err.message);
      setBookBorrows([]);
    } finally {
      setLoadingBookBorrows(false);
    }
  };

  // Handler to open the book borrows modal
  const handleViewBookBorrows = (book) => {
    setCurrentBookForBorrows(book);
    setIsViewBookBorrowsModalOpen(true);
    fetchBookBorrows(book._id);
  };


  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="admin-page">
        <div className="page-header">
          <h1>Books Management</h1>
          <button className="add-button" onClick={handleAddBook}>
            Add New Book
          </button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, author, ISBN or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm("")
                fetchBooks()
              }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Borrows in Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.quantity}</td>
                  <td>{book.availableQuantity}</td>
                  <td>{book.quantity - book.availableQuantity}</td>
                  <td className="actions-cell1">
                    <button className="edit-button" onClick={() => handleEditBook(book)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBook(book)}
                      disabled={book.quantity !== book.availableQuantity} // Keep your existing logic
                      title={book.quantity !== book.availableQuantity ? "Cannot delete book with borrowed copies" : ""}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No books found.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBook ? "Edit Book" : "Add New Book"}
      >
        <BookForm 
          book={currentBook} 
          onSubmit={handleSubmitBook} 
          onCancel={() => setIsModalOpen(false)}
          categories={bookCategories} // Pass categories to the form
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${currentBook?.title}"? This action cannot be undone.`}
      />

      {/* New Modal for Viewing Book Borrows */}
      <Modal
        isOpen={isViewBookBorrowsModalOpen}
        onClose={() => {
          setIsViewBookBorrowsModalOpen(false);
          setCurrentBookForBorrows(null);
          setBookBorrows([]); // Clear borrows when closing
        }}
        title={`Borrow History for: ${currentBookForBorrows?.title || 'Book'}`}
      >
        {loadingBookBorrows ? (
          <div className="loading">Loading borrow history...</div>
        ) : bookBorrows.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {bookBorrows.map((borrow) => (
                <tr key={borrow._id} className={borrow.status === "overdue" ? "overdue-row" : ""}>
                  <td>{borrow.user?.name || 'N/A'} ({borrow.user?.registrationNumber || 'N/A'})</td>
                  <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(borrow.dueDate).toLocaleDateString()}</td>
                  <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}</td>
                  <td>
                    <span className={`status-badge ${borrow.status}`}>{borrow.status}</span>
                  </td>
                  <td>{borrow.fine || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No borrow history found for this book.</div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default AdminBooks
