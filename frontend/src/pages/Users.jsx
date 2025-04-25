"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/Users.css"

// Dummy data for users
const usersData = [
  {
    id: 1,
    name: "Touseeq Ahsan",
    regNo: "2021-GCUF-056622",
    collegeRollNo: "63",
    universityRollNo: "662463",
    contact: "0318-7583489",
    type: "Student",
    booksIssued: 1,
  },
  {
    id: 2,
    name: "Nimra Mustafa",
    regNo: "2021-GCUF-056623",
    collegeRollNo: "64",
    universityRollNo: "662464",
    contact: "0310-1732253",
    type: "Student",
    booksIssued: 0,
  },
  {
    id: 3,
    name: "Tayyba Noreen",
    regNo: "2021-GCUF-056624",
    collegeRollNo: "22",
    universityRollNo: "662422",
    contact: "0334-6108949",
    type: "Student",
    booksIssued: 1,
  },
  {
    id: 4,
    name: "Dr. Aisha Khan",
    regNo: "STAFF-001",
    collegeRollNo: "-",
    universityRollNo: "-",
    contact: "0300-1234567",
    type: "Staff",
    booksIssued: 2,
  },
  {
    id: 5,
    name: "Prof. Muhammad Ali",
    regNo: "STAFF-002",
    collegeRollNo: "-",
    universityRollNo: "-",
    contact: "0321-9876543",
    type: "Staff",
    booksIssued: 0,
  },
]

const Users = () => {
  const [users, setUsers] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    regNo: "",
    collegeRollNo: "",
    universityRollNo: "",
    contact: "",
    type: "Student",
  })

  // Get unique user types for filter
  const userTypes = ["All", ...new Set(users.map((user) => user.type))]

  // Filter users based on search term and type
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact.includes(searchTerm)

    const matchesType = selectedType === "All" || user.type === selectedType

    return matchesSearch && matchesType
  })

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value)
  }

  const handleAddUser = () => {
    setShowAddForm(true)
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser({
      ...newUser,
      [name]: value,
    })
  }

  const handleSubmitNewUser = (e) => {
    e.preventDefault()

    // Add new user to the list
    const newId = Math.max(...users.map((user) => user.id)) + 1
    const userToAdd = {
      ...newUser,
      id: newId,
      booksIssued: 0,
    }

    setUsers([...users, userToAdd])

    // Reset form
    setNewUser({
      name: "",
      regNo: "",
      collegeRollNo: "",
      universityRollNo: "",
      contact: "",
      type: "Student",
    })

    setShowAddForm(false)
  }

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Users Management" />

        <div className="users-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name, registration number, or contact..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />

            <select value={selectedType} onChange={handleTypeChange} className="type-filter">
              {userTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button className="add-user-btn" onClick={handleAddUser}>
            Add New User
          </button>
        </div>

        {showAddForm && (
          <div className="add-user-form-container">
            <div className="add-user-form">
              <h2>Add New User</h2>
              <form onSubmit={handleSubmitNewUser}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regNo">Registration Number</label>
                  <input
                    type="text"
                    id="regNo"
                    name="regNo"
                    value={newUser.regNo}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="collegeRollNo">College Roll Number</label>
                  <input
                    type="text"
                    id="collegeRollNo"
                    name="collegeRollNo"
                    value={newUser.collegeRollNo}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="universityRollNo">University Roll Number</label>
                  <input
                    type="text"
                    id="universityRollNo"
                    name="universityRollNo"
                    value={newUser.universityRollNo}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contact Number</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={newUser.contact}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">User Type</label>
                  <select id="type" name="type" value={newUser.type} onChange={handleNewUserChange} required>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Add User
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Registration No</th>
                <th>College Roll No</th>
                <th>University Roll No</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Books Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.regNo}</td>
                    <td>{user.collegeRollNo}</td>
                    <td>{user.universityRollNo}</td>
                    <td>{user.contact}</td>
                    <td>{user.type}</td>
                    <td>
                      <span className={user.booksIssued > 0 ? "has-books" : ""}>{user.booksIssued}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-users">
                    No users found
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

export default Users
