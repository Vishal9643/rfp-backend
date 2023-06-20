const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const usersSchema = Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  revenue: {
    type: String,
  },
  no_of_employees: {
    type: Number,
  },
  category: {
    type: String,
  },
  pancard_no: {
    type: String,
  },
  gst_no: {
    type: String,
  },
  mobile: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  user_id: {
    type: Number,
    default: 1, // Start from 1
  },
});

usersSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // Only generate user_id for new documents
      const lastUser = await this.constructor.findOne(
        {},
        {},
        { sort: { user_id: -1 } }
      );
      if (lastUser) {
        this.user_id = lastUser.user_id + 1;
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
