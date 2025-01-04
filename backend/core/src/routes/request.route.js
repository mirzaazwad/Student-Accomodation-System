const {
  fetchPendingRequests,
  fetchMyRequests,
  fetchAcceptedRequests,
  approveRoommateRequest,
  rejectRoommateRequest,
  cancelRoommateRequest,
} = require("../controllers/request.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = require("express").Router();

router.get("/requestee", roleMiddleware("student"), fetchPendingRequests);
router.get("/requester", roleMiddleware("student"), fetchMyRequests);
router.get("/roommates", roleMiddleware("student"), fetchAcceptedRequests);
router.post("/accept", roleMiddleware("student"), approveRoommateRequest);
router.post("/reject", roleMiddleware("student"), rejectRoommateRequest);
router.post("/cancel", roleMiddleware("student"), cancelRoommateRequest);

module.exports = router;
