"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/Books.css"

// Dummy data for books
const booksData = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    category: "Computer Science",
    quantity: 5,
    available: 3,
  },
  {
    id: 2,
    title: "Database Systems",
    author: "Ramez Elmasri",
    isbn: "9780133970777",
    category: "Computer Science",
    quantity: 3,
    available: 2,
  },
  {
    id: 3,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    isbn: "9780134610993",
    category: "Computer Science",
    quantity: 2,
    available: 1,
  },
  {
    id: 4,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    isbn: "9780132126953",
    category: "Computer Science",
    quantity: 4,
    available: 3,
  },
  {
    id: 5,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    isbn: "9781118063330",
    category: "Computer Science",
    quantity: 3,
    available: 2,
  },
  {
    id: 6,
    title: "Software Engineering",
    author: "Ian Sommerville",
    isbn: "9780133943030",
    category: "Computer Science",
    quantity: 2,
    available: 1,
  },
  {
    id: 7,
    title: "Computer Organization and Design",
    author: "David A. Patterson",
    isbn: "9780124077263",
    category: "Computer Science",
    quantity: 3,
    available: 3,
  },
  {
    id: 8,
    title: "Data Structures and Algorithms",
    author: "Alfred V. Aho",
    isbn: "9780201000238",
    category: "Computer Science",
    quantity: 4,
    available: 2,
  },
]

const Books = () => {
  const [books, setBooks] = useState(booksData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: 1,
  })

  // Get unique categories for filter
  const categories = ["All", ...new Set(books.map((book) => book.category))]

  // Filter books based on search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)

    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleAddBook = () => {
    setShowAddForm(true)
  }

  const handleNewBookChange = (e) => {
    const { name, value } = e.target
    setNewBook({
      ...newBook,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSubmitNewBook = (e) => {
    e.preventDefault()

    // Add new book to the list
    const newId = Math.max(...books.map((book) => book.id)) + 1
    const bookToAdd = {
      ...newBook,
      id: newId,
      available: newBook.quantity,
    }

    setBooks([...books, bookToAdd])

    // Reset form
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      category: "",
      quantity: 1,
    })

    setShowAddForm(false)
  }

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id))
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Books Management" />

        <div className="books-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />

            <select value={selectedCategory} onChange={handleCategoryChange} className="category-filter">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button className="add-book-btn" onClick={handleAddBook}>
            Add New Book
          </button>
        </div>

        {showAddForm && (
          <div className="add-book-form-container">
            <div className="add-book-form">
              <h2>Add New Book</h2>
              <form onSubmit={handleSubmitNewBook}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleNewBookChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleNewBookChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={newBook.isbn}
                    onChange={handleNewBookChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={newBook.category}
                    onChange={handleNewBookChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={newBook.quantity}
                    onChange={handleNewBookChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Add Book
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="books-table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th>ID</th>
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
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.category}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span className={book.available === 0 ? "not-available" : ""}>{book.available}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-books">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Books
