const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quotesSchema = Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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
  vendor_id: {
    type: String,
    required: true,
  },
});

// categorySchema.pre("save", async function (next) {
//   try {
//     if (this.isNew) {
//       // Only generate user_id for new documents
//       const lastUser = await this.constructor.findOne(
//         {},
//         {},
//         { sort: { id: -1 } }
//       );
//       if (lastUser) {
//         this.id = lastUser.id + 1;
//       }
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const quotesModel = mongoose.model("quotes", quotesSchema);

module.exports = quotesModel;
