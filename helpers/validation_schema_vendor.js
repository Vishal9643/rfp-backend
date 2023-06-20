const joi = require("@hapi/joi");

const authSchema = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string(),
    lastname: joi.string(),
    type: joi.string(),
    revenue: joi.string(),
    no_of_employees: joi.number(),
    category: joi.string(),
    pancard_no: joi.string(),
    gst_no: joi.string(),
    mobile: joi.string(),
    status: joi.string(),
  })
  .unknown();

module.exports = {
  authSchema2: authSchema,
};
