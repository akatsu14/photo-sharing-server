const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  currentUser: { type: String, required: true },
  time: { type: String, required: true },
});
const chatGroupSchema = new mongoose.Schema({
  currentGroupName: { type: String, required: true },
  messages: [messageSchema],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

module.exports =
  mongoose.model.ChatGroups || mongoose.model("ChatGroups", chatGroupSchema);
