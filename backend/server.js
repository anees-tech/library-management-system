import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import bookRoutes from "./routes/bookRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import borrowRoutes from "./routes/borrowRoutes.js" // Make sure this is imported
import authRoutes from "./routes/authRoutes.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://hello:hello123@restaurant.8j8yw.mongodb.net/libraryNew")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/borrows", borrowRoutes) // Make sure this is mounted
app.use("/api/auth", authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
