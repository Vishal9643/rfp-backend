const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { authSchema1 } = require("../helpers/validation_schema");
const usersModel = require("../models/user.model");
const createError = require("http-errors");
const {
  signAdminAccessToken,
  signVendorAccessToken,
} = require("../helpers/jwt_helper");
const { create } = require("../models/user.model");
const { authSchema2 } = require("../helpers/validation_schema_vendor");
const { authSchema } = require("../helpers/validation_schema_login");
const mailer = require("../helpers/mail");
// const { otpSend } = require("./otpmail.controller");

module.exports = {
  register: async (req, res, next) => {
    const formData = req.body;
    console.log(formData.email);
    try {
      if (formData.role == "admin") {
        result = await authSchema1.validateAsync(formData);
      } else {
        result = await authSchema2.validateAsync(formData);
      }
      const doesExist = await usersModel.findOne({ email: result.email });
      if (doesExist) {
        res.send({ response: "error", error: ["User Already Exist"] });
        return;
      }
      // throw createError.Conflict(`${formData.email} already exists`);

      const user = new usersModel(result);
      const savedUser = await user.save();
      const accessToken = await signAdminAccessToken(savedUser.id);
      const emailMessage = {
        to: savedUser.email,
        subject: "Registration Successful",
        text: `Dear ${savedUser.firstname} ${savedUser.lastname},\n\nThank you for registering on our platform. Your account has been successfully created.\n\nBest Regards,\nYour Company`,
        html: `<p>Dear ${savedUser.firstname} ${savedUser.lastname},</p>
        <p>Thank you for registering on our platform. Your account has been successfully created.</p>
        <p>Best Regards,<br>Your Company</p>`,
      };

      // Send registration email
      await mailer(emailMessage);

      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
      // throw createError.UnprocessableEntity();
      // next(error);
    }
  },
  login: async (req, res, next) => {
    console.log(req.body);
    const formData = req.body;
    try {
      const result = await authSchema.validateAsync(formData);
      const doesExist = await usersModel.findOne({ email: result.email });
      if (!doesExist)
        throw next(createError.NotFound("User is not registered"));
      const isMatch = await bcrypt.compare(result.password, doesExist.password);
      if (!isMatch) throw createError.BadRequest("Email/Password is incorrect");

      if (doesExist.status == "Pending" && doesExist.type == "vendor") {
        res.send({ response: "error", error: ["Approval Pending"] });
      }
      // userId, email, firstName, lastName, mobile
      if (doesExist.type == "vendor") {
        var accessToken = await signVendorAccessToken(
          doesExist.id,
          doesExist.user_id,
          doesExist.email,
          doesExist.firstname,
          doesExist.lastname,
          doesExist.mobile
        );
      } else {
        var accessToken = await signAdminAccessToken(doesExist.id);
      }

      const emailMessage = {
        to: doesExist.email,
        subject: "RFP Alert: Login Detected", // Subject line
        text: `Hello ${doesExist.firstname} ${doesExist.lastname}, \n\nWe have detected a login attempt on your account. Please review the details below and contact us if you did not initiate this login. \n\nDetails: \n\nIP Address: [IP_ADDRESS] \nLocation: [LOCATION] \nDevice: [DEVICE] \n\nBest Regards, \nYour Company`, // Plain text body
        html: `<p>Hello ${doesExist.firstname} ${doesExist.lastname},</p>
    <p>We have detected a login attempt on your account. Please review the details below and contact us if you did not initiate this login.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li><strong>IP Address:</strong> [IP_ADDRESS]</li>
      <li><strong>Location:</strong> [LOCATION]</li>
      <li><strong>Device:</strong> [DEVICE]</li>
    </ul>
    <p>Best Regards,<br>Your Company</p>`, // HTML body
      };

      // Send registration email
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
  reset: async (req, res, next) => {
    console.log(req.body);
    const formData = req.body;
    try {
      // const result = await authSchema.validateAsync(formData);
      const doesExist = await usersModel.findOne({ email: formData.email });
      if (!doesExist)
        throw next(createError.NotFound("User is not registered"));
      // const isMatch = await bcrypt.compare(result.password, doesExist.password);
      // if (!isMatch) throw createError.BadRequest("Email/Password is incorrect");

      // if (doesExist.status == "Pending" && doesExist.type == "vendor") {
      //   res.send({ response: "error", error: ["Approval Pending"] });
      // }
      // userId, email, firstName, lastName, mobile
      if (doesExist.type == "vendor") {
        var accessToken = await signVendorAccessToken(
          doesExist.id,
          doesExist.user_id,
          doesExist.email,
          doesExist.firstname,
          doesExist.lastname,
          doesExist.mobile
        );
      } else {
        var accessToken = await signAdminAccessToken(doesExist.id);
      }

      const emailMessage = {
        to: doesExist.email,
        subject: "RFP Alert: Forget Password", // Subject line
        text: `Hello ${doesExist.firstname} ${doesExist.lastname}, \n\n Please check on link to reset password \n\n https://rfp-demo.netlify.app/forget-password/${accessToken}`, // Plain text body
        html: `<p>Hello ${doesExist.firstname} ${doesExist.lastname},</p>
    <p>Please check on link to reset password </p>
    <ul>
      <li><strong>https://rfp-demo.netlify.app/forget-password/${accessToken}</li>
      
    </ul>
    <p>Best Regards,<br>RFP Demo</p>`, // HTML body
      };

      // Send registration email
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
};
