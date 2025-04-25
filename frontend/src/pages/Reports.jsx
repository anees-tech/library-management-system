"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/Reports.css"

// Dummy data for reports
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
]

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
]

const Reports = () => {
  const [reportType, setReportType] = useState("overdue")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [generatedReport, setGeneratedReport] = useState(null)

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value)
    setGeneratedReport(null)
  }

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value,
    })
  }

  const generateReport = () => {
    let reportData = []
    let reportTitle = ""

    switch (reportType) {
      case "overdue":
        reportTitle = "Overdue Books Report"
        reportData = circulationData.filter(
          (record) => record.status === "Issued" && new Date(record.dueDate) < new Date(),
        )
        break

      case "issued":
        reportTitle = "Currently Issued Books Report"
        reportData = circulationData.filter((record) => record.status === "Issued")
        break

      case "returned":
        reportTitle = "Returned Books Report"
        reportData = circulationData.filter(
          (record) =>
            record.status === "Returned" &&
            new Date(record.returnDate) >= new Date(dateRange.startDate) &&
            new Date(record.returnDate) <= new Date(dateRange.endDate),
        )
        break

      case "fines":
        reportTitle = "Fines Collected Report"
        reportData = circulationData.filter(
          (record) =>
            record.status === "Returned" &&
            record.fine > 0 &&
            new Date(record.returnDate) >= new Date(dateRange.startDate) &&
            new Date(record.returnDate) <= new Date(dateRange.endDate),
        )
        break

      case "inventory":
        reportTitle = "Book Inventory Report"
        reportData = booksData
        break

      case "users":
        reportTitle = "Users Report"
        reportData = usersData
        break

      default:
        reportTitle = "No Report Selected"
        reportData = []
    }

    setGeneratedReport({
      title: reportTitle,
      data: reportData,
      type: reportType,
      generatedAt: new Date().toLocaleString(),
      dateRange: dateRange,
    })
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Reports" />

        <div className="reports-controls">
          <div className="report-options">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select id="reportType" value={reportType} onChange={handleReportTypeChange}>
                <option value="overdue">Overdue Books</option>
                <option value="issued">Currently Issued Books</option>
                <option value="returned">Returned Books</option>
                <option value="fines">Fines Collected</option>
                <option value="inventory">Book Inventory</option>
                <option value="users">Users Report</option>
              </select>
            </div>

            {(reportType === "returned" || reportType === "fines") && (
              <div className="date-range">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
              </div>
            )}

            <button className="generate-btn" onClick={generateReport}>
              Generate Report
            </button>
          </div>
        </div>

        {generatedReport && (
          <div className="report-container">
            <div className="report-header">
              <h2>{generatedReport.title}</h2>
              <div className="report-meta">
                <p>
                  <strong>Generated:</strong> {generatedReport.generatedAt}
                </p>
                {(generatedReport.type === "returned" || generatedReport.type === "fines") && (
                  <p>
                    <strong>Date Range:</strong> {generatedReport.dateRange.startDate} to{" "}
                    {generatedReport.dateRange.endDate}
                  </p>
                )}
              </div>
              <button className="print-btn" onClick={printReport}>
                Print Report
              </button>
            </div>

            <div className="report-content">
              {generatedReport.type === "overdue" ||
              generatedReport.type === "issued" ||
              generatedReport.type === "returned" ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Book Title</th>
                      <th>Borrowed By</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      {generatedReport.type === "returned" && <th>Return Date</th>}
                      {generatedReport.type === "returned" && <th>Fine (Rs.)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.data.length > 0 ? (
                      generatedReport.data.map((record) => (
                        <tr key={record.id} className={generatedReport.type === "overdue" ? "overdue" : ""}>
                          <td>{record.id}</td>
                          <td>{record.bookTitle}</td>
                          <td>{record.userName}</td>
                          <td>{record.issueDate}</td>
                          <td>{record.dueDate}</td>
                          {generatedReport.type === "returned" && <td>{record.returnDate}</td>}
                          {generatedReport.type === "returned" && (
                            <td>{record.fine > 0 ? `Rs. ${record.fine}` : "-"}</td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={generatedReport.type === "returned" ? 7 : 5} className="no-data">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : generatedReport.type === "fines" ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Book Title</th>
                      <th>Borrowed By</th>
                      <th>Return Date</th>
                      <th>Fine (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.data.length > 0 ? (
                      generatedReport.data.map((record) => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{record.bookTitle}</td>
                          <td>{record.userName}</td>
                          <td>{record.returnDate}</td>
                          <td>Rs. {record.fine}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {generatedReport.data.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="total-label">
                          Total Fines Collected:
                        </td>
                        <td className="total-value">
                          Rs. {generatedReport.data.reduce((total, record) => total + record.fine, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              ) : generatedReport.type === "inventory" ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>ISBN</th>
                      <th>Category</th>
                      <th>Total Quantity</th>
                      <th>Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.data.length > 0 ? (
                      generatedReport.data.map((book) => (
                        <tr key={book.id}>
                          <td>{book.id}</td>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>{book.isbn}</td>
                          <td>{book.category}</td>
                          <td>{book.quantity}</td>
                          <td>{book.available}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="no-data">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {generatedReport.data.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan="5" className="total-label">
                          Total Books:
                        </td>
                        <td>{generatedReport.data.reduce((total, book) => total + book.quantity, 0)}</td>
                        <td>{generatedReport.data.reduce((total, book) => total + book.available, 0)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              ) : generatedReport.type === "users" ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Registration No</th>
                      <th>Type</th>
                      <th>Books Issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.data.length > 0 ? (
                      generatedReport.data.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.regNo}</td>
                          <td>{user.type}</td>
                          <td>{user.booksIssued}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {generatedReport.data.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="total-label">
                          Total Users:
                        </td>
                        <td>{generatedReport.data.length}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              ) : (
                <div className="no-report">No report data available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
