"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { FaSearch, FaUser, FaShoppingCart, FaHome, FaBook } from "react-icons/fa"
import "../styles/Dashboard.css"
import MessageDisplay from "../components/dashboardComponents/MessageDisplay"
import BooksView from "../components/dashboardComponents/BooksView"
import BorrowsView from "../components/dashboardComponents/BorrowsView"
import ProfileView from "../components/dashboardComponents/ProfileView"
import PaymentModal from "../components/dashboardComponents/PaymentModal"

// Define categories
const bookCategories = [
  "All",
  "Science",
  "English",
  "Math",
  "Classic",
  "Fiction",
  "History",
  "Technology",
  "Fantasy",
  "Biography",
  "Mystery",
]

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("books")
  const [allBooks, setAllBooks] = useState([]) // Stores all books from backend
  const [books, setBooks] = useState([]) // Stores filtered/searched books for display
  const [myBorrows, setMyBorrows] = useState([])
  const [loading, setLoading] = useState(true) // For initial load of allBooks
  const [loadingBookIds, setLoadingBookIds] = useState({})
  // searchLoading can be removed or repurposed for a visual cue during client-side filtering if it's slow
  const [searchLoading, setSearchLoading] = useState(false) 
  const [returnLoading, setReturnLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBorrowForPayment, setSelectedBorrowForPayment] = useState(null)

  const API_BASE_URL = "http://localhost:5000/api"

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => {
      setMessage({ type: "", text: "" })
    }, 5000)
  }

  // Fetches ALL books from the backend
  const fetchAllBooks = useCallback(async () => {
    console.log("Fetching all books from backend...");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books`); // No query params
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }
      setAllBooks(data.data || []);
      // setBooks(data.data || []); // Initially display all books, will be filtered by useEffect
      console.log("All books fetched:", data.data.length);
    } catch (error) {
      console.error("Error fetching all books:", error);
      showMessage("error", error.message || "Failed to load books.");
      setAllBooks([]);
      // setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showMessage]); // Dependencies for fetching all books

  // useEffect for client-side filtering and searching
  useEffect(() => {
    console.log("Filtering client-side. Search:", searchTerm, "Category:", selectedCategory);
    setSearchLoading(true); // Indicate filtering is in progress

    let filtered = [...allBooks];

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (book) => book.category && book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term (title, author, isbn)
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (book) =>
          (book.title && book.title.toLowerCase().includes(lowerSearchTerm)) ||
          (book.author && book.author.toLowerCase().includes(lowerSearchTerm)) ||
          (book.isbn && book.isbn.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    setBooks(filtered);
    console.log("Filtered books count:", filtered.length);
    
    // Simulate a short delay for visual feedback if needed, otherwise remove
    const timer = setTimeout(() => {
        setSearchLoading(false);
    }, 100); // Adjust or remove delay as needed

    return () => clearTimeout(timer);

  }, [allBooks, searchTerm, selectedCategory]);


  const fetchMyBorrows = useCallback(async () => {
    if (!user || !user._id) return
    // setLoading(true) // This loading is for allBooks, borrows can have its own if needed
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user._id}/borrows`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch borrows")
      }
      setMyBorrows(data.data || [])
    } catch (error) {
      console.error("Error fetching borrows:", error)
      showMessage("error", "Failed to load your borrowed books.")
      setMyBorrows([])
    } finally {
      // setLoading(false)
    }
  }, [user, API_BASE_URL, showMessage]);

  // Initial data loading and tab switching logic
  useEffect(() => {
    if (user && user._id) {
      if (activeTab === "books") {
        if (allBooks.length === 0) { // Only fetch all books if not already fetched
          fetchAllBooks(); // This sets loading to true
        } else {
          // If allBooks is already populated, ensure loading is false
          // and client-side filtering useEffect will handle displaying correct books
          setLoading(false); // <--- THIS IS GOOD
        }
      } else if (activeTab === "borrows") {
        fetchMyBorrows();
      } else if (activeTab === "profile") {
        if (myBorrows.length === 0) {
          fetchMyBorrows();
        }
        setLoading(false); // Profile tab doesn't load 'allBooks'
      }
    }
  }, [user, activeTab, fetchAllBooks, fetchMyBorrows, allBooks.length]); // allBooks.length added

  // This useEffect for debounced search/category API calls is NO LONGER NEEDED
  // as filtering is client-side.
  /*
  useEffect(() => {
    if (activeTab === "books") {
      const timeoutId = setTimeout(() => {
        // fetchBooks(true) // This was calling the backend
      }, 300) 
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, selectedCategory, activeTab, fetchBooks]) // fetchBooks was the backend fetcher
  */

  const handleSearchBooks = () => {
    // This function might not be strictly necessary if search happens on input change.
    // If used with a search button, it doesn't need to do much as searchTerm state change triggers filtering.
    console.log("Search button clicked. Term:", searchTerm);
    // setSearchLoading(true); // Already handled by filtering useEffect
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    // Client-side filtering useEffect will update the books list
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Client-side filtering useEffect will update the books list
  };

  const borrowBook = async (bookId) => {
    setLoadingBookIds((prev) => ({ ...prev, [bookId]: true }))
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)
      const response = await fetch(`${API_BASE_URL}/borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          userId: user._id,
          dueDate: dueDate.toISOString(),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to borrow book")
      showMessage("success", `Book borrowed successfully! Due: ${new Date(dueDate).toLocaleDateString()}`)
      
      // Refresh ALL books from backend to get updated availableQuantity
      // This is important if availableQuantity changes on borrow
      await fetchAllBooks(); 

      if (activeTab === "borrows" || activeTab === "profile") {
        fetchMyBorrows()
      } else {
        // If not on borrows tab, update local borrows for badge, etc.
        setMyBorrows((prev) => [...prev, data.data]);
      }
    } catch (error) {
      console.error("Error borrowing book:", error)
      showMessage("error", error.message || "Failed to borrow book.")
    } finally {
      setLoadingBookIds((prev) => {
        const newState = { ...prev }
        delete newState[bookId]
        return newState
      })
    }
  }

  const returnBook = async (borrowId) => {
    setReturnLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, {
        method: "PUT",
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to return book")
      showMessage("success", "Book returned successfully!")
      if (data.data.fine > 0) {
        showMessage("info", `Fine of Rs. ${data.data.fine} applied for late return.`)
      }
      
      // Refresh ALL books from backend to get updated availableQuantity
      await fetchAllBooks();
      fetchMyBorrows(); // Always refresh borrows

    } catch (error) {
      console.error("Error returning book:", error)
      showMessage("error", error.message || "Failed to return book.")
    } finally {
      setReturnLoading(false)
    }
  }

  const handleOpenPaymentModal = (borrow) => {
    setSelectedBorrowForPayment(borrow)
    setPaymentModalOpen(true)
  }

  const payFine = async (borrowId, amount) => {
    try {
      // Mock payment - in real app, integrate with payment gateway
      console.log(`Mock payment: borrowId: ${borrowId}, amount: ${amount}`)
      showMessage("success", `Fine of Rs. ${amount} paid successfully (mock payment)!`)
      setPaymentModalOpen(false)
      setSelectedBorrowForPayment(null)
      fetchMyBorrows()
    } catch (error) {
      console.error("Error processing payment:", error)
      showMessage("error", "Payment failed. Please try again.")
    }
  }

  const isOverdue = useCallback((dueDateStr) => {
    if (!dueDateStr) return false
    const dueDate = new Date(dueDateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }, [])

  return (
    <div className="modern-library-dashboard">


      {/* Main Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-text">LibraryZone</div>
          </div>
          <div className="header-right">
            <span className="user-greeting">Welcome, {user?.name}</span>
            <button onClick={onLogout} className="logout-button-header">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <nav className="secondary-nav">
        <div className="secondary-nav-content">
          <div className="nav-icon-dashboard">
            <Link to="/dashboard" title="Dashboard Home">
              <FaHome />
            </Link>
          </div>

          <div className="secondary-links">
            <Link
              to="#"
              className={`sec-nav-link ${activeTab === "books" ? "active" : ""}`}
              onClick={() => setActiveTab("books")}
            >
              <FaBook /> All Books
            </Link>
            <Link
              to="#"
              className={`sec-nav-link ${activeTab === "borrows" ? "active" : ""}`}
              onClick={() => setActiveTab("borrows")}
            >
              <FaShoppingCart /> My Borrows
              {myBorrows.length > 0 && <span className="count-badge-nav">{myBorrows.length}</span>}
            </Link>
            <Link
              to="#"
              className={`sec-nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser /> My Profile
            </Link>
          </div>

          {activeTab === "books" && (
            <div className="search-container-dashboard">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // onKeyPress={(e) => e.key === "Enter" && handleSearchBooks()} // Optional if searching on type
                className="search-input-dashboard"
                disabled={loading} // Disable only during the initial fetch of allBooks
              />
              {/* Search button is optional if searching on type */}
              {/* <button onClick={handleSearchBooks} className="search-button-dashboard" disabled={loading || searchLoading}>
                <FaSearch />
              </button> */}
              {searchTerm && (
                 <button 
                    onClick={handleClearSearch} 
                    className="clear-search-button-dashboard" // Add styling for this
                    disabled={loading} // Also disable clear button during initial load
                  >
                    Clear
                  </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {activeTab === 'books' && (
        <section className="hero-section">
          {/* ... hero content ... */}
        </section>
      )}

      <main className={`dashboard-main ${activeTab !== 'books' ? 'no-hero' : ''}`}>
        <MessageDisplay message={message} onClose={() => setMessage({ type: "", text: "" })} />

        {activeTab === "books" && (
          <div className="books-section">
            <div className="category-filters">
              {bookCategories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category)}
                  disabled={loading} // Disable while initial allBooks load
                >
                  {category}
                </button>
              ))}
            </div>

            <BooksView
              books={books} // This is now the client-side filtered list
              loading={loading} // This is for the initial fetch of allBooks
              searchLoading={searchLoading} // This indicates client-side filtering is happening
              searchTerm={searchTerm}
              // onSearchTermChange, onSearch, onClearSearch are tied to Dashboard's state updates
              // so BooksView might not need all of them if Dashboard handles input state directly
              onBorrowBook={borrowBook}
              loadingBookIds={loadingBookIds}
            />
          </div>
        )}

        {activeTab === "borrows" && (
          <div className="borrows-section">
            <div className="section-header">
              <h2>My Borrowed Books</h2>
            </div>
            <BorrowsView
              borrows={myBorrows}
              loading={loading}
              onReturnBook={returnBook}
              onOpenPaymentModal={handleOpenPaymentModal}
              returnLoading={returnLoading}
              isOverdue={isOverdue}
            />
          </div>
        )}

        {activeTab === "profile" && user && (
          <div className="profile-section">
            <div className="section-header">
              <h2>My Profile</h2>
            </div>
            <ProfileView user={user} myBorrows={myBorrows} isOverdue={isOverdue} loading={loading} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Library</h3>
            <p>
              Our library management system offers a comprehensive solution for accessing and managing library
              resources.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/catalog">Browse Books</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@library.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Library Management System. All rights reserved.</p>
        </div>
      </footer>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setSelectedBorrowForPayment(null)
        }}
        selectedBorrow={selectedBorrowForPayment}
        onPayFine={payFine}
      />
    </div>
  )
}

export default Dashboard
