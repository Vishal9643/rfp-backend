const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the quotes schema
const quotesSchema = Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
  },
  item_price: {
    type: String,
    required: true,
  },
  total_cost: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
  },
  vendor_id: {
    type: String,
    required: true,
  },
});

const quotesModel = mongoose.model("quotes", quotesSchema);

module.exports = quotesModel;
