const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const getOrSetCache = require("../functions/cache");
// router.post("/",verifyToken, async (request, response) => {});

// lấy danh sách 10 người chơi có điểm cao nhất
router.get("/top", verifyToken, async (request, response) => {
  console.log("🚀 ~ request:", request)
  try {
    const user = request.user;
    console.log("🚀 ~ user:", user)
    delete user.password;
    // lấy danh sách 10 người chơi có điểm cao nhất
    const topUsers = await User.find({})
      .sort({ high_score: -1 })
      .limit(10)
      .select("-password");
    console.log("🚀 ~ topUsers:", topUsers)
    // nếu có người chơi thì trả về danh sách
    if (topUsers)
      response.status(200).json({ success: true, data: topUsers });
    else response.status(404).json({ success: false, msg: "No users found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

//sau khi chơi xong cập nhật điểm cao nhất nếu điểm hiện tại lớn hơn điểm cao nhất
router.put("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    // if (user) {
    //   getOrSetCache(user._id + "", user);
    //   res.status(200).json({ success: true, data: user });
    // } else res.status(404).json({ success: false, msg: "User not found" });
    if (user) {
      // kiểm tra nếu điểm hiện tại lớn hơn điểm cao nhất thì cập nhật
      if (req.body.high_score && req.body.high_score > user.high_score) {
        user.high_score = req.body.high_score;
        await user.save();
      }
      getOrSetCache(user._id + "", user);
      res.status(200).json({ success: true, data: user });
    } else res.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});
module.exports = router;
