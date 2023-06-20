const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    name: joi.string().lowercase().required(),
  })
  .unknown();

module.exports = {
  authSchema3: authSchema,
};
