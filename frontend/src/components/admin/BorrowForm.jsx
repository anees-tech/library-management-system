"use client"
import React from "react"

import { useState, useEffect } from "react"
import "../../styles/AdminForms.css"

const BorrowForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    bookId: "",
    userId: "",
    dueDate: "",
  })
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books with available copies
        const booksResponse = await fetch("http://localhost:5000/api/books")
        const booksData = await booksResponse.json()
        const availableBooks = booksData.data.filter((book) => book.availableQuantity > 0)
        setBooks(availableBooks)

        // Fetch users
        const usersResponse = await fetch("http://localhost:5000/api/users")
        const usersData = await usersResponse.json()
        setUsers(usersData.data)

        // Set default due date (14 days from now)
        const defaultDueDate = new Date()
        defaultDueDate.setDate(defaultDueDate.getDate() + 14)
        setFormData((prev) => ({
          ...prev,
          dueDate: defaultDueDate.toISOString().split("T")[0],
        }))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setFetchingData(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.bookId) newErrors.bookId = "Book is required"
    if (!formData.userId) newErrors.userId = "User is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"

    const selectedDate = new Date(formData.dueDate)
    const today = new Date()
    if (selectedDate <= today) {
      newErrors.dueDate = "Due date must be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return <div className="loading">Loading form data...</div>
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Issue Book</h2>

      <div className="form-group">
        <label htmlFor="bookId">Book</label>
        <select id="bookId" name="bookId" value={formData.bookId} onChange={handleChange}>
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} by {book.author} (Available: {book.availableQuantity})
            </option>
          ))}
        </select>
        {errors.bookId && <span className="error">{errors.bookId}</span>}
        {books.length === 0 && <span className="info">No books available for borrowing</span>}
      </div>

      <div className="form-group">
        <label htmlFor="userId">User</label>
        <select id="userId" name="userId" value={formData.userId} onChange={handleChange}>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.registrationNumber})
            </option>
          ))}
        </select>
        {errors.userId && <span className="error">{errors.userId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Issuing..." : "Issue Book"}
        </button>
      </div>
    </form>
  )
}

export default BorrowForm
