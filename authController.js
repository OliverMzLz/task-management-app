const express = require("express");
const bodyParser = require("body-parser");
const User = require("./userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const secret = "secret";

const router = express.Router();
router.use(bodyParser.json());

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: 86400, // 24 hours
  });
}

router.post("/register", async (req, res) => {
  try {
    // Extract user data from request body
    const { email, username, password } = req.body;

    // Check if user already exists (optional)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const newUser = new User({
      email,
      username,
      password,
    });

    // Save user and handle errors
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({ message: "Registration failed" });
    }

    // Generate JWT token
    const token = generateToken(savedUser);

    //set cookie as token
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    //set cookie as token
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User logged in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const oldPath = req.file.path;
    const newPath = `uploads/${user._id}.jpg`;

    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      user.profilePicture = newPath;
      const savedUser = await user.save();
      if (!savedUser) {
        return res.status(500).json({ message: "Internal server error" });
      }

      res.status(200).json({ message: "Profile picture uploaded" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out" });
});

module.exports = router;
