const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body; //change 1
  try {
    let user = await User.findOne({ email });
    if (user)
      // use or !user
      return res
        .status(400)
        .json({ message: "User already exists", code: 403 });

    // new user create machanism

    user = new User({ name, email, password, confirmpassword }); // change 2
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      status: 201,
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" + err });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res
        .status(400)
        .json({ message: "Invalid credentials", code: 403 });

    res.json({ message: "Login successful", user, code: 201, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
