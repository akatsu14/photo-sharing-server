const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  version: { type: Number, default: 1 },
});
const User = mongoose.model.Users || mongoose.model("Users", userSchema);
module.exports = User;
