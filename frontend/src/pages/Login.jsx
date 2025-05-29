"use client"
import React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Auth.css"
import "../styles/LoginNew.css"

const Login = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("student")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType: activeTab === "student" ? "user" : "admin",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Create user object with role
      const userData = {
        ...data.data,
        role: activeTab === "student" ? "user" : "admin",
      }

      // Update authentication state using the onLogin prop
      onLogin(userData)

      // Redirect based on user role
      if (activeTab === "student") {
        navigate("/dashboard")
      } else {
        navigate("/admin")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="library-bg">
      <div className="library-header">
        <h1>
          LIBRARY<span>ZONE</span>
        </h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/gallery" className="nav-link">
            Gallery
          </Link>
          <Link to="/admin/login" className="nav-link">
            Admin Login
          </Link>
          <Link to="/signup" className="nav-link">
            Register
          </Link>
          <Link to="/login" className="nav-link active">
            Login
          </Link>
        </div>
      </div>

      <div className="welcome-text">
        <h2>
          WELCOME TO LIBRARY<span>ZONE</span>
        </h2>
        <p>YOU CAN WRITE SOME TEXT</p>
      </div>

      <div className="login-tabs-container">
        <div className={`login-tab ${activeTab === "student" ? "active" : ""}`}>
          <div className="tab-header" onClick={() => handleTabChange("student")}>
            STUDENT
          </div>

          {activeTab === "student" && (
            <div className="tab-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="studentEmail">USER NAME</label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentPassword">PASSWORD</label>
                  <input
                    type="password"
                    id="studentPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "SAVE"}
                </button>

                <div className="forgot-password">
                  <Link to="/forgot-password">forget password</Link>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className={`login-tab ${activeTab === "teacher" ? "active" : ""}`}>
          <div className="tab-header" onClick={() => handleTabChange("teacher")}>
            TEACHER
          </div>

          {activeTab === "teacher" && (
            <div className="tab-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="teacherEmail">USER NAME</label>
                  <input
                    type="email"
                    id="teacherEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="teacherPassword">PASSWORD</label>
                  <input
                    type="password"
                    id="teacherPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "SAVE"}
                </button>

                <div className="forgot-password">
                  <Link to="/forgot-password">forget password</Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default Login
