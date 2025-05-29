"use client"

import React from "react"
import { useState } from "react"
import "./SearchFilter.css"

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onClear,
  categories = [],
  selectedCategory,
  onCategoryChange,
  placeholder = "Search...",
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "")

  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    onSearchChange(value)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const handleClear = () => {
    setLocalSearchTerm("")
    onClear()
  }

  return (
    <div className="search-filter-container">
      <div className="search-input-group">
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="search-input"
        />
        <button onClick={onSearch} className="search-button">
          Search
        </button>
        {localSearchTerm && (
          <button onClick={handleClear} className="clear-button">
            Clear
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="filter-group">
          <select
            value={selectedCategory || ""}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default SearchFilter
