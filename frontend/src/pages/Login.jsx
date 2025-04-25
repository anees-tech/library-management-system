"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../api/axios"
import "../styles/Auth.css"

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user", // Default to user login
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Determine which endpoint to use based on user type
      const endpoint = `/auth/${formData.userType}/login`

      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      })

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...response.data.user,
            userType: formData.userType,
          }),
        )

        setIsAuthenticated(true)

        // Redirect based on user type
        if (formData.userType === "admin") {
          navigate("/admin/dashboard")
        } else {
          navigate("/user/dashboard")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Library Management System</h1>
          <h2>Login</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userType">Login As</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="auth-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
