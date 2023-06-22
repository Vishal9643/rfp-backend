const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");

const rfpSchema = Schema({
  admin_id: {
    type: Number,
  },
  vendors: {
    type: String,
  },
  item_name: {
    type: String,
  },
  item_description: {
    type: String,
  },
  rfp_no: {
    type: String,
  },
  quantity: {
    type: String,
  },
  last_date: {
    type: Date,
  },
  start_date: {
    type: Date,
  },
  minimum_price: {
    type: Number,
  },
  maximum_price: {
    type: Number,
  },
  categories: {
    type: String,
  },
  status: {
    type: String,
    default: "Open",
  },
  id: {
    type: Number,
    default: 1, // Start from 1
  },
});

rfpSchema.pre("save", async function (next) {
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
    this.start_date = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

const rfpModel = mongoose.model("rfp", rfpSchema);

module.exports = rfpModel;
