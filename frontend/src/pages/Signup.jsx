"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Auth.css"

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNumber: "",
    collegeRollNumber: "",
    universityRollNumber: "",
    contactNumber: "",
    role: "student",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      onLogin(data.data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Library Management System</h1>
          <h2>Sign Up</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber">Registration Number</label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 2021-GCUF-056622"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="collegeRollNumber">College Roll No</label>
              <input
                type="text"
                id="collegeRollNumber"
                name="collegeRollNumber"
                value={formData.collegeRollNumber}
                onChange={handleChange}
                placeholder="e.g., 63"
              />
            </div>

            <div className="form-group">
              <label htmlFor="universityRollNumber">University Roll No</label>
              <input
                type="text"
                id="universityRollNumber"
                name="universityRollNumber"
                value={formData.universityRollNumber}
                onChange={handleChange}
                placeholder="e.g., 662463"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g., 0318-7583489"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
            </select>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
