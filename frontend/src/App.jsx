"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminBooks from "./pages/admin/AdminBooks"
import AdminBorrows from "./pages/admin/AdminBorrows"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminReports from "./pages/admin/AdminReports"
import AuthRoute from "./components/AuthRoute" // Import the AuthRoute component
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Check if user is admin
  const isAdmin = user && user.role === "admin"

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login onLogin={handleLogin} /> {/* Replace setIsAuthenticated with onLogin */}
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={user ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Signup onLogin={handleLogin} />}
        />

        {/* Student/Staff Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/books"
          element={isAdmin ? <AdminBooks user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/borrows"
          element={isAdmin ? <AdminBorrows user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <AdminUsers user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/reports"
          element={isAdmin ? <AdminReports user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route path="/" element={<Navigate to={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
