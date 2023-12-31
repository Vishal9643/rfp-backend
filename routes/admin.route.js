const express = require("express");
const { token } = require("morgan");
const router = express.Router();

// Importing middleware for handling form data
const formDataMiddleware = require("../middleware/multer");

// Importing JWT helper functions for token verification
const { verifyAdminAccessToken } = require("../helpers/jwt_helper");

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
} = require("../controller/rfp.controller");

// Importing quotes controller functions
const { viewQuotes } = require("../controller/quotes.controller");

// Routes

// Get all categories (admin access required)
router.get("/categories", verifyAdminAccessToken, category);

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

// View quotes for an RFP (admin access required)
router.get("/rfp/getquotes/:id", verifyAdminAccessToken, viewQuotes);

module.exports = router;
