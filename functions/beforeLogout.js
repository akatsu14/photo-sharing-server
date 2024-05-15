const User = require("../db/userModel");

const resetUserVersion = (userID, version) => {
  // console.log("🚀 ~ resetUserVersion ~ version:", version);
  return User.findOneAndUpdate(
    { _id: userID },
    { $set: { version: version } },
    { new: true }
  );
};
module.exports = resetUserVersion;
