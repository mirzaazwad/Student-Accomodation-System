const router = require("express").Router();
const {
  login,
  register,
  verify,
  forgotPassword,
  refresh,
  resetPassword,
  verifyAccessToken,
  logout,
} = require("../controllers/auth.controller");
const { validateRequest } = require("../middlewares/validation.middleware");
const {
  registrationSchema,
  loginSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  logoutSchema,
  verifyAccessTokenSchema,
} = require("../validation/auth.validation");

router.post("/login", validateRequest(loginSchema), login);
router.post("/register", validateRequest(registrationSchema), register);
router.post("/verify", validateRequest(verifySchema), verify);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);
router.post("/refresh", validateRequest(refreshSchema), refresh);
router.post(
  "/verify-access-token",
  validateRequest(verifyAccessTokenSchema),
  verifyAccessToken
);
router.post("/logout", validateRequest(logoutSchema), logout);

module.exports = router;
