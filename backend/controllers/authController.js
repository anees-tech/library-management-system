import User from "../models/User.js"

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, registrationNumber, collegeRollNumber, universityRollNumber, contactNumber } =
      req.body

    // Check if user with email already exists
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Check if user with registration number already exists
    const existingUserByRegNo = await User.findOne({ registrationNumber })
    if (existingUserByRegNo) {
      return res.status(400).json({
        success: false,
        message: "User with this registration number already exists",
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, you would hash this password
      role: role || "student",
      registrationNumber,
      collegeRollNumber,
      universityRollNumber,
      contactNumber,
    })

    // Create user response without password
    const userResponse = { ...user._doc }
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Create user response without password
    const userResponse = { ...user._doc }
    delete userResponse.password

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userResponse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required",
      })
    }

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get current user",
      error: error.message,
    })
  }
}
