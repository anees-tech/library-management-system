const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Admin = require("../models/Admin")

// Register a new user
router.post("/user/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists", code: 403 })

    user = new User({
      name,
      email,
      password,
      confirmpassword,
      role: "user",
    })
    await user.save()
    res.status(201).json({
      message: "User registered successfully",
      status: 201,
      success: true,
      user,
    })
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err })
  }
})

// Register a new admin
router.post("/admin/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body
  try {
    let admin = await Admin.findOne({ email })
    if (admin) return res.status(400).json({ message: "Admin already exists", code: 403 })

    admin = new Admin({
      name,
      email,
      password,
      confirmpassword,
      role: "admin",
    })
    await admin.save()
    res.status(201).json({
      message: "Admin registered successfully",
      status: 201,
      success: true,
      admin,
    })
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err })
  }
})

// Login a user
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || user.password !== password) return res.status(400).json({ message: "Invalid credentials", code: 403 })

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      code: 201,
      success: true,
    })
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
})

// Login an admin
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await Admin.findOne({ email })
    if (!admin || admin.password !== password)
      return res.status(400).json({ message: "Invalid credentials", code: 403 })

    res.json({
      message: "Login successful",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      code: 201,
      success: true,
    })
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
