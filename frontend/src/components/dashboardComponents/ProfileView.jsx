// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\ProfileView.jsx
import React from 'react';
import StatCard from './StatCard';
import './ProfileView.css';

const ProfileView = ({ user, myBorrows, isOverdue }) => {
  const calculateTotalFines = () => {
    return myBorrows.reduce((total, borrow) => {
      if (borrow.status === "returned") {
        return total + (borrow.fine || 0);
      } else if (isOverdue(borrow.dueDate)) {
        const daysOverdue = Math.max(0, Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)));
        return total + daysOverdue * 10; // Assuming fine is 10 per day
      }
      return total;
    }, 0);
  };

  return (
    <div className="profile-view-component">
      <h2>My Profile</h2>
      <div className="profile-details-component">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Registration Number:</strong> {user.registrationNumber}
        </p>
        <p>
          <strong>College Roll Number:</strong> {user.collegeRollNumber || "N/A"}
        </p>
        <p>
          <strong>University Roll Number:</strong> {user.universityRollNumber || "N/A"}
        </p>
        <p>
          <strong>Contact Number:</strong> {user.contactNumber || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="borrow-stats-component">
        <h3>Borrowing Statistics</h3>
        <div className="stats-grid-component">
          <StatCard title="Total Borrowed" value={myBorrows.length} />
          <StatCard
            title="Currently Borrowed"
            value={myBorrows.filter((borrow) => borrow.status !== "returned").length}
          />
          <StatCard
            title="Overdue"
            value={
              myBorrows.filter(
                (borrow) => borrow.status !== "returned" && isOverdue(borrow.dueDate)
              ).length
            }
          />
          <StatCard title="Total Fines" value={`Rs. ${calculateTotalFines()}`} />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;