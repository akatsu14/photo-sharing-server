const mongoose = require("mongoose");

const bookMarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  create_at: { type: Date, default: Date.now },
});
module.exports =
  mongoose.model.BookMarks || mongoose.model("BookMarks", bookMarkSchema);
