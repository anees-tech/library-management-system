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
import BookDetailModal from "../components/dashboardComponents/BookDetailModal" // Import the new modal

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
  const [searchLoading, setSearchLoading] = useState(false) 
  const [returnLoading, setReturnLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBorrowForPayment, setSelectedBorrowForPayment] = useState(null)
  
  // New state for book detail modal
  const [bookDetailModalOpen, setBookDetailModalOpen] = useState(false)
  const [selectedBookForDetail, setSelectedBookForDetail] = useState(null)

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
      console.log("All books fetched:", data.data.length);
    } catch (error) {
      console.error("Error fetching all books:", error);
      showMessage("error", error.message || "Failed to load books.");
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showMessage]);

  // useEffect for client-side filtering and searching
  useEffect(() => {
    console.log("Filtering client-side. Search:", searchTerm, "Category:", selectedCategory);
    setSearchLoading(true);

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
    
    const timer = setTimeout(() => {
        setSearchLoading(false);
    }, 100);

    return () => clearTimeout(timer);

  }, [allBooks, searchTerm, selectedCategory]);

  const fetchMyBorrows = useCallback(async () => {
    if (!user || !user._id) return
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
    }
  }, [user, API_BASE_URL, showMessage]);

  // Initial data loading and tab switching logic
  useEffect(() => {
    if (user && user._id) {
      if (activeTab === "books") {
        if (allBooks.length === 0) {
          fetchAllBooks();
        } else {
          setLoading(false);
        }
      } else if (activeTab === "borrows") {
        fetchMyBorrows();
      } else if (activeTab === "profile") {
        if (myBorrows.length === 0) {
          fetchMyBorrows();
        }
        setLoading(false);
      }
    }
  }, [user, activeTab, fetchAllBooks, fetchMyBorrows, allBooks.length]);

  const handleSearchBooks = () => {
    console.log("Search button clicked. Term:", searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // New function to handle book detail modal
  const handleViewBookDetails = (book) => {
    setSelectedBookForDetail(book)
    setBookDetailModalOpen(true)
  }

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
      await fetchAllBooks(); 

      if (activeTab === "borrows" || activeTab === "profile") {
        fetchMyBorrows()
      } else {
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
      
      if (!response.ok) {
        // Check if error is due to unpaid fines
        if (response.status === 400 && data.unpaidFines) {
          showMessage("error", data.message)
          // Optionally, you could show a modal with unpaid fines details
          console.log("Unpaid fines:", data.unpaidFines)
        } else {
          throw new Error(data.message || "Failed to return book")
        }
        return // Don't proceed further if there's an error
      }
      
      showMessage("success", "Book returned successfully!")
      if (data.data.fine > 0) {
        showMessage("info", `Fine of Rs. ${data.data.fine} applied for late return.`)
      }
      
      await fetchAllBooks();
      fetchMyBorrows();

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
      const response = await fetch(`${API_BASE_URL}/borrows/${borrowId}/pay-fine`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to process payment")
      }
      
      showMessage("success", `Fine of Rs. ${amount} paid successfully!`)
      setPaymentModalOpen(false)
      setSelectedBorrowForPayment(null)
      fetchMyBorrows()
    } catch (error) {
      console.error("Error processing payment:", error)
      showMessage("error", error.message || "Payment failed. Please try again.")
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
              onViewBookDetails={handleViewBookDetails} // Add this prop
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
              isOverdue={isOverdue} // Add this line
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

      {/* Add the new BookDetailModal */}
      <BookDetailModal
        isOpen={bookDetailModalOpen}
        onClose={() => {
          setBookDetailModalOpen(false)
          setSelectedBookForDetail(null)
        }}
        book={selectedBookForDetail}
        user={user}
        onBorrowBook={borrowBook}
      />
    </div>
  )
}

export default Dashboard
