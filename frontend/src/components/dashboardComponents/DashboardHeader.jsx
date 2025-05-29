// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\DashboardHeader.jsx
import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ userName, onLogout }) => {
  return (
    <header className="dashboard-header-component">
      <h1>Library Management System</h1>
      <div className="user-info-component">
        <span>Welcome, {userName}</span>
        <button onClick={onLogout} className="logout-button-component">
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
