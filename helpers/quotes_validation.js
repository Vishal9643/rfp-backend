const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    item_price: joi.required(),
    total_cost: joi.required(),
  })
  .unknown();

module.exports = {
  authSchema6: authSchema,
};
