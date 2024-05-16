const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room_id: { type: String, required: true },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  message: { type: String, required: true },
  create_at: { type: Date, default: Date.now() },
});

module.exports =
  mongoose.model.Messages || mongoose.model("Messages", messageSchema);
