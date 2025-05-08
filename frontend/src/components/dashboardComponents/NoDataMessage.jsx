// filepath: c:\Users\anees\Downloads\Compressed\library-management-system_2\frontend\src\components\dashboardComponents\NoDataMessage.jsx
import React from 'react';
import './NoDataMessage.css';

const NoDataMessage = ({ text = "No data available." }) => {
  return <div className="no-data-message">{text}</div>;
};

export default NoDataMessage;