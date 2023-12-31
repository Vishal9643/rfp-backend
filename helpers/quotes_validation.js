const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    item_price: joi.required(),
    total_cost: joi.required(),
    org_name: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema6: authSchema,
};
