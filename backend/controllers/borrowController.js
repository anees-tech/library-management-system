import Borrow from "../models/Borrow.js"
import Book from "../models/Book.js"
import User from "../models/User.js"

// Helper function to calculate fine
const calculateFine = (dueDate, returnDate = new Date()) => {
  if (returnDate <= dueDate) return 0

  const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24))
  // Assuming fine is Rs. 10 per day
  return daysLate * 10
}

// Get all borrows
export const getAllBorrows = async (req, res) => {
  try {
    const { bookId, userId } = req.query // Check for bookId or userId query params
    let query = {}

    if (bookId) {
      query.book = bookId
    }
    if (userId) {
      query.user = userId
    }

    const borrows = await Borrow.find(query) // Apply the query filter
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber email") // Added email for user info

    res.status(200).json({
      success: true,
      count: borrows.length,
      data: borrows,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrows",
      error: error.message,
    })
  }
}

// Get a single borrow
export const getBorrowById = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber")

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      })
    }

    res.status(200).json({
      success: true,
      data: borrow,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow record",
      error: error.message,
    })
  }
}

// Create a new borrow (issue a book)
export const createBorrow = async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if book is available
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available for borrowing",
      })
    }

    // Check if user already has this book
    const existingBorrow = await Borrow.findOne({
      book: bookId,
      user: userId,
      status: { $ne: "returned" },
    })

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: "User already has this book borrowed",
      })
    }

    // Create borrow record
    const borrow = await Borrow.create({
      book: bookId,
      user: userId,
      dueDate: new Date(dueDate),
    })

    // Update book available quantity
    await Book.findByIdAndUpdate(bookId, {
      $inc: { availableQuantity: -1 },
    })

    // Populate book and user details
    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber")

    res.status(201).json({
      success: true,
      data: populatedBorrow,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create borrow record",
      error: error.message,
    })
  }
}

// Return a book
export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      })
    }

    // Check if book is already returned
    if (borrow.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book is already returned",
      })
    }

    const returnDate = new Date()
    const fine = calculateFine(borrow.dueDate, returnDate)

    // Update borrow record
    const updatedBorrow = await Borrow.findByIdAndUpdate(
      req.params.id,
      {
        returnDate,
        status: "returned",
        fine,
      },
      { new: true },
    )
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber")

    // Update book available quantity
    await Book.findByIdAndUpdate(borrow.book, {
      $inc: { availableQuantity: 1 },
    })

    res.status(200).json({
      success: true,
      data: updatedBorrow,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to return book",
      error: error.message,
    })
  }
}

// Get overdue borrows
export const getOverdueBorrows = async (req, res) => {
  try {
    const today = new Date()

    const overdueBorrows = await Borrow.find({
      dueDate: { $lt: today },
      status: { $ne: "returned" },
    })
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber contactNumber")

    // Calculate and update fines
    const borrowsWithFines = overdueBorrows.map((borrow) => {
      const fine = calculateFine(borrow.dueDate)
      return {
        ...borrow._doc,
        fine,
      }
    })

    res.status(200).json({
      success: true,
      count: borrowsWithFines.length,
      data: borrowsWithFines,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch overdue borrows",
      error: error.message,
    })
  }
}

// Get reports (daily, weekly, monthly)
export const getReports = async (req, res) => {
  try {
    const { type } = req.query
    let startDate
    const endDate = new Date()

    // Calculate start date based on report type
    if (type === "daily") {
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
    } else if (type === "weekly") {
      startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
    } else if (type === "monthly") {
      startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid report type. Use daily, weekly, or monthly",
      })
    }

    // Get borrows in date range
    const borrows = await Borrow.find({
      $or: [{ borrowDate: { $gte: startDate, $lte: endDate } }, { returnDate: { $gte: startDate, $lte: endDate } }],
    })
      .populate("book", "title author isbn")
      .populate("user", "name registrationNumber")

    // Calculate statistics
    const totalBorrowed = await Borrow.countDocuments({
      borrowDate: { $gte: startDate, $lte: endDate },
    })

    const totalReturned = await Borrow.countDocuments({
      returnDate: { $gte: startDate, $lte: endDate },
    })

    const totalOverdue = await Borrow.countDocuments({
      dueDate: { $lt: endDate },
      status: { $ne: "returned" },
    })

    const totalFines = await Borrow.aggregate([
      {
        $match: {
          returnDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fine" },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        borrows,
        statistics: {
          totalBorrowed,
          totalReturned,
          totalOverdue,
          totalFines: totalFines.length > 0 ? totalFines[0].totalFine : 0,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    })
  }
}
