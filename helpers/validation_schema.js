const joi = require("@hapi/joi");

const authSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
  firstname: joi.string(),
  lastname: joi.string(),
  type: joi.string(),
  mobile: joi.string(),
});

module.exports = {
  authSchema1: authSchema,
};
