const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the category schema
const tenantSchema = Schema({
  status: {
    type: String,
    default: "active",
  },
  org_name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    default: 1, // Start from 1
  },
});

// Pre-save middleware to generate unique IDs for new documents
tenantSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // Only generate id for new documents
      const lastTenant = await this.constructor.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      if (lastTenant) {
        this.id = lastTenant.id + 1;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const tenantModel = mongoose.model("tenant", tenantSchema);

module.exports = tenantModel;

