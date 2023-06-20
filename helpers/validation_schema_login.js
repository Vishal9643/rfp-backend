const joi = require("@hapi/joi");

const authSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),

  // otp: joi.number(),
});

module.exports = {
  authSchema: authSchema,
};
