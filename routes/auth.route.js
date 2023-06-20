const express = require("express");
const { token } = require("morgan");
const router = express.Router();
const { register, login } = require("../controller/auth.controller");
const formDataMiddleware = require("../middleware/multer");
const {
  verifyAdminAccessToken,
  verifyVendorAccessToken,
} = require("../helpers/jwt_helper");
const {
  category,
  addCategory,
  changeCategoryStatus,
} = require("../controller/category.controller");
const {
  vendorList,
  vendorApprove,
} = require("../controller/vendor.admin.controller");
const {
  createRFP,
  viewRFP,
  closeRFP,
  vendorViewRFP,
} = require("../controller/rfp.controller");
const { applyRFP } = require("../controller/quotes.controller");

// const { otpSend } = require("../controller/otpmail.controller");

router.post("/register", formDataMiddleware, register);

router.post("/login", formDataMiddleware, login);

router.get("/categories", verifyAdminAccessToken, category);

router.get("/category", category);

router.post(
  "/addcategory",
  verifyAdminAccessToken,
  formDataMiddleware,
  addCategory
);

router.post(
  "/changecategorystatus",
  verifyAdminAccessToken,
  formDataMiddleware,
  changeCategoryStatus
);

router.get("/vendorlist", verifyAdminAccessToken, vendorList);

router.post(
  "/approvevendor",
  verifyAdminAccessToken,
  formDataMiddleware,
  vendorApprove
);

router.post(
  "/createrfp",
  verifyAdminAccessToken,
  formDataMiddleware,
  createRFP
);

router.get("/viewrfp", verifyAdminAccessToken, viewRFP);

router.get("/rfp/closerfp/:id", verifyAdminAccessToken, closeRFP);

router.get("/rfp/getrfp/:id", verifyVendorAccessToken, vendorViewRFP);

router.post(
  "/applyrfp/:id",
  verifyVendorAccessToken,
  formDataMiddleware,
  applyRFP
);

// router.post("/verify-otp", otpSend);

// router.delete("/logout", logout);

module.exports = router;