"use client"
import React from "react"

import { useState, useEffect } from "react"
import "../../styles/AdminForms.css"

const BookForm = ({ book, onSubmit, onCancel, categories }) => { // Add categories to props
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: categories && categories.length > 0 ? categories[0] : "", // Default to first category or empty
    description: "", // Add description field
    quantity: 1,
    imageUrl: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState("")

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || (categories && categories.length > 0 ? categories[0] : ""),
        description: book.description || "", // Add description
        quantity: book.quantity || 1,
        imageUrl: book.imageUrl || book.coverImage || "", // check for coverImage as well
      })
      setPreviewImage(book.imageUrl || book.coverImage || "")
    } else {
      // For new book, ensure category defaults correctly if categories are available
      setFormData(prev => ({
        ...prev,
        category: categories && categories.length > 0 ? categories[0] : "",
        title: "", // Reset other fields for new book form
        author: "",
        isbn: "",
        description: "", // Reset description
        quantity: 1,
        imageUrl: "",
      }));
      setPreviewImage("");
    }
  }, [book, categories])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "quantity" ? Number.parseInt(value) || "" : value,
    })
  }

  const handleImageChange = (e) => {
    const imageUrl = e.target.value
    setFormData({
      ...formData,
      imageUrl,
    })
    setPreviewImage(imageUrl) // Update preview image
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
    if (!formData.category || formData.category.trim() === "") newErrors.category = "Category is required" // Ensure category is selected
    // Description is optional, so no validation needed
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1"
    // URL validation is optional since image might not be provided
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Simple URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{book ? "Edit Book" : "Add New Book"}</h2>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} />
        {errors.author && <span className="error">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="isbn">ISBN</label>
        <input
          type="text"
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          disabled={book ? true : false} // ISBN cannot be changed for existing books
        />
        {errors.isbn && <span className="error">{errors.isbn}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}>
          {/* Optional: Add a default "Select a category" option if you don't want to default to the first one */}
          {/* <option value="">Select a category</option> */}
          {categories && categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          rows="4"
          placeholder="Enter book description (optional)"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input type="number" id="quantity" name="quantity" min="1" value={formData.quantity} onChange={handleChange} />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Book Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleImageChange}
          placeholder="https://example.com/book-image.jpg"
        />
        {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
        
        {previewImage && (
          <div className="image-preview">
            <p>Image Preview:</p>
            <img 
              src={previewImage} 
              alt="Book preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                setErrors({...errors, imageUrl: "Image URL is invalid or inaccessible"});
              }}
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Saving..." : book ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  )
}

export default BookForm
