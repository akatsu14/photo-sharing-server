const mongoose = require("mongoose");

const onlineModal = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  create_at: { type: Date, default: Date.now },
});

module.exports =
  mongoose.model.Onlines || mongoose.model("Onlines", onlineModal);
