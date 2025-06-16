import mongoose from "mongoose";
import Borrow from "./Borrow.js"; // Make sure Borrow model is imported

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "Please add an ISBN"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    description: { 
      type: String, 
      trim: true,
      default: "No description available." // Add default description
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      min: [0, "Quantity must be at least 0"],
      default: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, "Available quantity must be at least 0"],
    },
    coverImage: { type: String, default: "/placeholder-image.jpg" },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: "", // Default empty string for no image
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in toJSON output
    toObject: { virtuals: true }, // Ensure virtuals are included in toObject output
  }
);

// Virtual field to get the total number of borrows for a book
bookSchema.virtual("totalBorrowsCount", {
  ref: "Borrow", // The model to use
  localField: "_id", // Find borrows where `localField`
  foreignField: "book", // matches `foreignField`
  count: true, // And only get the count
});

// Middleware to ensure availableQuantity is not greater than quantity
bookSchema.pre("save", function (next) {
  if (this.availableQuantity > this.quantity) {
    this.availableQuantity = this.quantity;
  }
  if (this.isNew && this.availableQuantity === undefined) {
    this.availableQuantity = this.quantity;
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
