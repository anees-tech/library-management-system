// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\backend\seeds\bookSeeds.js
import Book from "../models/Book.js";

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Classic",
    quantity: 10,
    availableQuantity: 10,
    purchaseDate: new Date("2023-01-15"),
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction",
    quantity: 7,
    availableQuantity: 5,
    purchaseDate: new Date("2023-02-20"),
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Dystopian",
    quantity: 12,
    availableQuantity: 12,
    purchaseDate: new Date("2022-11-10"),
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    category: "Romance",
    quantity: 8,
    availableQuantity: 8,
    purchaseDate: new Date("2023-03-05"),
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    category: "Fantasy",
    quantity: 15,
    availableQuantity: 13,
    purchaseDate: new Date("2022-10-01"),
  },
];

export const seedBooks = async () => {
  try {
    await Book.deleteMany({});
    const createdBooks = await Book.insertMany(books);
    console.log("Books seeded successfully");
    return createdBooks;
  } catch (error) {
    console.error("Error seeding books:", error);
    throw error;
  }
};