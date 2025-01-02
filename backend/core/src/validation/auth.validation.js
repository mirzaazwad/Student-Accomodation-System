const joi = require("joi");
const { userTypes } = require("../models/user.model");

const registrationSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    username: joi.string().required(),
    userType: joi
      .string()
      .valid(...userTypes)
      .required(),
  }),
});

const loginSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
});

const verifySchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
  }),
});

const forgotPasswordSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
  }),
});

const resetPasswordSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    password: joi.string().min(8).required(),
  }),
});

const refreshSchema = joi.object({
  body: joi.object({
    refreshToken: joi.string().required(),
  }),
});

const verifyAccessTokenSchema = joi.object({
  body: joi.object({
    accessToken: joi.string().required(),
  }),
});

const logoutSchema = joi.object({
  body: joi.object({
    refreshToken: joi.string().required(),
  }),
});

module.exports = {
  registrationSchema,
  loginSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  verifyAccessTokenSchema,
  logoutSchema,
};
