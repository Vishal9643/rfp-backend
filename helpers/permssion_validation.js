const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    id: joi.string().lowercase().required(),
    org_name: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema4: authSchema,
};
