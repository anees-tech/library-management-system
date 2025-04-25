"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/Sidebar.css"

const Sidebar = () => {
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
        <Link to="/" className={`menu-item ${isActive("/") ? "active" : ""}`}>
          <span className="menu-icon">📊</span>
          <span className="menu-text">Dashboard</span>
        </Link>

        <Link to="/books" className={`menu-item ${isActive("/books") ? "active" : ""}`}>
          <span className="menu-icon">📚</span>
          <span className="menu-text">Books</span>
        </Link>

        <Link to="/users" className={`menu-item ${isActive("/users") ? "active" : ""}`}>
          <span className="menu-icon">👥</span>
          <span className="menu-text">Users</span>
        </Link>

        <Link to="/circulation" className={`menu-item ${isActive("/circulation") ? "active" : ""}`}>
          <span className="menu-icon">🔄</span>
          <span className="menu-text">Circulation</span>
        </Link>

        <Link to="/reports" className={`menu-item ${isActive("/reports") ? "active" : ""}`}>
          <span className="menu-icon">📝</span>
          <span className="menu-text">Reports</span>
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

export default Sidebar
