const {
  getAllMessages,
  addMessage,
} = require("../controllers/messageController");

const router = require("express").Router();

router.post("/getMessages/", getAllMessages);
router.post("/addMessage/", addMessage);

module.exports = router;
