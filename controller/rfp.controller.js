const mongoose = require("mongoose");
const rfpModel = require("../models/rfp.model");
const { authSchema5 } = require("../helpers/rfp_validation_schema");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/user.model");
const mailer = require("../helpers/mail");

module.exports = {
  // Create a new RFP
  createRFP: async (req, res, next) => {
    const formData = req.body;
    try {
      formData.org_id = req.payload.org_id;
      result = await authSchema5.validateAsync(formData);
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
      const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET); // Decode the token
      const admin_id = decoded.user_id; // Extract the user_id from the decoded token

      // Check if the RFP already exists
      const doesExist = await rfpModel.findOne({
        rfp_no: result.rfp_no,
        org_id: req.payload.org_id,
      });
      if (doesExist) {
        res.send({ response: "error", error: ["RFP Already Exists"] });
        return;
      }
      // Create and save the new RFP
      const rfp = new rfpModel(result);
      const savedRfp = await rfp.save();

      const vendorExist = await usersModel.findOne({
        user_id: result.vendors,
        org_id: req.payload.org_id,
      });
      if (vendorExist) {
        var email = vendorExist.email;
        const emailMessage = {
          to: email,
          subject: "RFP:: RFP Invtation",
          text: `Dear ${vendorExist.firstname} ${vendorExist.lastname},\n\nInvitation for RFP.\n\nBest Regards,\nRFP Demo`,
          html: `<html>
          <head>
              <title>RFP Invitation</title>
              <style>
                  table {
                      border-collapse: collapse;
                      width: 100%;
                  }
                  
                  th, td {
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                  }
              </style>
          </head>
          <body>
              <h1>RFP Invitation</h1>
              <div style="display: flex; align-items: center; justify-content: center;">
              <table style="width: 80%; border: 1px solid black; border-radius: 20px;">
                  <tr>
                      <th>Product Name</th>
                      <td>${result.item_name}r</td>
                  </tr>
                  <tr>
                      <th>Product Description</th>
                      <td>${result.item_description}</td>
                  </tr>
                  <tr>
                      <th>Quantity</th>
                      <td>${result.quantity}</td>
                  </tr>
                  <tr>
                      <th>Minimum Price</th>
                      <td>${result.minimum_price}</td>
                  </tr>
                  <tr>
                      <th>Maximum Price</th>
                      <td>${result.maximum_price}</td>
                  </tr>
                  <tr>
                      <th>Last Date</th>
                      <td>${result.last_date}</td>
                  </tr>
              </table>
              </div>
              <p>RFP system</p>
          </body>
          </html>
          `,
        };

        // Send the registration email
        await mailer(emailMessage);
      }

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
      const rfp = await rfpModel.find({ org_id: req.payload.org_id });
      res.send({ response: "success", rfps: rfp });
    } catch (error) {
      next(error);
    }
  },

  // Close an RFP
  closeRFP: async (req, res, next) => {
    const id = req.params.id;
    if (req.payload.role.includes("member")) {
      return res.send({ response: "error", error: "You are not allowed to add category" });
    }

    // Find and update the RFP status to "closed"
    const doesExist = await rfpModel.findOneAndUpdate(
      { id: id, org_id: req.payload.org_id },
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
    const doesExist = await rfpModel.find({
      vendors: id,
      org_id: req.payload.org_id,
    });

    if (!doesExist) {
      res.send({ response: "error", error: ["No RFPs found"] });
      return;
    }

    res.send({ response: "success", rfps: doesExist });
  },
};
