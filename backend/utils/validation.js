import validator from "validator"

export const validateEmail = (email) => {
  return validator.isEmail(email)
}

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6
}

export const validateISBN = (isbn) => {
  // Remove hyphens and spaces
  const cleanISBN = isbn.replace(/[-\s]/g, "")
  // Check if it's 10 or 13 digits
  return /^\d{10}$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN)
}

export const validateRegistrationNumber = (regNumber) => {
  // Basic validation - alphanumeric, 4-20 characters
  return /^[A-Za-z0-9]{4,20}$/.test(regNumber)
}

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}

export const validateBookData = (bookData) => {
  const errors = {}

  if (!bookData.title || bookData.title.trim().length < 1) {
    errors.title = "Title is required"
  }

  if (!bookData.author || bookData.author.trim().length < 1) {
    errors.author = "Author is required"
  }

  if (!bookData.isbn || !validateISBN(bookData.isbn)) {
    errors.isbn = "Valid ISBN is required"
  }

  if (!bookData.category || bookData.category.trim().length < 1) {
    errors.category = "Category is required"
  }

  if (!bookData.quantity || bookData.quantity < 1) {
    errors.quantity = "Quantity must be at least 1"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateUserData = (userData) => {
  const errors = {}

  if (!userData.name || userData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  }

  if (!userData.email || !validateEmail(userData.email)) {
    errors.email = "Valid email is required"
  }

  if (!userData.password || !validatePassword(userData.password)) {
    errors.password = "Password must be at least 6 characters"
  }

  if (!userData.registrationNumber || !validateRegistrationNumber(userData.registrationNumber)) {
    errors.registrationNumber = "Valid registration number is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
