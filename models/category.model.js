const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

categorySchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // Only generate user_id for new documents
      const lastUser = await this.constructor.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      if (lastUser) {
        this.id = lastUser.id + 1;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
