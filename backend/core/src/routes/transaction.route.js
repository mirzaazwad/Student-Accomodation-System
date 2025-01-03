const {
  successfulPayment,
  failedPayment,
  cancelPayment,
  ipn,
  initiatePaymment,
  getTransactionsForLandlord,
  getTransactionsForStudent,
} = require("../controllers/transaction.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = require("express").Router();

router.post("/success", successfulPayment);
router.post("/fail", failedPayment);
router.post("/cancel", cancelPayment);
router.post("/ipn", ipn);
router.post("/make-payment", initiatePaymment);
router.get("/landlord", roleMiddleware("landlord"), getTransactionsForLandlord);
router.get("/student", roleMiddleware("student"), getTransactionsForStudent);

module.exports = router;
