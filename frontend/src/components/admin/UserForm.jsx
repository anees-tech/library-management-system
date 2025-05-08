"use client"

import { useState, useEffect } from "react"
import "../../styles/AdminForms.css"

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    registrationNumber: "",
    collegeRollNumber: "",
    universityRollNumber: "",
    contactNumber: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't populate password
        role: user.role || "student",
        registrationNumber: user.registrationNumber || "",
        collegeRollNumber: user.collegeRollNumber || "",
        universityRollNumber: user.universityRollNumber || "",
        contactNumber: user.contactNumber || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!user && !formData.password.trim()) newErrors.password = "Password is required for new users"
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      // If editing and password is empty, remove it from the data
      const submitData = { ...formData }
      if (user && !submitData.password) {
        delete submitData.password
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{user ? "Edit User" : "Add New User"}</h2>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">{user ? "Password (leave blank to keep current)" : "Password"}</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="registrationNumber">Registration Number</label>
        <input
          type="text"
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
        {errors.registrationNumber && <span className="error">{errors.registrationNumber}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="collegeRollNumber">College Roll Number</label>
          <input
            type="text"
            id="collegeRollNumber"
            name="collegeRollNumber"
            value={formData.collegeRollNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="universityRollNumber">University Roll Number</label>
          <input
            type="text"
            id="universityRollNumber"
            name="universityRollNumber"
            value={formData.universityRollNumber}
            onChange={handleChange}
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
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Saving..." : user ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  )
}

export default UserForm
