import React from "react"
import "./LoadingIndicator.css"

const LoadingIndicator = ({ text = "Loading..." }) => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  )
}

export default LoadingIndicator
