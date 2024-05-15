const mongoose = require("mongoose");


const likeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  create_at: { type: Date, default: Date.now },
});

/**
 * Make this available to our application.
 */
module.exports = mongoose.model.Likes || mongoose.model("Likes", likeSchema);
