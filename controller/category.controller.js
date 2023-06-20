const mongoose = require("mongoose");
const { authSchema3 } = require("../helpers/category_validation");
const categoryModel = require("../models/category.model");

module.exports = {
  addCategory: async (req, res, next) => {
    // res.send("Amit");
    const formData = req.body;
    try {
      result = await authSchema3.validateAsync(formData);
      const doesExist = await categoryModel.findOne({ name: result.name });
      if (doesExist) {
        res.send({ response: "error", error: ["Category Already Exist"] });
        return;
      }

      const category = new categoryModel(result);
      const savedCategory = await category.save();
      //   const accessToken = await signAccessToken(savedUser.id);

      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
      // throw createError.UnprocessableEntity();
      // next(error);
    }
  },
  category: async (req, res, next) => {
    try {
      const categories = await categoryModel.find();
      const formattedData = {};

      categories.forEach((category) => {
        formattedData[category.id] = {
          name: category.name,
          status: category.status,
        };
      });

      console.log(formattedData);
      res.send({ response: "success", categories: formattedData });
    } catch (error) {
      next(error);
    }
  },
  changeCategoryStatus: async (req, res, next) => {
    const formData = req.body;
    try {
      result = await authSchema3.validateAsync(formData);
      const filter = { name: result.name }; // Query criteria to find the document
      const update = { status: result.status }; // New value for the status field

      const updatedDocument = await categoryModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true, // Return the modified document after update
        }
      );

      if (!updatedDocument) {
        res.send({ response: "error", error: ["Category Not Exist"] });
        return;
      }

      res.send({ updatedDocument });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },
};
