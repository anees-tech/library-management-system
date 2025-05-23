import Book from "../models/Book.js"

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    })
  }
}

// Get a single book
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }
    res.status(200).json({
      success: true,
      data: book,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    })
  }
}

// Create a new book
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity, imageUrl } = req.body // Add imageUrl to destructuring

    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn })
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      })
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
      availableQuantity: quantity,
      imageUrl: imageUrl || "", // Add this line to save the imageUrl
    })

    res.status(201).json({
      success: true,
      data: book,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message,
    })
  }
}

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { title, author, category, quantity, imageUrl } = req.body // Add imageUrl to destructuring

    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Calculate new available quantity
    const difference = quantity - book.quantity
    const newAvailableQuantity = book.availableQuantity + difference

    if (newAvailableQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot reduce quantity below borrowed amount",
      })
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        category,
        quantity,
        availableQuantity: newAvailableQuantity,
        imageUrl: imageUrl || book.imageUrl, // Add this line, keeping old image URL if not provided
      },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      data: updatedBook,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    })
  }
}

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if all copies are available (none are borrowed)
    if (book.quantity !== book.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book with borrowed copies",
      })
    }

    await Book.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    })
  }
}

// Search books
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    })

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search books",
      error: error.message,
    })
  }
}
