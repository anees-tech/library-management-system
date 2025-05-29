"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { FaSearch, FaUser, FaShoppingCart, FaPlusCircle, FaNewspaper, FaCog, FaHome, FaBook } from "react-icons/fa"
import "../styles/Dashboard.css"
import MessageDisplay from "../components/dashboardComponents/MessageDisplay"
import BooksView from "../components/dashboardComponents/BooksView"
import BorrowsView from "../components/dashboardComponents/BorrowsView"
import ProfileView from "../components/dashboardComponents/ProfileView"
import PaymentModal from "../components/dashboardComponents/PaymentModal"

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("books")
  const [books, setBooks] = useState([])
  const [myBorrows, setMyBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingBookIds, setLoadingBookIds] = useState({})
  const [searchLoading, setSearchLoading] = useState(false)
  const [returnLoading, setReturnLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBorrowForPayment, setSelectedBorrowForPayment] = useState(null)
  const [featuredBooks, setFeaturedBooks] = useState([])

  const API_BASE_URL = "http://localhost:5000/api"

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => {
      setMessage({ type: "", text: "" })
    }, 5000)
  }

  const fetchBooks = useCallback(async (isSearch = false) => {
    if (!isSearch) setLoading(true)
    else setSearchLoading(true)

    try {
      const url = searchTerm.trim() && isSearch
        ? `${API_BASE_URL}/books/search?query=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/books`
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books")
      }
      setBooks(data.data || [])

      // Set featured books to the first 5 books
      if (!isSearch && data.data && data.data.length > 0) {
        setFeaturedBooks(data.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      showMessage("error", error.message || "Failed to load books.")
    } finally {
      if (!isSearch) setLoading(false)
      else setSearchLoading(false)
    }
  }, [searchTerm, API_BASE_URL])

  const fetchMyBorrows = useCallback(async () => {
    if (!user || !user._id) return
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }, [user, API_BASE_URL])

  useEffect(() => {
    if (user && user._id) {
      if (activeTab === "books") {
        fetchBooks(false)
      } else if (activeTab === "borrows") {
        fetchMyBorrows()
      } else if (activeTab === "profile") {
        if (myBorrows.length === 0) fetchMyBorrows()
        setLoading(false)
      }
    }
  }, [user, activeTab, fetchBooks, fetchMyBorrows, myBorrows.length])

  const handleSearchBooks = () => {
    fetchBooks(true)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    fetchBooks(false)
  }

  const borrowBook = async (bookId) => {
    setLoadingBookIds(prev => ({ ...prev, [bookId]: true }))

    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      const response = await fetch(`${API_BASE_URL}/borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, userId: user._id, dueDate: dueDate.toISOString() }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to borrow book")

      showMessage("success", `Book borrowed! Due: ${new Date(dueDate).toLocaleDateString()}`)
      fetchBooks(false)
      if (activeTab === "borrows") fetchMyBorrows()
      else setMyBorrows((prev) => [...prev, data.data])
    } catch (error) {
      console.error("Error borrowing book:", error)
      showMessage("error", error.message || "Failed to borrow book.")
    } finally {
      setLoadingBookIds(prev => {
        const newState = { ...prev }
        delete newState[bookId]
        return newState
      })
    }
  }

  const returnBook = async (borrowId) => {
    setReturnLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, { method: "PUT" })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to return book")

      showMessage("success", "Book returned successfully!")
      if (data.data.fine > 0) {
        showMessage("info", `Fine of Rs. ${data.data.fine} for late return.`)
      }
      fetchMyBorrows()
      fetchBooks(false)
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
    console.log(`Attempting to pay fine for borrowId: ${borrowId}, amount: ${amount}`)
    showMessage("success", `Fine of Rs. ${amount} marked as paid (mock)!`)
    setPaymentModalOpen(false)
    setSelectedBorrowForPayment(null)
    fetchMyBorrows()
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

      {/* Secondary Navigation */}
      <nav className="secondary-nav">
        <div className="secondary-nav-content">
          <div className="nav-icon">
            <Link to="/">
              <FaHome />
            </Link>
          </div>

          <div className="nav-actions">
            <Link to="#" className={`nav-action-link ${activeTab === 'borrows' ? 'active' : ''}`} onClick={() => setActiveTab('borrows')}>
              <FaBook />
              <span className="count-badge">{myBorrows.length}</span>
            </Link>
            <Link to="#" className={`nav-action-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <FaUser />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (only show on books tab) */}
      {activeTab === 'books' && (
        <section className="hero-section">
          <div className="hero-content">
            <h1>Library Management<br /><span className="hero-emphasis">SYSTEM</span></h1>
            <p>Find and borrow books from our extensive collection</p>
          </div>
        </section>
      )}

      {/* Tab specific content */}
      <main className={`dashboard-main ${activeTab !== 'books' ? 'no-hero' : ''}`}>
        <MessageDisplay message={message} onClose={() => setMessage({ type: "", text: "" })} />

        {activeTab === "books" && (
          <div className="books-section">


            {/* Original BooksView component */}
            <BooksView
              books={books}
              loading={loading && books.length === 0}
              searchTerm={searchTerm}
              onSearchTermChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearchBooks}
              onClearSearch={handleClearSearch}
              onBorrowBook={borrowBook}
              loadingBookIds={loadingBookIds}
              searchLoading={searchLoading}
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
            <ProfileView user={user} myBorrows={myBorrows} isOverdue={isOverdue} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Library</h3>
            <p>Our library management system offers a comprehensive solution for accessing and managing library resources.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="#">Home</Link></li>
              <li><Link to="#">Browse Books</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Contact</Link></li>
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
        onClose={() => setPaymentModalOpen(false)}
        selectedBorrow={selectedBorrowForPayment}
        onPayFine={payFine}
      />
    </div>
  )
}

export default Dashboard
