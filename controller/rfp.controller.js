const mongoose = require("mongoose");
const rfpModel = require("../models/rfp.model");
const { authSchema5 } = require("../helpers/rfp_validation_schema");
const jwt = require("jsonwebtoken");

module.exports = {
  // Create a new RFP
  createRFP: async (req, res, next) => {
    const formData = req.body;
    console.log(formData);
    try {
      result = await authSchema5.validateAsync(formData);
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
      const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET); // Decode the token
      const admin_id = decoded.user_id; // Extract the user_id from the decoded token
      console.log(admin_id);

      // Check if the RFP already exists
      const doesExist = await rfpModel.findOne({ rfp_no: result.rfp_no });
      if (doesExist) {
        res.send({ response: "error", error: ["RFP Already Exists"] });
        return;
      }

      // Create and save the new RFP
      const rfp = new rfpModel(result);
      const savedRfp = await rfp.save();

      res.send({ response: "success", admin_id: admin_id });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },

  // View all RFPs
  viewRFP: async (req, res, next) => {
    try {
      const rfp = await rfpModel.find();
      res.send({ response: "success", rfps: rfp });
    } catch (error) {
      next(error);
    }
  },

  // Close an RFP
  closeRFP: async (req, res, next) => {
    const id = req.params.id;

    // Find and update the RFP status to "closed"
    const doesExist = await rfpModel.findOneAndUpdate(
      { id: id },
      { status: "closed" }
    );

    if (!doesExist) {
      res.send({ response: "error", error: ["RFP does not exist"] });
      return;
    }

    res.send({ response: "success" });
  },

  // View RFPs for a specific vendor
  vendorViewRFP: async (req, res, next) => {
    const id = req.params.id;

    // Find RFPs associated with the vendor
    const doesExist = await rfpModel.find({ vendors: id });

    if (!doesExist) {
      res.send({ response: "error", error: ["No RFPs found"] });
      return;
    }

    res.send({ response: "success", rfps: doesExist });
  },
};
