const router = require("express").Router();
const {
  login,
  register,
  verify,
  forgotPassword,
  refresh,
  resetPassword,
  verifyAccessToken,
} = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verify);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refresh);
router.post("/verify-access-token", verifyAccessToken);

module.exports = router;
