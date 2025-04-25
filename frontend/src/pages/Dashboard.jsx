"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/Dashboard.css"

// Dummy data
const dashboardStats = {
  totalBooks: 1245,
  booksIssued: 78,
  totalUsers: 356,
  overdueBooks: 12,
}

const recentActivities = [
  { id: 1, action: "Book Borrowed", user: "Nimra Mustafa", book: "Introduction to Algorithms", date: "2025-04-24" },
  { id: 2, action: "Book Returned", user: "Tayyba Noreen", book: "Database Systems", date: "2025-04-23" },
  {
    id: 3,
    action: "New Book Added",
    user: "Admin",
    book: "Artificial Intelligence: A Modern Approach",
    date: "2025-04-22",
  },
  { id: 4, action: "Book Borrowed", user: "Touseeq Ahsan", book: "Computer Networks", date: "2025-04-21" },
  { id: 5, action: "Fine Collected", user: "Admin", book: "Operating System Concepts", date: "2025-04-20" },
]

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Dashboard" user={user} />

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon books-icon">📚</div>
            <div className="stat-details">
              <h3>Total Books</h3>
              <p>{dashboardStats.totalBooks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon issued-icon">📖</div>
            <div className="stat-details">
              <h3>Books Issued</h3>
              <p>{dashboardStats.booksIssued}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p>{dashboardStats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon overdue-icon">⏰</div>
            <div className="stat-details">
              <h3>Overdue Books</h3>
              <p>{dashboardStats.overdueBooks}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section recent-activities">
            <h2>Recent Activities</h2>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-details">
                    <h4>{activity.action}</h4>
                    <p>
                      <strong>User:</strong> {activity.user}
                    </p>
                    <p>
                      <strong>Book:</strong> {activity.book}
                    </p>
                    <p>
                      <strong>Date:</strong> {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/books/add" className="action-button">
                <span>Add New Book</span>
              </Link>
              <Link to="/users/add" className="action-button">
                <span>Add New User</span>
              </Link>
              <Link to="/circulation/issue" className="action-button">
                <span>Issue Book</span>
              </Link>
              <Link to="/circulation/return" className="action-button">
                <span>Return Book</span>
              </Link>
              <Link to="/reports" className="action-button">
                <span>Generate Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
