const express = require("express");
const { sendMessage } = require("../controllers/messageController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/send", upload.single("file"), sendMessage);

module.exports = router;
