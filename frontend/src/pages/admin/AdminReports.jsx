"use client"
import React from "react"

import { useState } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import "../../styles/AdminPages.css"
import "../../styles/AdminReports.css"

const AdminReports = ({ user, onLogout }) => {
  const [reportType, setReportType] = useState("daily")
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateReport = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:5000/api/borrows/reports?type=${reportType}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate report")
      }

      setReportData(data.data)
    } catch (error) {
      setError(error.message)
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="admin-page reports-page">
        <div className="page-header">
          <h1>Reports</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="report-controls">
          <div className="report-type-selector">
            <label>Report Type:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>

          <button className="generate-button" onClick={generateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {reportData && (
          <div className="report-container">
            <div className="report-header">
              <h2>
                {reportType === "daily" && "Daily Report"}
                {reportType === "weekly" && "Weekly Report"}
                {reportType === "monthly" && "Monthly Report"}
              </h2>
              <p>Generated on: {new Date().toLocaleString()}</p>
              <button className="print-button" onClick={handlePrint}>
                Print Report
              </button>
            </div>

            <div className="report-summary">
              <div className="summary-card">
                <h3>Books Borrowed</h3>
                <p className="summary-value">{reportData.statistics.totalBorrowed}</p>
              </div>

              <div className="summary-card">
                <h3>Books Returned</h3>
                <p className="summary-value">{reportData.statistics.totalReturned}</p>
              </div>

              <div className="summary-card">
                <h3>Overdue Books</h3>
                <p className="summary-value">{reportData.statistics.totalOverdue}</p>
              </div>

              <div className="summary-card">
                <h3>Total Fines Collected</h3>
                <p className="summary-value">Rs. {reportData.statistics.totalFines}</p>
              </div>
            </div>

            <div className="report-details">
              <h3>Borrow Transactions</h3>
              {reportData.borrows.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>User</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.borrows.map((borrow) => (
                      <tr key={borrow._id}>
                        <td>{borrow.book.title}</td>
                        <td>{borrow.user.name}</td>
                        <td>{formatDate(borrow.borrowDate)}</td>
                        <td>{formatDate(borrow.dueDate)}</td>
                        <td>{borrow.returnDate ? formatDate(borrow.returnDate) : "-"}</td>
                        <td>
                          <span className={`status-badge ${borrow.status}`}>{borrow.status}</span>
                        </td>
                        <td>{borrow.fine || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No transactions found for this period.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminReports
