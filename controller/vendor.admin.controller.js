const mongoose = require("mongoose");
const usersModel = require("../models/user.model");
const { authSchema4 } = require("../helpers/approvendor_validation");

module.exports = {
  vendorApprove: async (req, res, next) => {
    const formData = req.body;
    console.log(formData.email);
    try {
      result = await authSchema4.validateAsync(formData);

      const doesExist = await usersModel.findOneAndUpdate(
        { user_id: result.user_id },
        { status: "Approved" }
      );
      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
      // throw createError.UnprocessableEntity();
      // next(error);
    }
  },
  vendorList: async (req, res, next) => {
    try {
      const result = await usersModel.find({ type: "vendor" });
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