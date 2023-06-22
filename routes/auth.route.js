const express = require("express");
const { token } = require("morgan");
const router = express.Router();

// Importing authentication controller functions
const {
  register,
  login,
  reset,
  forget,
} = require("../controller/auth.controller");

// Importing middleware for handling form data
const formDataMiddleware = require("../middleware/multer");

// Importing category controller functions
const { category } = require("../controller/category.controller");

// Routes

// User registration
router.post("/register", formDataMiddleware, register);

// User login
router.post("/login", formDataMiddleware, login);

// Get category (public access)
router.get("/category", category);

// Reset password
router.post("/reset", formDataMiddleware, reset);

// Forget password
router.post("/forget", formDataMiddleware, forget);

module.exports = router;
