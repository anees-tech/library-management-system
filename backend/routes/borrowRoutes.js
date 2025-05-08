import express from "express"
import {
  getAllBorrows,
  getBorrowById,
  createBorrow,
  returnBook,
  getOverdueBorrows,
  getReports,
} from "../controllers/borrowController.js"

const router = express.Router()

router.get("/", getAllBorrows)
router.get("/overdue", getOverdueBorrows)
router.get("/reports", getReports)
router.get("/:id", getBorrowById)
router.post("/", createBorrow)
router.put("/:id/return", returnBook)

export default router
