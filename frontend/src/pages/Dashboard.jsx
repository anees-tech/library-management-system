"use client"

import { useState, useEffect, useCallback } from "react"
import "../styles/Dashboard.css" // Main dashboard styles
import DashboardHeader from "../components/dashboardComponents/DashboardHeader"
import DashboardNav from "../components/dashboardComponents/DashboardNav"
import MessageDisplay from "../components/dashboardComponents/MessageDisplay"
import BooksView from "../components/dashboardComponents/BooksView"
import BorrowsView from "../components/dashboardComponents/BorrowsView"
import ProfileView from "../components/dashboardComponents/ProfileView"
import PaymentModal from "../components/dashboardComponents/PaymentModal"

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("books")
  const [books, setBooks] = useState([])
  const [myBorrows, setMyBorrows] = useState([])
  const [loading, setLoading] = useState(true) // General loading for tabs
  const [loadingBookIds, setLoadingBookIds] = useState({}) // Track loading state by book ID
  const [searchLoading, setSearchLoading] = useState(false) // For search operations
  const [returnLoading, setReturnLoading] = useState(false) // For return book operations
  const [searchTerm, setSearchTerm] = useState("")
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

  const fetchBooks = useCallback(async (isSearch = false) => {
    if (!isSearch) setLoading(true) // Full loading only on tab switch/initial load
    else setSearchLoading(true) // Use search loading for search within tab

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
        fetchBooks(false) // false indicates not a search action from within the tab
      } else if (activeTab === "borrows") {
        fetchMyBorrows()
      } else if (activeTab === "profile") {
        // Profile might need borrows, fetch if not already loaded or stale
        if (myBorrows.length === 0) fetchMyBorrows()
        setLoading(false) // Profile data is mostly from `user` prop or derived
      }
    }
  }, [user, activeTab, fetchBooks, fetchMyBorrows, myBorrows.length])

  const handleSearchBooks = () => {
    fetchBooks(true) // true indicates it's a search action
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    fetchBooks(false) // Call with isSearch = false to reload all
  }

  const borrowBook = async (bookId) => {
    // Set loading for just this specific book
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
      fetchBooks(false) // Refresh book list (available quantity)
      if (activeTab === "borrows") fetchMyBorrows() // Refresh borrows if on that tab
      else setMyBorrows((prev) => [...prev, data.data]) // Optimistically update borrows
    } catch (error) {
      console.error("Error borrowing book:", error)
      showMessage("error", error.message || "Failed to borrow book.")
    } finally {
      // Clear loading state for just this book
      setLoadingBookIds(prev => {
        const newState = { ...prev }
        delete newState[bookId]
        return newState
      })
    }
  }

  const returnBook = async (borrowId) => {
    setReturnLoading(true) // Use returnLoading instead of bookActionLoading
    try {
      const response = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, { method: "PUT" })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to return book")

      showMessage("success", "Book returned successfully!")
      if (data.data.fine > 0) {
        showMessage("info", `Fine of Rs. ${data.data.fine} for late return.`)
      }
      fetchMyBorrows() // Refresh borrows list
      fetchBooks(false) // Refresh book list (available quantity)
    } catch (error) {
      console.error("Error returning book:", error)
      showMessage("error", error.message || "Failed to return book.")
    } finally {
      setReturnLoading(false) // Use returnLoading instead of bookActionLoading
    }
  }

  const handleOpenPaymentModal = (borrow) => {
    setSelectedBorrowForPayment(borrow)
    setPaymentModalOpen(true)
  }

  const payFine = async (borrowId, amount) => {
    // Mock payment
    console.log(`Attempting to pay fine for borrowId: ${borrowId}, amount: ${amount}`)
    showMessage("success", `Fine of Rs. ${amount} marked as paid (mock)!`)
    setPaymentModalOpen(false)
    setSelectedBorrowForPayment(null)
    fetchMyBorrows() // Refresh borrows to show updated status (e.g., fine paid)
  }

  const isOverdue = useCallback((dueDateStr) => {
    if (!dueDateStr) return false
    const dueDate = new Date(dueDateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Compare dates only
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }, [])

  return (
    <div className="dashboard-container">
      <DashboardHeader userName={user.name} onLogout={onLogout} />
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-content">
        <MessageDisplay message={message} onClose={() => setMessage({ type: "", text: "" })} />

        {activeTab === "books" && (
          <BooksView
            books={books}
            loading={loading && books.length === 0} // Show main loading if books empty
            searchTerm={searchTerm}
            onSearchTermChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearchBooks}
            onClearSearch={handleClearSearch}
            onBorrowBook={borrowBook}
            loadingBookIds={loadingBookIds} // Pass the map instead of a single boolean
            searchLoading={searchLoading}
          />
        )}

        {activeTab === "borrows" && (
          <BorrowsView
            borrows={myBorrows}
            loading={loading}
            onReturnBook={returnBook}
            onOpenPaymentModal={handleOpenPaymentModal}
            returnLoading={returnLoading} // Use returnLoading instead of bookActionLoading
            isOverdue={isOverdue}
          />
        )}

        {activeTab === "profile" && user && (
          <ProfileView user={user} myBorrows={myBorrows} isOverdue={isOverdue} />
        )}
      </main>

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
