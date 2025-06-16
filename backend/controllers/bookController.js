import Book from "../models/Book.js";

// Get all books (or filter by category, or search query)
export const getAllBooks = async (req, res) => {
  try {
    const { category, query } = req.query;
    console.log("Backend received req.query:", req.query); // Log 1: Incoming query params

    const filter = {};

    // Handle category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Handle search query
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i");
      const searchConditions = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
      ];

      if (filter.category) {
        // If category filter already exists, combine with search using $and
        filter.$and = [
          { category: filter.category }, // Condition for the specified category
          { $or: searchConditions }      // Condition for the search query across fields
        ];
        delete filter.category; // Remove the top-level category field as it's now part of $and
      } else {
        // If no category filter, just apply search conditions
        filter.$or = searchConditions;
      }
    }

    console.log("Backend filter object:", JSON.stringify(filter)); // Log 2: The constructed filter

    const books = await Book.find(filter).sort({ title: 1 });
    console.log("Books found count:", books.length); // Log 3: Count from DB query

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

// Get a single book
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

// Create a new book
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, description, quantity, imageUrl } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      description: description ? description.trim() : "No description available.",
      quantity: Number.parseInt(quantity),
      availableQuantity: Number.parseInt(quantity),
      imageUrl: imageUrl || "",
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message,
    });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { title, author, category, description, quantity, imageUrl } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Validate quantity
    const newQuantity = Number.parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid positive number",
      });
    }

    // Calculate new available quantity
    const difference = newQuantity - book.quantity;
    const newAvailableQuantity = book.availableQuantity + difference;

    if (newAvailableQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot reduce quantity below borrowed amount",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() || book.title,
        author: author?.trim() || book.author,
        category: category?.trim() || book.category,
        description: description !== undefined ? (description.trim() || "No description available.") : book.description,
        quantity: newQuantity,
        availableQuantity: newAvailableQuantity,
        imageUrl: imageUrl !== undefined ? imageUrl : book.imageUrl,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if all copies are available (none are borrowed)
    if (book.quantity !== book.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book with borrowed copies",
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    });
  }
};

// Search books (legacy endpoint - now handled by getAllBooks)
export const searchBooks = async (req, res) => {
  try {
    const { query, category } = req.query;
    console.log("Backend searchBooks req.query:", req.query);

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    let searchFilter = { // Renamed to avoid confusion with the main filter
      $or: [
        { title: { $regex: query.trim(), $options: "i" } },
        { author: { $regex: query.trim(), $options: "i" } },
        { isbn: { $regex: query.trim(), $options: "i" } },
      ],
    };

    if (category && category !== "All") {
      // Correctly combine with $and if category is also present
      searchFilter = {
        $and: [
          searchFilter, // The $or part
          { category: category }
        ]
      };
    }
    console.log("Backend searchBooks filter:", JSON.stringify(searchFilter));
    const books = await Book.find(searchFilter).sort({ title: 1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Error in searchBooks:", error);
    res.status(500).json({
      success: false,
      message: "Server Error in searchBooks: " + error.message,
    });
  }
};
