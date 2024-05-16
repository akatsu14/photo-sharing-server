const express = require("express");
const Like = require("../db/likeModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/byUser/:id", verifyToken, async (request, response) => {
  try {
    const like = await Like.find({ user_id: request.params.id });
    if (like) response.status(200).json({ success: true, data: like });
    else response.status(404).json({ success: false, msg: "User not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});
router.get("/byPhoto/:id", verifyToken, async (request, response) => {
  try {
    const like = await Like.find({ post_id: request.params.id });
    if (like) response.status(200).json({ success: true, data: like });
    else response.status(404).json({ success: false, msg: "Photo not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});
router.post("/:id", verifyToken, async (request, response) => {
  try {
    const like = await Like.findOne({
      user_id: request.user._id,
      post_id: request.params.id,
    });

    if (like)
      response
        .status(400)
        .json({ success: false, msg: "You already liked this post" });
    else {
      const newLike = new Like({
        user_id: request.user._id,
        post_id: request.params.id,
      });
      await newLike.save();
      response.status(201).json({ success: true, msg: "Like successfully" });
    }
  } catch (error) {
    response.status(500).json({ success: false, msg: error });
  }
});

router.delete("/:id", verifyToken, async (request, response) => {
  try {
    const like = await Like.findOneAndDelete({
      user_id: request.user._id,
      post_id: request.params.id,
    });
    if (like)
      response.status(200).json({ success: true, msg: "Unlike successfully" });
    else response.status(404).json({ success: false, msg: "Like not found" });
  } catch (error) {
    response.status(500).json({ success: false, msg: error });
  }
});

module.exports = router;
