"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  FaUsers, 
  FaBook, 
  FaNewspaper, 
  FaBookOpen,  // Changed from FaMagazine to FaBookOpen
  FaCheckCircle, 
  FaUndo, 
  FaExclamationCircle,
  FaEye
} from "react-icons/fa"
import AdminSidebar from "../../components/admin/AdminSidebar"
import "../../styles/AdminDashboard.css"

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
    totalNewspapers: 7, // Default/placeholder values
    totalMagazines: 4,  // Default/placeholder values
    issuedBooks: 0,
    returnedBooks: 0,
    notReturnedBooks: 0
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
        const issuedBooks = borrowsData.data.length
        const returnedBooks = borrowsData.data.filter((borrow) => borrow.status === "returned").length
        const notReturnedBooks = issuedBooks - returnedBooks

        setStats({
          totalBooks,
          availableBooks,
          totalUsers: usersData.count,
          activeBorrows,
          overdueBorrows: overdueData.count,
          totalNewspapers: 7, // You can replace with actual API data when available
          totalMagazines: 4, // You can replace with actual API data when available
          issuedBooks,
          returnedBooks,
          notReturnedBooks
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
    <div className="admin-container">
      <AdminSidebar user={user} onLogout={onLogout} />
      
      <div className="admin-content">
        <header className="admin-header">
          <h1>Control Panel</h1>
          <div className="admin-header-right">
            <span className="admin-greeting">Admin</span>
            <span className="separator">›</span>
            <span className="current-section">Dashboard</span>
          </div>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Top Row - First set of stats */}
            <div className="stats-row">
              <div className="stat-card green">
                <div className="stat-info">
                  <div className="stat-number">{stats.totalUsers}</div>
                  <div className="stat-label">Registered Members</div>
                </div>
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/users">View More <FaEye /></Link>
                </div>
              </div>

              <div className="stat-card blue">
                <div className="stat-info">
                  <div className="stat-number">{stats.totalBooks}</div>
                  <div className="stat-label">Total Books</div>
                </div>
                <div className="stat-icon">
                  <FaBook />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/books">View More <FaEye /></Link>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-info">
                  <div className="stat-number">{stats.totalNewspapers}</div>
                  <div className="stat-label">Available Newspapers</div>
                </div>
                <div className="stat-icon">
                  <FaNewspaper />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/newspapers">View More <FaEye /></Link>
                </div>
              </div>

              <div className="stat-card red">
                <div className="stat-info">
                  <div className="stat-number">{stats.totalMagazines}</div>
                  <div className="stat-label">Available Magazines</div>
                </div>
                <div className="stat-icon">
                  <FaBookOpen /> {/* Update this line in your component */}
                </div>
                <div className="stat-footer">
                  <Link to="/admin/magazines">View More <FaEye /></Link>
                </div>
              </div>
            </div>

            {/* Bottom Row - Second set of stats */}
            <div className="stats-row">
              <div className="stat-card orange">
                <div className="stat-info">
                  <div className="stat-number">{stats.issuedBooks}</div>
                  <div className="stat-label">Total Issued Books</div>
                </div>
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/borrows">View More <FaEye /></Link>
                </div>
              </div>

              <div className="stat-card navy">
                <div className="stat-info">
                  <div className="stat-number">{stats.returnedBooks}</div>
                  <div className="stat-label">Total Returned Books</div>
                </div>
                <div className="stat-icon">
                  <FaUndo />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/borrows?filter=returned">View More <FaEye /></Link>
                </div>
              </div>

              <div className="stat-card coral">
                <div className="stat-info">
                  <div className="stat-number">{stats.notReturnedBooks}</div>
                  <div className="stat-label">Not-Returned Books</div>
                </div>
                <div className="stat-icon">
                  <FaExclamationCircle />
                </div>
                <div className="stat-footer">
                  <Link to="/admin/borrows?filter=not-returned">View More <FaEye /></Link>
                </div>
              </div>
            </div>

            {/* You can keep the recent activity section if desired */}
            {recentBorrows.length > 0 && (
              <div className="recent-activity">
                <h2>Recent Borrows</h2>
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
                <Link to="/admin/borrows" className="view-all-link">
                  View All Borrows
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
