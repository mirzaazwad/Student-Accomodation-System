const joi = require("joi");

const changePasswordSchema = joi.object({
  body: joi.object({
    newPassword: joi.string().min(8).required(),
    confirmPassword: joi.string().required(),
    oldPassword: joi.string().required(),
  }),
});

module.exports = {
  changePasswordSchema,
};
