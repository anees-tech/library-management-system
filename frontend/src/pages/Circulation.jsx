"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/Circulation.css"

// Dummy data for circulation records
const circulationData = [
  {
    id: 1,
    bookId: 1,
    bookTitle: "Introduction to Algorithms",
    userId: 1,
    userName: "Touseeq Ahsan",
    issueDate: "2025-04-15",
    dueDate: "2025-04-29",
    returnDate: null,
    status: "Issued",
    fine: 0,
  },
  {
    id: 2,
    bookId: 2,
    bookTitle: "Database Systems",
    userId: 3,
    userName: "Tayyba Noreen",
    issueDate: "2025-04-10",
    dueDate: "2025-04-24",
    returnDate: "2025-04-23",
    status: "Returned",
    fine: 0,
  },
  {
    id: 3,
    bookId: 5,
    bookTitle: "Operating System Concepts",
    userId: 4,
    userName: "Dr. Aisha Khan",
    issueDate: "2025-04-05",
    dueDate: "2025-04-19",
    returnDate: "2025-04-20",
    status: "Returned",
    fine: 10,
  },
  {
    id: 4,
    bookId: 3,
    bookTitle: "Artificial Intelligence: A Modern Approach",
    userId: 4,
    userName: "Dr. Aisha Khan",
    issueDate: "2025-04-20",
    dueDate: "2025-05-04",
    returnDate: null,
    status: "Issued",
    fine: 0,
  },
  {
    id: 5,
    bookId: 4,
    bookTitle: "Computer Networks",
    userId: 1,
    userName: "Touseeq Ahsan",
    issueDate: "2025-04-21",
    dueDate: "2025-05-05",
    returnDate: null,
    status: "Issued",
    fine: 0,
  },
]

// Dummy data for books and users (for issue book form)
const booksData = [
  { id: 1, title: "Introduction to Algorithms", available: 3 },
  { id: 2, title: "Database Systems", available: 2 },
  { id: 3, title: "Artificial Intelligence: A Modern Approach", available: 1 },
  { id: 4, title: "Computer Networks", available: 3 },
  { id: 5, title: "Operating System Concepts", available: 2 },
  { id: 6, title: "Software Engineering", available: 1 },
  { id: 7, title: "Computer Organization and Design", available: 3 },
  { id: 8, title: "Data Structures and Algorithms", available: 2 },
]

const usersData = [
  { id: 1, name: "Touseeq Ahsan", regNo: "2021-GCUF-056622" },
  { id: 2, name: "Nimra Mustafa", regNo: "2021-GCUF-056623" },
  { id: 3, name: "Tayyba Noreen", regNo: "2021-GCUF-056624" },
  { id: 4, name: "Dr. Aisha Khan", regNo: "STAFF-001" },
  { id: 5, name: "Prof. Muhammad Ali", regNo: "STAFF-002" },
]

