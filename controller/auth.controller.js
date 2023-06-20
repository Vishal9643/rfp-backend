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
        text: `Dear ${savedUser.name},\n\nThank you for registering on our platform. Your account has been successfully created.\n\nBest Regards,\nYour Company`,
        html: `<p>Dear ${savedUser.name},</p>
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
