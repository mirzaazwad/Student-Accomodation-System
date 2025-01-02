const router = require("express").Router();

const {
  getMessages,
  fetchSession,
  getSessions,
} = require("../controllers/message.controller");

router.get("/:userId", getMessages);
router.post("/session", fetchSession);
router.get("/", getSessions);

module.exports = router;
