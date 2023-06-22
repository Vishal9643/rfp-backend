const express = require("express");
const { token } = require("morgan");
const router = express.Router();

// Importing middleware for handling form data
const formDataMiddleware = require("../middleware/multer");

// Importing JWT helper functions for token verification
const { verifyVendorAccessToken } = require("../helpers/jwt_helper");

// Importing RFP controller functions
const { vendorViewRFP } = require("../controller/rfp.controller");

// Importing quotes controller functions
const { applyRFP } = require("../controller/quotes.controller");

// Routes

// View RFP for a vendor (vendor access required)
router.get("/rfp/getrfp/:id", verifyVendorAccessToken, vendorViewRFP);

// Apply for an RFP (vendor access required)
router.post(
  "/applyrfp/:id",
  verifyVendorAccessToken,
  formDataMiddleware,
  applyRFP
);

module.exports = router;
