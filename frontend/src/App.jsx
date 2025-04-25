"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import Books from "./pages/Books"
import Users from "./pages/Users"
import Circulation from "./pages/Circulation"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setIsAuthenticated(true)
      setUserRole(userData.role)
    }
  }, [])

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    if (userRole !== "admin") {
      return <Navigate to="/user/dashboard" />
    }
    return children
  }

  const UserRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    if (userRole !== "user") {
      return <Navigate to="/admin/dashboard" />
    }
    return children
  }

  const AuthRoute = ({ children }) => {
    if (isAuthenticated) {
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" />
      } else {
        return <Navigate to="/user/dashboard" />
      }
    }
    return children
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <Books />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/circulation"
          element={
            <AdminRoute>
              <Circulation />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        {/* Default Routes */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? (userRole === "admin" ? "/admin/dashboard" : "/user/dashboard") : "/login"}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
