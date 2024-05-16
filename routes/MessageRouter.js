const express = require("express");
const Message = require("../db/messageModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/:id", verifyToken, async (request, response) => {
  try {
    const message = await Message.find({ room_id: request.params.id });
    if (message) response.status(200).json({ success: true, data: message });
    else
      response.status(404).json({ success: false, msg: "Chat room not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

module.exports = router;
