"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/Sidebar.css"

const AdminSidebar = () => {
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
        <Link to="/admin/dashboard" className={`menu-item ${isActive("/admin/dashboard") ? "active" : ""}`}>
          <span className="menu-icon">📊</span>
          <span className="menu-text">Dashboard</span>
        </Link>

        <Link to="/admin/books" className={`menu-item ${isActive("/admin/books") ? "active" : ""}`}>
          <span className="menu-icon">📚</span>
          <span className="menu-text">Books</span>
        </Link>

        <Link to="/admin/users" className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}>
          <span className="menu-icon">👥</span>
          <span className="menu-text">Users</span>
        </Link>

        <Link to="/admin/circulation" className={`menu-item ${isActive("/admin/circulation") ? "active" : ""}`}>
          <span className="menu-icon">🔄</span>
          <span className="menu-text">Circulation</span>
        </Link>

        <Link to="/admin/reports" className={`menu-item ${isActive("/admin/reports") ? "active" : ""}`}>
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

export default AdminSidebar
