import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    collegeRollNumber: {
      type: String,
      trim: true,
    },
    universityRollNumber: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model("User", userSchema)
