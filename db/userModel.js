const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String },
  email: { type: String },
  high_score: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
});
const User = mongoose.model.Users || mongoose.model("Users", userSchema);
module.exports = User;
