const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    org_name: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema9: authSchema,
};
