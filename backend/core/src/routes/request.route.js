const {
  fetchPendingRequests,
  fetchMyRequests,
  fetchAcceptedRequests,
} = require("../controllers/request.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = require("express").Router();

router.get("/requestee",roleMiddleware('student'), fetchPendingRequests);
router.get("/requester", roleMiddleware("student"), fetchMyRequests);
router.get("/roommates", roleMiddleware("student"), fetchAcceptedRequests);

module.exports = router;
