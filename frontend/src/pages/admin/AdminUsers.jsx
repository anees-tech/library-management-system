"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import UserForm from "../../components/admin/UserForm"
import Modal from "../../components/admin/Modal"
import ConfirmDialog from "../../components/admin/ConfirmDialog"
import "../../styles/AdminPages.css"

const AdminUsers = ({ user, onLogout }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewBorrowsModalOpen, setIsViewBorrowsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userBorrows, setUserBorrows] = useState([])
  const [loadingBorrows, setLoadingBorrows] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/users")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users")
      }

      setUsers(data.data)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchUsers()
      return
    }

    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setUsers(filteredUsers)
  }

  const handleAddUser = () => {
    setCurrentUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleViewBorrows = async (user) => {
    setCurrentUser(user)
    setLoadingBorrows(true)
    setIsViewBorrowsModalOpen(true)

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/borrows`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user borrows")
      }

      setUserBorrows(data.data)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching user borrows:", error)
    } finally {
      setLoadingBorrows(false)
    }
  }

  const handleSubmitUser = async (formData) => {
    try {
      let response

      if (currentUser) {
        // Update existing user
        response = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new user
        response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save user")
      }

      setSuccessMessage(currentUser ? "User updated successfully!" : "User added successfully!")
      setIsModalOpen(false)
      fetchUsers()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error saving user:", error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user")
      }

      setSuccessMessage("User deleted successfully!")
      setIsDeleteDialogOpen(false)
      fetchUsers()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setError(error.message)
      console.error("Error deleting user:", error)
    }
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="admin-page">
        <div className="page-header">
          <h1>User Management</h1>
          <button className="add-button" onClick={handleAddUser}>
            Add New User
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
            placeholder="Search by name, email or registration number..."
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
                fetchUsers()
              }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registration No.</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>{userItem.registrationNumber}</td>
                  <td>
                    <span className={`role-badge ${userItem.role}`}>{userItem.role}</span>
                  </td>
                  <td>{userItem.contactNumber || "-"}</td>
                  <td className="actions-cell">
                    <button className="view-button" onClick={() => handleViewBorrows(userItem)}>
                      Borrows
                    </button>
                    <button className="edit-button" onClick={() => handleEditUser(userItem)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteUser(userItem)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No users found.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? "Edit User" : "Add New User"}
      >
        <UserForm user={currentUser} onSubmit={handleSubmitUser} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isViewBorrowsModalOpen}
        onClose={() => setIsViewBorrowsModalOpen(false)}
        title={`Borrow History: ${currentUser?.name}`}
      >
        {loadingBorrows ? (
          <div className="loading">Loading borrow history...</div>
        ) : userBorrows.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {userBorrows.map((borrow) => (
                <tr key={borrow._id}>
                  <td>{borrow.book.title}</td>
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
          <div className="no-data">No borrow history found for this user.</div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete user "${currentUser?.name}"? This action cannot be undone.`}
      />
    </AdminLayout>
  )
}

export default AdminUsers
