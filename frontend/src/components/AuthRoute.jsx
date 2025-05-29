import { Navigate } from "react-router-dom";
import React from "react"

// AuthRoute is used to redirect authenticated users away from auth pages
// For example, redirect logged-in users away from login page
const AuthRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  
  if (user) {
    const userData = JSON.parse(user);
    // If user is logged in, redirect to appropriate dashboard
    return <Navigate to={userData.role === "admin" ? "/admin" : "/dashboard"} />;
  }
  
  // If not logged in, show the children components (login/signup pages)
  return children;
};

export default AuthRoute;
