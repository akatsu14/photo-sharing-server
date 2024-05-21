const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");
// router.post("/",verifyToken, async (request, response) => {});

router.get("/me", verifyToken, async (request, response) => {
  try {
    const user = request.user;
    delete user.password;
    if (user) response.status(200).json({ success: true, data: user });
    else response.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

router.get("/list", verifyToken, async (request, response) => {
  try {
    const user = await User.find({}).select("-password");
    if (user) response.status(200).json({ success: true, data: user });
    else response.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

router.get("/:id", verifyToken, async (request, response) => {
  try {
    const user = await User.findById({ _id: request.params.id }).select(
      "-password",
    );
    if (user) response.status(200).json({ success: true, data: user });
    else response.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

router.put("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else res.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});
module.exports = router;
