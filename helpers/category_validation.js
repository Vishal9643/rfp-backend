const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    name: joi.string().lowercase().required(),
    org_id: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema3: authSchema,
};
