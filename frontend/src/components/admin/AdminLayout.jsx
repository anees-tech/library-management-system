"use client"
import React from "react"

import { Link, useLocation } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import "../../styles/AdminLayout.css"

const AdminLayout = ({ user, onLogout, children }) => {
  const location = useLocation()

  return (
    <div className="admin-container">
      <AdminSidebar user={user} onLogout={onLogout} />
      
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
