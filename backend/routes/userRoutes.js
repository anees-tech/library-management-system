import express from "express"
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserBorrowHistory,
} from "../controllers/userController.js"

const router = express.Router()

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.get("/:id/borrows", getUserBorrowHistory)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router
