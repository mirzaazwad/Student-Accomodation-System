const router = require("express").Router();

const {
  createMessage,
  getMessages,
  fetchSession,
  getSessions,
} = require("../controllers/message.controller");

router.post("/create", createMessage);
router.get("/:userId", getMessages);
router.post("/session", fetchSession);
router.get("/", getSessions);

module.exports = router;
