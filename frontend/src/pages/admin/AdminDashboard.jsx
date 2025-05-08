"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "../../styles/AdminDashboard.css"

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
  })
  const [recentBorrows, setRecentBorrows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch books
        const booksResponse = await fetch("http://localhost:5000/api/books")
        const booksData = await booksResponse.json()

        // Fetch users
        const usersResponse = await fetch("http://localhost:5000/api/users")
        const usersData = await usersResponse.json()

        // Fetch borrows
        const borrowsResponse = await fetch("http://localhost:5000/api/borrows")
        const borrowsData = await borrowsResponse.json()

        // Fetch overdue borrows
        const overdueResponse = await fetch("http://localhost:5000/api/borrows/overdue")
        const overdueData = await overdueResponse.json()

        // Calculate statistics
        const totalBooks = booksData.data.reduce((sum, book) => sum + book.quantity, 0)
        const availableBooks = booksData.data.reduce((sum, book) => sum + book.availableQuantity, 0)
        const activeBorrows = borrowsData.data.filter((borrow) => borrow.status !== "returned").length

        setStats({
          totalBooks,
          availableBooks,
          totalUsers: usersData.count,
          activeBorrows,
          overdueBorrows: overdueData.count,
        })

        // Get recent borrows (last 5)
        const sortedBorrows = [...borrowsData.data]
          .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
          .slice(0, 5)

        setRecentBorrows(sortedBorrows)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Books</h3>
                <p className="stat-value">{stats.totalBooks}</p>
                <Link to="/admin/books" className="stat-link">
                  Manage Books
                </Link>
              </div>

              <div className="stat-card">
                <h3>Available Books</h3>
                <p className="stat-value">{stats.availableBooks}</p>
                <p className="stat-info">{stats.totalBooks - stats.availableBooks} currently borrowed</p>
              </div>

              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
                <Link to="/admin/users" className="stat-link">
                  Manage Users
                </Link>
              </div>

              <div className="stat-card">
                <h3>Active Borrows</h3>
                <p className="stat-value">{stats.activeBorrows}</p>
                <Link to="/admin/borrows" className="stat-link">
                  Manage Borrows
                </Link>
              </div>

              <div className="stat-card overdue">
                <h3>Overdue Books</h3>
                <p className="stat-value">{stats.overdueBorrows}</p>
                <Link to="/admin/borrows?filter=overdue" className="stat-link">
                  View Overdue
                </Link>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Borrows</h2>
              {recentBorrows.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Borrowed By</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBorrows.map((borrow) => (
                      <tr key={borrow._id}>
                        <td>{borrow.book.title}</td>
                        <td>{borrow.user.name}</td>
                        <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                        <td>{new Date(borrow.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${borrow.status}`}>{borrow.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent borrows found.</p>
              )}
              <Link to="/admin/borrows" className="view-all-link">
                View All Borrows
              </Link>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <Link to="/admin/books" className="action-button">
                  Add New Book
                </Link>
                <Link to="/admin/borrows" className="action-button">
                  Issue Book
                </Link>
                <Link to="/admin/users" className="action-button">
                  Add New User
                </Link>
                <Link to="/admin/reports" className="action-button">
                  Generate Reports
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
