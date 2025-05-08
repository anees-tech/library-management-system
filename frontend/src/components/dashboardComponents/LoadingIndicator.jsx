// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\LoadingIndicator.jsx
import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = ({ text = "Loading..." }) => {
  return <div className="loading-indicator">{text}</div>;
};

export default LoadingIndicator;