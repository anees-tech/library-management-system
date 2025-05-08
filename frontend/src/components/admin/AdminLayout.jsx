"use client"

import { Link, useLocation } from "react-router-dom"
import "../../styles/AdminLayout.css"

const AdminLayout = ({ user, onLogout, children }) => {
  const location = useLocation()

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Library Management System</h1>
        <div className="user-info">
          <span>Admin: {user.name}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li className={location.pathname === "/admin" ? "active" : ""}>
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className={location.pathname === "/admin/books" ? "active" : ""}>
                <Link to="/admin/books">Books Management</Link>
              </li>
              <li className={location.pathname === "/admin/borrows" ? "active" : ""}>
                <Link to="/admin/borrows">Borrow Management</Link>
              </li>
              <li className={location.pathname === "/admin/users" ? "active" : ""}>
                <Link to="/admin/users">User Management</Link>
              </li>
              <li className={location.pathname === "/admin/reports" ? "active" : ""}>
                <Link to="/admin/reports">Reports</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
