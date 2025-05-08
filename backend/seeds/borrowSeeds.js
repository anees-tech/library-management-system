// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\backend\seeds\borrowSeeds.js
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

export const seedBorrows = async (createdBooks, createdUsers) => {
  if (!createdBooks || createdBooks.length === 0 || !createdUsers || createdUsers.length === 0) {
    console.log("Skipping borrow seeding as no books or users were provided/created.");
    return;
  }

  const studentUser1 = createdUsers.find(u => u.email === "alice@example.com");
  const studentUser2 = createdUsers.find(u => u.email === "bob@example.com");

  const book1 = createdBooks.find(b => b.isbn === "9780061120084"); // To Kill a Mockingbird
  const book2 = createdBooks.find(b => b.isbn === "9780547928227"); // The Hobbit
  const book3 = createdBooks.find(b => b.isbn === "9780743273565"); // The Great Gatsby

  if (!studentUser1 || !studentUser2 || !book1 || !book2 || !book3) {
    console.error("Could not find all required users or books for borrow seeding. Check ISBNs and emails.");
    return;
  }

  const borrows = [
    {
      book: book1._id,
      user: studentUser1._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      status: "borrowed",
    },
    {
      book: book2._id,
      user: studentUser2._id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
      status: "borrowed",
    },
    {
      book: book3._id,
      user: studentUser1._id,
      borrowDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Borrowed 15 days ago
      dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // Was due 8 days ago
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Returned 5 days ago
      status: "returned",
      fine: 30, // Example fine
    },
  ];

  try {
    await Borrow.deleteMany({});
    await Borrow.insertMany(borrows);

    // Adjust availableQuantity for borrowed books
    await Book.findByIdAndUpdate(book1._id, { $inc: { availableQuantity: -1 } });
    await Book.findByIdAndUpdate(book2._id, { $inc: { availableQuantity: -1 } });

    console.log("Borrows seeded successfully");
  } catch (error) {
    console.error("Error seeding borrows:", error);
    throw error;
  }
};