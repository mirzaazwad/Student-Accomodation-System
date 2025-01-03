const {
  successfulPayment,
  failedPayment,
  cancelPayment,
  ipn,
} = require("../controllers/transaction.controller");

const router = require("express").Router();

router.post("/success", successfulPayment);
router.post("/fail", failedPayment);
router.post("/cancel", cancelPayment);
router.post("/ipn", ipn);

module.exports = router;
