const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    item_name: joi.string().lowercase().required(),
    item_description: joi.string().lowercase().required(),
    rfp_no: joi.string().required(),
    quantity: joi.string().required(),
    last_date: joi.date().required(),
    minimum_price: joi.string().required(),
    maximum_price: joi.string().required(),
    categories: joi.string().required(),
    org_name: joi.string(),
    vendors: joi.string().required(),
  })
  .unknown();

module.exports = {
  authSchema5: authSchema,
};
