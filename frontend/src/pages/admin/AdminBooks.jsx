"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import BookForm from "../../components/admin/BookForm"
import Modal from "../../components/admin/Modal"
import ConfirmDialog from "../../components/admin/ConfirmDialog"
import "../../styles/AdminPages.css"

const AdminBooks = ({ user, onLogout }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

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
                  <td className="actions-cell">
                    <button className="edit-button" onClick={() => handleEditBook(book)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBook(book)}
                      // disabled={book.quantity !== book.availableQuantity}
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
        <BookForm book={currentBook} onSubmit={handleSubmitBook} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${currentBook?.title}"? This action cannot be undone.`}
      />
    </AdminLayout>
  )
}

export default AdminBooks
