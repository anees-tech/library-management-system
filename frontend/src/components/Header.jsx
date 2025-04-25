"use client"

import { useState } from "react"
import "../styles/Header.css"

const Header = ({ title, user }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <header className="header">
      <h1>{title}</h1>

      <div className="header-right">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button className="search-btn">🔍</button>
        </div>

        <div className="user-profile">
          <div className="profile-info" onClick={toggleDropdown}>
            <div className="profile-avatar">{user?.name?.charAt(0) || "U"}</div>
            <span className="profile-name">{user?.name || "User"}</span>
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <span className="dropdown-icon">👤</span>
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-icon">⚙️</span>
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div
                className="dropdown-item logout"
                onClick={() => {
                  localStorage.removeItem("user")
                  window.location.href = "/login"
                }}
              >
                <span className="dropdown-icon">🚪</span>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
