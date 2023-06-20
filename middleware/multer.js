const multer = require("multer");

// Create a Multer instance with options
const upload = multer();

// Middleware function to handle form data
const formDataMiddleware = (req, res, next) => {
  upload.none()(req, res, (error) => {
    if (error) {
      // Handle any error that occurred during form data parsing
      return res.status(400).json({ error: "Invalid form data" });
    }
    next();
  });
};

module.exports = formDataMiddleware;
