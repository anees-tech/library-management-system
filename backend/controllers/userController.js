import User from "../models/User.js"
import Borrow from "../models/Borrow.js"

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

// Get a single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
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
      message: "Failed to fetch user",
      error: error.message,
    })
  }
}

// Create a new user
export const createUser = async (req, res) => {
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

    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, you would hash this password
      role,
      registrationNumber,
      collegeRollNumber,
      universityRollNumber,
      contactNumber,
    })

    // Remove password from response
    const userResponse = { ...user._doc }
    delete userResponse.password

    res.status(201).json({
      success: true,
      data: userResponse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    })
  }
}

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, registrationNumber, collegeRollNumber, universityRollNumber, contactNumber } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const existingUserByEmail = await User.findOne({ email })
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        })
      }
    }

    // Check if registration number is being changed and if it already exists
    if (registrationNumber !== user.registrationNumber) {
      const existingUserByRegNo = await User.findOne({ registrationNumber })
      if (existingUserByRegNo) {
        return res.status(400).json({
          success: false,
          message: "User with this registration number already exists",
        })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        registrationNumber,
        collegeRollNumber,
        universityRollNumber,
        contactNumber,
      },
      { new: true, runValidators: true },
    ).select("-password")

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    })
  }
}

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if user has any active borrows
    const activeBorrows = await Borrow.find({
      user: req.params.id,
      status: { $ne: "returned" },
    })

    if (activeBorrows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active borrows",
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
}

// Get user's borrow history
export const getUserBorrowHistory = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.params.id })
      .populate("book", "title author isbn")
      .sort({ borrowDate: -1 })

    res.status(200).json({
      success: true,
      count: borrows.length,
      data: borrows,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow history",
      error: error.message,
    })
  }
}
