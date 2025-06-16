import express from "express"
import {
  getAllBorrows,
  getBorrowById,
  createBorrow,
  returnBook,
  getOverdueBorrows,
  getReports,
  payFine, // Make sure this is imported
} from "../controllers/borrowController.js"

const router = express.Router()

// Order matters - more specific routes should come first
router.get("/overdue", getOverdueBorrows)
router.get("/reports", getReports)
router.get("/", getAllBorrows)
router.get("/:id", getBorrowById)
router.post("/", createBorrow)
router.put("/:id/return", returnBook)
router.put("/:id/pay-fine", payFine) // Make sure this route exists

export default router
