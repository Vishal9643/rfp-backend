const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    user_id: joi.number(),
    status: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema4: authSchema,
};
