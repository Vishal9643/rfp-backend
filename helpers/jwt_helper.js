const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { create } = require("../models/user.model");

module.exports = {
  signAdminAccessToken: (
    userid,
    userId,
    email,
    firstName,
    lastName,
    mobile
  ) => {
    return new Promise((resolve, reject) => {
      const payload = {
        user_id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
      };
      const secret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: "30000s",
        issuer: "test.test",
        audience: userid,
      };
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAdminAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send("Unauthorized");
    }

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    JWT.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return res.status(401).send(message);
      }

      req.payload = payload;
      next();
    });
  },
  signVendorAccessToken: (
    userid,
    userId,
    email,
    firstName,
    lastName,
    mobile
  ) => {
    return new Promise((resolve, reject) => {
      const payload = {
        user_id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
      };
      const secret = process.env.VENDOR_ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: "30000s",
        issuer: "test.test",
        audience: userid,
      };
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyVendorAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send("Unauthorized");
    }

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    JWT.verify(
      token,
      process.env.VENDOR_ACCESS_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          return res.status(401).send(message);
        }

        req.payload = payload;
        next();
      }
    );
  },
};
