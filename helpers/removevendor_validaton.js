const joi = require("@hapi/joi");

const authSchema = joi.object({
  user_id: joi.number(),
});

module.exports = {
  authSchema6: authSchema,
};
