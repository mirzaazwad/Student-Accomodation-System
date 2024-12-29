const router = require("express").Router();

const {
  createMessage,
  getMessages,
} = require("../controllers/message.controller");

router.post("/create", createMessage);
router.get("/:userId", getMessages);


module.exports = router;