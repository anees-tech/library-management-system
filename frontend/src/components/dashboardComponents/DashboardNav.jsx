// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\DashboardNav.jsx
import React from 'react';
import './DashboardNav.css';

const DashboardNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "books", label: "Books" },
    { id: "borrows", label: "My Borrows" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="dashboard-nav-component">
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashboardNav;