const mongoose = require("mongoose");
const usersModel = require("../models/user.model");
const { authSchema4 } = require("../helpers/approvendor_validation");
const { authSchema6 } = require("../helpers/removevendor_validaton");
const mailer = require("../helpers/mail");

module.exports = {
  // Remove a vendor
  removeVendor: async (req, res, next) => {
    const formData = req.body;
    console.log(formData.email);
    try {
      const result = await authSchema6.validateAsync(formData);

      // Find and delete the user
      const removedUser = await usersModel.findOneAndDelete({
        user_id: result.user_id,
      });

      if (removedUser) {
        res.send({ response: "success" });
      } else {
        res.send({ response: "User not found" });
      }
    } catch (error) {
      res.send({ error: error.message });
    }
  },

  // Approve a vendor
  vendorApprove: async (req, res, next) => {
    const formData = req.body;
    console.log(formData.email);
    try {
      result = await authSchema4.validateAsync(formData);

      // Update the user status to "Approved"
      const doesExist = await usersModel.findOneAndUpdate(
        { user_id: result.user_id },
        { status: "Approved" }
      );
      // Prepare the approve vendor email message
      const emailMessage = {
        to: formData.email,
        subject: "Vendor Approve",
        text: `Dear User Id ${result.user_id} ,\n\n Your RFP Vendor account is approved.\n\nThanks & Regards\nRFP Demo`,
        html: `<p>Dear User Id ${result.user_id},</p>
        <p>Your RFP Vendor account is approved.</p>
        <p>Thanks & Regards,<br>RFP Demo</p>`,
      };

      // Send the approve vendor email
      await mailer(emailMessage);

      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },

  // Get the list of vendors
  vendorList: async (req, res, next) => {
    try {
      const result = await usersModel.find({ type: "vendor" });

      // Format the result with necessary fields
      const resultWithNames = result.map((doc) => {
        const {
          firstname,
          lastname,
          user_id,
          email,
          mobile,
          no_of_employees,
          status,
          category,
        } = doc;
        const name = `${firstname} ${lastname}`;
        return {
          name,
          user_id,
          email,
          mobile,
          no_of_employees,
          status,
          category,
        };
      });

      res.send({
        response: "success",
        vendors: resultWithNames,
      });
    } catch (error) {
      next(error);
    }
  },
};
