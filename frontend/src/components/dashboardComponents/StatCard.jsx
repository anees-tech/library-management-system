import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card-component">
      <h4>{title}</h4>
      <p className="stat-value-component">{value}</p>
    </div>
  );
};

export default StatCard;