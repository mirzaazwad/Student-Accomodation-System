const {
  successfulPayment,
  failedPayment,
  cancelPayment,
  ipn,
  initiatePaymment,
  getTransactions,
} = require("../controllers/transaction.controller");

const router = require("express").Router();

router.post("/success", successfulPayment);
router.post("/fail", failedPayment);
router.post("/cancel", cancelPayment);
router.post("/ipn", ipn);
router.post("/make-payment", initiatePaymment);
router.get("/fetch", getTransactions);

module.exports = router;
