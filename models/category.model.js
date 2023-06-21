const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the category schema
const categorySchema = Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
  },
  id: {
    type: Number,
    default: 1, // Start from 1
  },
});

// Pre-save middleware to generate unique IDs for new documents
categorySchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // Only generate id for new documents
      const lastCategory = await this.constructor.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      if (lastCategory) {
        this.id = lastCategory.id + 1;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
