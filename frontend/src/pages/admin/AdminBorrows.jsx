"use client"
import React from "react"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import BorrowForm from "../../components/admin/BorrowForm"
import Modal from "../../components/admin/Modal"
import ConfirmDialog from "../../components/admin/ConfirmDialog"
import "../../styles/AdminPages.css"

const AdminBorrows = ({ user, onLogout }) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialFilter = queryParams.get("filter") || "all"

  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(initialFilter)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [currentBorrow, setCurrentBorrow] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchBorrows = async () => {
    setLoading(true)
    try {
      let url = "http://localhost:5000/api/borrows"

      if (filter === "overdue") {
        url = "http://localhost:5000/api/borrows/overdue"
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch borrows")
      }

      let filteredBorrows = data.data

      // Apply client-side filtering if needed
      if (filter === "active") {
        filteredBorrows = filteredBorrows.filter((borrow) => borrow.status !== "returned")
      } else if (filter === "returned") {
        filteredBorrows = filteredBorrows.filter((borrow) => borrow.status === "returned")
      }

      setBorrows(filteredBorrows)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching borrows:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBorrows()
  }, [filter])

  const handleIssueBook = () => {
    setIsModalOpen(true)
  }

  const handleReturnBook = (borrow) => {
    setCurrentBorrow(borrow)
    setIsReturnDialogOpen(true)
  }

  const handleSubmitBorrow = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to issue book")
      }

      setSuccessMessage("Book issued successfully!")
      setIsModalOpen(false)
      fetchBorrows()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error issuing book:", error)
    }
  }

  const handleConfirmReturn = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/borrows/${currentBorrow._id}/return`, {
        method: "PUT",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to return book")
      }

      setSuccessMessage("Book returned successfully!")
      setIsReturnDialogOpen(false)
      fetchBorrows()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error returning book:", error)
    }
  }

  const calculateFine = (dueDate, returnDate = null) => {
    const due = new Date(dueDate)
    const returned = returnDate ? new Date(returnDate) : new Date()

    if (returned <= due) return 0

    const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24))
    // Assuming fine is Rs. 10 per day
    return daysLate * 10
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="admin-page">
        <div className="page-header">
          <h1>Borrow Management</h1>
          <button className="add-button" onClick={handleIssueBook}>
            Issue Book
          </button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="filter-tabs">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All Borrows
          </button>
          <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
            Active Borrows
          </button>
          <button className={filter === "overdue" ? "active" : ""} onClick={() => setFilter("overdue")}>
            Overdue
          </button>
          <button className={filter === "returned" ? "active" : ""} onClick={() => setFilter("returned")}>
            Returned
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading borrows...</div>
        ) : borrows.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrowed By</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine (Rs.)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id} className={borrow.status === "overdue" ? "overdue-row" : ""}>
                  <td>{borrow.book ? borrow.book.title : "Book N/A"}</td>
                  <td>{borrow.user ? borrow.user.name : "User N/A"}</td>
                  <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(borrow.dueDate).toLocaleDateString()}</td>
                  <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}</td>
                  <td>
                    <span className={`status-badge ${borrow.status}`}>{borrow.status}</span>
                  </td>
                  <td>{borrow.status === "returned" ? borrow.fine : calculateFine(borrow.dueDate)}</td>
                  <td className="actions-cell">
                    {borrow.status !== "returned" && (
                      <button className="return-button" onClick={() => handleReturnBook(borrow)}>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No borrows found.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Book">
        <BorrowForm onSubmit={handleSubmitBorrow} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        onConfirm={handleConfirmReturn}
        title="Confirm Return"
        message={`Are you sure you want to mark "${currentBorrow?.book?.title}" as returned?${
          calculateFine(currentBorrow?.dueDate) > 0
            ? ` A fine of Rs. ${calculateFine(currentBorrow?.dueDate)} will be applied.`
            : ""
        }`}
      />
    </AdminLayout>
  )
}

export default AdminBorrows
