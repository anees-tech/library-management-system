import mongoose from "mongoose"

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
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      min: [1, "Quantity must be at least 1"],
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
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
  },
)

export default mongoose.model("Book", bookSchema)
