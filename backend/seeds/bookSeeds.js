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
    imageUrl: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction",
    quantity: 7,
    availableQuantity: 5,
    purchaseDate: new Date("2023-02-20"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Dystopian",
    quantity: 12,
    availableQuantity: 12,
    purchaseDate: new Date("2022-11-10"),
    imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    category: "Romance",
    quantity: 8,
    availableQuantity: 8,
    purchaseDate: new Date("2023-03-05"),
    imageUrl: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    category: "Fantasy",
    quantity: 15,
    availableQuantity: 13,
    purchaseDate: new Date("2022-10-01"),
    imageUrl: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
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
