// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\backend\seeds\userSeeds.js
import User from "../models/User.js";

// IMPORTANT: In a real application, passwords should be hashed before saving.
// For this seed script, we are using plain text passwords for simplicity.
const users = [
  {
    name: "Alice Wonderland",
    email: "alice@example.com",
    password: "password123",
    role: "student",
    registrationNumber: "S1001",
    collegeRollNumber: "C1001",
    universityRollNumber: "U1001",
    contactNumber: "1234567890",
  },
  {
    name: "Bob The Builder",
    email: "bob@example.com",
    password: "password456",
    role: "student",
    registrationNumber: "S1002",
    collegeRollNumber: "C1002",
    universityRollNumber: "U1002",
    contactNumber: "0987654321",
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password789",
    role: "staff",
    registrationNumber: "T2001",
    contactNumber: "1122334455",
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpassword",
    role: "admin",
    registrationNumber: "A0001",
    contactNumber: "5544332211",
  },
];

export const seedUsers = async () => {
  try {
    await User.deleteMany({});
    // In a real app, hash passwords here before inserting
    const createdUsers = await User.insertMany(users);
    console.log("Users seeded successfully");
    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};
