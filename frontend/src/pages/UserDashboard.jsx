"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import UserSidebar from "../components/UserSidebar"
import Header from "../components/Header"
import "../styles/Dashboard.css"

// Dummy data for user dashboard
const userStats = {
    booksIssued: 2,
    booksReturned: 5,
    finesPaid: 150,
    booksAvailable: 245,
}

const recentActivities = [
    { id: 1, action: "Book Borrowed", book: "Introduction to Algorithms", date: "2025-04-24" },
    { id: 2, action: "Book Returned", book: "Database Systems", date: "2025-04-23" },
    { id: 3, action: "Fine Paid", amount: "Rs. 50", book: "Operating System Concepts", date: "2025-04-20" },
    { id: 4, action: "Book Reserved", book: "Computer Networks", date: "2025-04-19" },
    { id: 5, action: "Book Renewed", book: "Artificial Intelligence: A Modern Approach", date: "2025-04-18" },
]

const recommendedBooks = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming" },
    { id: 2, title: "Design Patterns", author: "Erich Gamma", category: "Programming" },
    { id: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming" },
    { id: 4, title: "Refactoring", author: "Martin Fowler", category: "Programming" },
]

const UserDashboard = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData && !user) {
            setUser(JSON.parse(userData))
        }
    }, [user])
    return (
        <div className="dashboard-container">
            <UserSidebar />
            <div className="main-content">
                <Header title="User Dashboard" user={user} />

                <div className="welcome-message">
                    <h2>Welcome back, {user?.name || "User"}!</h2>
                    <p>Here's an overview of your library activities</p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon books-icon">📚</div>
                        <div className="stat-details">
                            <h3>Books Issued</h3>
                            <p>{userStats.booksIssued}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon issued-icon">📖</div>
                        <div className="stat-details">
                            <h3>Books Returned</h3>
                            <p>{userStats.booksReturned}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon users-icon">💰</div>
                        <div className="stat-details">
                            <h3>Fines Paid</h3>
                            <p>Rs. {userStats.finesPaid}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon overdue-icon">📊</div>
                        <div className="stat-details">
                            <h3>Books Available</h3>
                            <p>{userStats.booksAvailable}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section recent-activities">
                        <h2>Recent Activities</h2>
                        <div className="activity-list">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-details">
                                        <h4>{activity.action}</h4>
                                        <p>
                                            <strong>Book:</strong> {activity.book}
                                        </p>
                                        {activity.amount && (
                                            <p>
                                                <strong>Amount:</strong> {activity.amount}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Date:</strong> {activity.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section recommended-books">
                        <h2>Recommended Books</h2>
                        <div className="book-list">
                            {recommendedBooks.map((book) => (
                                <div key={book.id} className="book-item">
                                    <h4>{book.title}</h4>
                                    <p>
                                        <strong>Author:</strong> {book.author}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {book.category}
                                    </p>
                                    <button className="borrow-btn">Borrow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <Link to="/user/books" className="action-button">
                            <span>Browse Books</span>
                        </Link>
                        <Link to="/user/issued" className="action-button">
                            <span>My Issued Books</span>
                        </Link>
                        <Link to="/user/history" className="action-button">
                            <span>Borrowing History</span>
                        </Link>
                        <Link to="/user/profile" className="action-button">
                            <span>My Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
