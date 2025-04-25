const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: true },
  role: { type: String, default: "user" },
  regNo: { type: String, required: false },
  collegeRollNo: { type: String, required: false },
  universityRollNo: { type: String, required: false },
  contact: { type: String, required: false },
  type: { type: String, default: "Student" },
  booksIssued: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
