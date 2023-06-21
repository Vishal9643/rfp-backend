const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { authSchema1 } = require("../helpers/validation_schema");
const usersModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const {
  signAdminAccessToken,
  signVendorAccessToken,
} = require("../helpers/jwt_helper");
const { create } = require("../models/user.model");
const { authSchema2 } = require("../helpers/validation_schema_vendor");
const { authSchema } = require("../helpers/validation_schema_login");
const mailer = require("../helpers/mail");

module.exports = {
  // Register a new user
  register: async (req, res, next) => {
    const formData = req.body;
    console.log(formData.email);
    try {
      // Validate the form data based on the user role
      let result;
      if (formData.role == "admin") {
        result = await authSchema1.validateAsync(formData);
      } else {
        result = await authSchema2.validateAsync(formData);
      }

      // Check if the user already exists
      const doesExist = await usersModel.findOne({ email: result.email });
      if (doesExist) {
        res.send({ response: "error", error: ["User Already Exist"] });
        return;
      }

      // Create a new user
      const user = new usersModel(result);
      const savedUser = await user.save();

      // Generate and sign the access token based on the user's role
      let accessToken;
      if (savedUser.type == "vendor") {
        accessToken = await signVendorAccessToken(
          savedUser.id,
          savedUser.user_id,
          savedUser.email,
          savedUser.firstname,
          savedUser.lastname,
          savedUser.mobile
        );
      } else {
        accessToken = await signAdminAccessToken(
          savedUser.id,
          savedUser.user_id,
          savedUser.email,
          savedUser.firstname,
          savedUser.lastname,
          savedUser.mobile
        );
      }

      // Prepare the registration email message
      const emailMessage = {
        to: savedUser.email,
        subject: "Registration Successful",
        text: `Dear ${savedUser.firstname} ${savedUser.lastname},\n\nThank you for registering on our platform. Your account has been successfully created.\n\nBest Regards,\nYour Company`,
        html: `<p>Dear ${savedUser.firstname} ${savedUser.lastname},</p>
        <p>Thank you for registering on our platform. Your account has been successfully created.</p>
        <p>Best Regards,<br>Your Company</p>`,
      };

      // Send the registration email
      await mailer(emailMessage);

      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },

  // User login
  login: async (req, res, next) => {
    console.log(req.body);
    const formData = req.body;
    try {
      const result = await authSchema.validateAsync(formData);

      // Check if the user exists
      const doesExist = await usersModel.findOne({ email: result.email });
      if (!doesExist) {
        res.send({ response: "error", error: ["User Not Registered"] });
      }

      // Check if the password matches
      const isMatch = await bcrypt.compare(result.password, doesExist.password);
      if (!isMatch) {
        res.send({ response: "error", error: ["Incorrect Password"] });
      }

      // Handle pending approval for vendor accounts
      if (doesExist.status == "Pending" && doesExist.type == "vendor") {
        res.send({ response: "error", error: ["Approval Pending"] });
        return;
      }

      // Generate and sign the access token based on the user's type
      let accessToken;
      if (doesExist.type == "vendor") {
        accessToken = await signVendorAccessToken(
          doesExist.id,
          doesExist.user_id,
          doesExist.email,
          doesExist.firstname,
          doesExist.lastname,
          doesExist.mobile
        );
      } else {
        accessToken = await signAdminAccessToken(
          doesExist.id,
          doesExist.user_id,
          doesExist.email,
          doesExist.firstname,
          doesExist.lastname,
          doesExist.mobile
        );
      }

      // Prepare the login alert email message
      const emailMessage = {
        to: doesExist.email,
        subject: "RFP Alert: Login Detected",
        text: `Hello ${doesExist.firstname} ${doesExist.lastname}, \n\nWe have detected a login attempt on your account. Please review the details below and contact us if you did not initiate this login. \n\nDetails: \n\nIP Address: [IP_ADDRESS] \nLocation: [LOCATION] \nDevice: [DEVICE] \n\nBest Regards, \nYour Company`,
        html: `<p>Hello ${doesExist.firstname} ${doesExist.lastname},</p>
    <p>We have detected a login attempt on your account. Please review the details below and contact us if you did not initiate this login.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li><strong>IP Address:</strong> [IP_ADDRESS]</li>
      <li><strong>Location:</strong> [LOCATION]</li>
      <li><strong>Device:</strong> [DEVICE]</li>
    </ul>
    <p>Best Regards,<br>Your Company</p>`,
      };

      // Send the login alert email
      await mailer(emailMessage);

      res.send({
        token: accessToken,
        response: "success",
        user_id: doesExist.user_id,
        type: doesExist.type,
        name: `${doesExist.firstname} ${doesExist.lastname}`,
        email: doesExist.email,
      });
    } catch (error) {
      next(error);
    }
  },

  // Reset user password
  reset: async (req, res, next) => {
    console.log(req.body);
    const formData = req.body;
    try {
      const doesExist = await usersModel.findOne({ email: formData.email });
      if (!doesExist)
        throw next(createError.NotFound("User is not registered"));

      var accessToken = await signAdminAccessToken(
        doesExist.id,
        doesExist.user_id,
        doesExist.email,
        doesExist.firstname,
        doesExist.lastname,
        doesExist.mobile
      );

      // Prepare the reset password email message
      const emailMessage = {
        to: doesExist.email,
        subject: "RFP Alert: Forget Password",
        text: `Hello ${doesExist.firstname} ${doesExist.lastname}, \n\nPlease check the following link to reset your password: \n\nhttps://rfp-demo.netlify.app/forget-password/${accessToken}`,
        html: `<p>Hello ${doesExist.firstname} ${doesExist.lastname},</p>
    <p>Please check the following link to reset your password:</p>
    <ul>
      <li><strong>https://rfp-demo.netlify.app/forget-password/${accessToken}</li>
    </ul>
    <p>Best Regards,<br>RFP Demo</p>`,
      };

      // Send the reset password email
      await mailer(emailMessage);
      res.send({
        token: accessToken,
        response: "success",
        user_id: doesExist.user_id,
        type: doesExist.type,
        name: `${doesExist.firstname} ${doesExist.lastname}`,
        email: doesExist.email,
      });
    } catch (error) {
      next(error);
    }
  },

  // Forget password controller
  forget: async (req, res, next) => {
    const formData = req.body;
    console.log(formData);
    try {
      const authHeader = req.headers["authorization"];
      console.log(authHeader);
      const token = authHeader && authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
      const email = decoded.email;
      console.log(email);
      const newPassword = await bcrypt.hash(formData.password, 10);

      const doesExist = await usersModel.findOneAndUpdate(
        { email: email },
        { password: newPassword }
      );
      if (!doesExist) {
        res.send({ response: "error", error: ["User does not exist"] });
        return;
      }
      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },
};