const Circulation = () => {
  const [records, setRecords] = useState(circulationData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [issueData, setIssueData] = useState({
    bookId: "",
    userId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })
  const [returnData, setReturnData] = useState({
    recordId: "",
    returnDate: new Date().toISOString().split("T")[0],
    fine: 0,
  })

  // Get unique statuses for filter
  const statuses = ["All", ...new Set(records.map((record) => record.status))]

  // Filter records based on search term and status
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  const handleIssueBook = () => {
    setShowIssueForm(true)
    setShowReturnForm(false)
  }

  const handleReturnBook = () => {
    setShowReturnForm(true)
    setShowIssueForm(false)
  }

  const handleIssueDataChange = (e) => {
    const { name, value } = e.target
    setIssueData({
      ...issueData,
      [name]: value,
    })
  }

  const handleReturnDataChange = (e) => {
    const { name, value } = e.target
    setReturnData({
      ...returnData,
      [name]: name === "fine" ? Number.parseFloat(value) || 0 : value,
    })

    // If a record is selected, calculate fine based on due date
    if (name === "recordId" && value) {
      const record = records.find((r) => r.id === Number.parseInt(value))
      if (record) {
        const dueDate = new Date(record.dueDate)
        const returnDate = new Date(returnData.returnDate)
        const diffTime = returnDate - dueDate
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // If return date is after due date, calculate fine (Rs. 10 per day)
        const fine = diffDays > 0 ? diffDays * 10 : 0

        setReturnData({
          ...returnData,
          recordId: value,
          fine: fine,
        })
      }
    }
  }

  const handleSubmitIssue = (e) => {
    e.preventDefault()

    // Get book and user details
    const book = booksData.find((b) => b.id === Number.parseInt(issueData.bookId))
    const user = usersData.find((u) => u.id === Number.parseInt(issueData.userId))

    if (!book || !user) {
      alert("Please select valid book and user")
      return
    }

    // Add new circulation record
    const newId = Math.max(...records.map((record) => record.id)) + 1
    const newRecord = {
      id: newId,
      bookId: Number.parseInt(issueData.bookId),
      bookTitle: book.title,
      userId: Number.parseInt(issueData.userId),
      userName: user.name,
      issueDate: issueData.issueDate,
      dueDate: issueData.dueDate,
      returnDate: null,
      status: "Issued",
      fine: 0,
    }

    setRecords([...records, newRecord])

    // Reset form
    setIssueData({
      bookId: "",
      userId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })

    setShowIssueForm(false)
  }

  const handleSubmitReturn = (e) => {
    e.preventDefault()

    const recordId = Number.parseInt(returnData.recordId)
    const record = records.find((r) => r.id === recordId)

    if (!record) {
      alert("Please select a valid record")
      return
    }

    // Update the record
    const updatedRecords = records.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          returnDate: returnData.returnDate,
          status: "Returned",
          fine: returnData.fine,
        }
      }
      return r
    })

    setRecords(updatedRecords)

    // Reset form
    setReturnData({
      recordId: "",
      returnDate: new Date().toISOString().split("T")[0],
      fine: 0,
    })

    setShowReturnForm(false)
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Circulation Management" />

        <div className="circulation-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by book title or user name..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />

            <select value={selectedStatus} onChange={handleStatusChange} className="status-filter">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="circulation-buttons">
            <button className="issue-btn" onClick={handleIssueBook}>
              Issue Book
            </button>
            <button className="return-btn" onClick={handleReturnBook}>
              Return Book
            </button>
          </div>
        </div>

        {showIssueForm && (
          <div className="form-container">
            <div className="issue-form">
              <h2>Issue Book</h2>
              <form onSubmit={handleSubmitIssue}>
                <div className="form-group">
                  <label htmlFor="bookId">Select Book</label>
                  <select id="bookId" name="bookId" value={issueData.bookId} onChange={handleIssueDataChange} required>
                    <option value="">-- Select Book --</option>
                    {booksData
                      .filter((book) => book.available > 0)
                      .map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} (Available: {book.available})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="userId">Select User</label>
                  <select id="userId" name="userId" value={issueData.userId} onChange={handleIssueDataChange} required>
                    <option value="">-- Select User --</option>
                    {usersData.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.regNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="issueDate">Issue Date</label>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={issueData.issueDate}
                    onChange={handleIssueDataChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={issueData.dueDate}
                    onChange={handleIssueDataChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Issue Book
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowIssueForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReturnForm && (
          <div className="form-container">
            <div className="return-form">
              <h2>Return Book</h2>
              <form onSubmit={handleSubmitReturn}>
                <div className="form-group">
                  <label htmlFor="recordId">Select Book to Return</label>
                  <select
                    id="recordId"
                    name="recordId"
                    value={returnData.recordId}
                    onChange={handleReturnDataChange}
                    required
                  >
                    <option value="">-- Select Book --</option>
                    {records
                      .filter((record) => record.status === "Issued")
                      .map((record) => (
                        <option key={record.id} value={record.id}>
                          {record.bookTitle} (Borrowed by: {record.userName}, Due: {record.dueDate})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="returnDate">Return Date</label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={returnData.returnDate}
                    onChange={handleReturnDataChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fine">Fine (Rs.)</label>
                  <input
                    type="number"
                    id="fine"
                    name="fine"
                    min="0"
                    step="0.01"
                    value={returnData.fine}
                    onChange={handleReturnDataChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Return Book
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowReturnForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="circulation-table-container">
          <table className="circulation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Borrowed By</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className={record.status === "Issued" && new Date(record.dueDate) < new Date() ? "overdue" : ""}
                  >
                    <td>{record.id}</td>
                    <td>{record.bookTitle}</td>
                    <td>{record.userName}</td>
                    <td>{record.issueDate}</td>
                    <td>{record.dueDate}</td>
                    <td>{record.returnDate || "-"}</td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                    </td>
                    <td>{record.fine > 0 ? `Rs. ${record.fine}` : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-records">
                    No records found
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

export default Circulation
