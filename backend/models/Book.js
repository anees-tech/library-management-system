import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Book", bookSchema)
