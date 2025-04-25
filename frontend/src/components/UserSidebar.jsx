"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/Sidebar.css"

const UserSidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">LMS</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-menu">
        <Link to="/user/dashboard" className={`menu-item ${isActive("/user/dashboard") ? "active" : ""}`}>
          <span className="menu-icon">📊</span>
          <span className="menu-text">Dashboard</span>
        </Link>

        <Link to="/user/books" className={`menu-item ${isActive("/user/books") ? "active" : ""}`}>
          <span className="menu-icon">📚</span>
          <span className="menu-text">Browse Books</span>
        </Link>

        <Link to="/user/issued" className={`menu-item ${isActive("/user/issued") ? "active" : ""}`}>
          <span className="menu-icon">📖</span>
          <span className="menu-text">My Books</span>
        </Link>

        <Link to="/user/history" className={`menu-item ${isActive("/user/history") ? "active" : ""}`}>
          <span className="menu-icon">🔄</span>
          <span className="menu-text">History</span>
        </Link>

        <Link to="/user/profile" className={`menu-item ${isActive("/user/profile") ? "active" : ""}`}>
          <span className="menu-icon">👤</span>
          <span className="menu-text">Profile</span>
        </Link>
      </div>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user")
            window.location.href = "/login"
          }}
        >
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default UserSidebar
