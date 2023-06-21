const mongoose = require("mongoose");
const { authSchema3 } = require("../helpers/category_validation");
const categoryModel = require("../models/category.model");

module.exports = {
  // Add a new category
  addCategory: async (req, res, next) => {
    const formData = req.body;
    try {
      result = await authSchema3.validateAsync(formData);

      // Check if the category already exists
      const doesExist = await categoryModel.findOne({ name: result.name });
      if (doesExist) {
        res.send({ response: "error", error: ["Category Already Exists"] });
        return;
      }

      // Create and save the new category
      const category = new categoryModel(result);
      const savedCategory = await category.save();

      res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
    }
  },

  // Get all categories
  category: async (req, res, next) => {
    try {
      const categories = await categoryModel.find();
      const formattedData = {};

      // Format the categories data
      categories.forEach((category) => {
        formattedData[category.id] = {
          name: category.name,
          status: category.status,
        };
      });

      res.send({ response: "success", categories: formattedData });
    } catch (error) {
      next(error);
    }
  },

  // Change category status
  changeCategoryStatus: async (req, res, next) => {
    const formData = req.body;
    try {
      result = await authSchema3.validateAsync(formData);

      const filter = { name: result.name }; // Query criteria to find the document
      const update = { status: result.status }; // New value for the status field

      // Find and update the category
      const updatedDocument = await categoryModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true, // Return the modified document after update
        }
      );

      if (!updatedDocument) {
        res.send({ response: "error", error: ["Category Does Not Exist"] });
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
