// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\backend\seeds\index.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import { seedBooks } from "./bookSeeds.js"
import { seedUsers } from "./userSeeds.js"
import { seedBorrows } from "./borrowSeeds.js"

// Load environment variables from .env file in the backend directory
dotenv.config()

const seedAll = async () => {
  const dbURI = process.env.MONGODB_URI || "mongodb+srv://hello:hello123@restaurant.8j8yw.mongodb.net/libraryNew"
  try {
    await mongoose.connect(dbURI)
    console.log("MongoDB connected for seeding.")

    console.log("Starting database seed process...")

    const createdBooks = await seedBooks()
    const createdUsers = await seedUsers()
    // Pass the actual created book and user documents to seedBorrows
    await seedBorrows(createdBooks, createdUsers)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error during database seeding:", error)
    process.exit(1) // Exit with error code
  } finally {
    await mongoose.disconnect()
    console.log("MongoDB disconnected.")
    process.exit(0) // Exit successfully
  }
}

seedAll()
