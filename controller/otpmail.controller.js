const mongoose = require("mongoose");
const otpModel = require("../models/otp.model");
const createError = require("http-errors");
const mailer = require("../helpers/mail");
const usersModel = require("../models/user.model");

module.exports = {
  otpSend: async (req, res, next) => {
    // console.log(req, "...........................for otpSend module");
    const generateOTP = () => {
      const digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    };

    const GenerateOTP = await generateOTP();
    const otp = {
      email: req.body.email,
      OTP: GenerateOTP,
    };

    // result = await authSchema.validateAsync(req.body);
    // const doesExist = await usersModel.findOne({ email: result.email });
    // if (doesExist)
    //   throw createError.Conflict(`${req.body.email} already existed`);

    const otpInfo = await mailer(otp);

    console.log(otpInfo);

    const stringGenerateOTP = `${GenerateOTP}`;

    if (otpInfo) {
      res.cookie("otp", stringGenerateOTP).status(200).send(stringGenerateOTP);
    } else {
      return next();
    }
  },
};
