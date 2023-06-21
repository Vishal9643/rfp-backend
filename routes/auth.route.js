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

// Importing JWT helper functions for token verification
const {
  verifyAdminAccessToken,
  verifyVendorAccessToken,
} = require("../helpers/jwt_helper");

// Importing category controller functions
const {
  category,
  addCategory,
  changeCategoryStatus,
} = require("../controller/category.controller");

// Importing vendor admin controller functions
const {
  vendorList,
  vendorApprove,
  removeVendor,
} = require("../controller/vendor.admin.controller");

// Importing RFP controller functions
const {
  createRFP,
  viewRFP,
  closeRFP,
  vendorViewRFP,
} = require("../controller/rfp.controller");

// Importing quotes controller functions
const { applyRFP, viewQuotes } = require("../controller/quotes.controller");

// Routes

// User registration
router.post("/register", formDataMiddleware, register);

// User login
router.post("/login", formDataMiddleware, login);

// Get all categories (admin access required)
router.get("/categories", verifyAdminAccessToken, category);

// Get category (public access)
router.get("/category", category);

// Add a new category (admin access required)
router.post(
  "/addcategory",
  verifyAdminAccessToken,
  formDataMiddleware,
  addCategory
);

// Change category status (admin access required)
router.post(
  "/changecategorystatus",
  verifyAdminAccessToken,
  formDataMiddleware,
  changeCategoryStatus
);

// Get list of vendors (admin access required)
router.get("/vendorlist", verifyAdminAccessToken, vendorList);

// Approve a vendor (admin access required)
router.post(
  "/approvevendor",
  verifyAdminAccessToken,
  formDataMiddleware,
  vendorApprove
);

// Create an RFP (admin access required)
router.post(
  "/createrfp",
  verifyAdminAccessToken,
  formDataMiddleware,
  createRFP
);

// Remove a vendor (admin access required)
router.post(
  "/removevendor",
  verifyAdminAccessToken,
  formDataMiddleware,
  removeVendor
);

// View RFP (admin access required)
router.get("/viewrfp", verifyAdminAccessToken, viewRFP);

// Close RFP (admin access required)
router.get("/rfp/closerfp/:id", verifyAdminAccessToken, closeRFP);

// View RFP for a vendor (vendor access required)
router.get("/rfp/getrfp/:id", verifyVendorAccessToken, vendorViewRFP);

// View quotes for an RFP (admin access required)
router.get("/rfp/getquotes/:id", verifyAdminAccessToken, viewQuotes);

// Apply for an RFP (vendor access required)
router.post(
  "/applyrfp/:id",
  verifyVendorAccessToken,
  formDataMiddleware,
  applyRFP
);

// Reset password
router.post("/reset", formDataMiddleware, reset);

// Forget password
router.post("/forget", formDataMiddleware, forget);

module.exports = router;
