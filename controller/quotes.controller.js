const mongoose = require("mongoose");
const rfpModel = require("../models/rfp.model");
const jwt = require("jsonwebtoken");
const { authSchema6 } = require("../helpers/quotes_validation");
const quotesModel = require("../models/quotes.model");

module.exports = {
  // View quotes for a specific RFP
  viewQuotes: async (req, res, next) => {
    const id = req.params.id;
    try {
      const rfp = await quotesModel.find({ id: `${id}`, org_id : req.payload.org_id });
      res.send({ response: "success", quotes: rfp });
    } catch (error) {
      next(error);
    }
  },

  // Apply for an RFP
  applyRFP: async (req, res, next) => {
    const id = req.params.id;
    const formData = req.body;
    console.log(formData);
    try {
      result = await authSchema6.validateAsync(formData);
      const authHeader = req.headers["authorization"];
      console.log(authHeader);
      const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
      const decoded = jwt.verify(token, process.env.VENDOR_ACCESS_TOKEN_SECRET); // Decode the token
      console.log(decoded);
      const vendor_id = decoded.user_id; // Extract the user_id from the decoded token
      const email = decoded.email; // Extract the email from the decoded token
      const first_name = decoded.first_name;
      const last_name = decoded.last_name;
      const mobile = decoded.mobile;

      // Set additional data for the quote
      result.vendor_id = vendor_id;
      result.email = email;
      result.name = `${first_name} ${last_name}`;
      result.id = id;
      result.mobile = mobile;

      // Check if the RFP exists
      const doesExist = await rfpModel.findOne({ id: id, org_id : req.payload.org_id });
      if (!doesExist) {
        res.send({ response: "error", error: ["RFP Does Not Exist"] });
        return;
      }
      // Check if RFP is closed
      if (doesExist.status == "closed") {
        res.send({ response: "error", error: ["RFP is Closed"] });
        return;
      }
      // Check if the RFP exists
      const alreadyApplied = await quotesModel.findOne({
        id: id,
        vendor_id: vendor_id,
      });
      if (alreadyApplied) {
        res.send({ response: "error", error: ["You have already applied"] });
        return;
      }

      // Create and save the quote
      const quotes = new quotesModel(result);
      const savedQuotes = await quotes.save();
      res.send({ response: "success", rfps: result });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },
};
