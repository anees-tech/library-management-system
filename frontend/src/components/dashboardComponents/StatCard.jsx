import React from "react"
import "./StatCard.css"

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card-component">
      {icon && <div className="stat-icon">{icon}</div>}
      <h4>{title}</h4>
      <p className="stat-value-component">{value}</p>
    </div>
  )
}

export default StatCard
