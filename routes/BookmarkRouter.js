const express = require("express");
const Bookmark = require("../db/bookMarkModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/byUser/:id", verifyToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.find({ user_id: req.params.id });

    if (bookmark) res.status(200).json({ success: true, data: bookmark });
    else res.status(404).json({ success: false, msg: "User not found" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
});

router.get("/byPhoto/:id", verifyToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.find({ post_id: req.params.id });
    if (bookmark) res.status(200).json({ success: true, data: bookmark });
    else res.status(404).json({ success: false, msg: "Photo not found" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
});

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user_id: req.user._id,
      post_id: req.params.id,
    });
    if (bookmark)
      return res
        .status(400)
        .json({ success: false, msg: "You already bookmarked this post" });
    const newBookmark = new Bookmark({
      post_id: req.params.id,
      user_id: req.user._id,
    });
    await newBookmark.save();
    res.status(201).json({ success: true, msg: "Bookmark successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user_id: req.user._id,
      post_id: req.params.id,
    });
    if (bookmark)
      res.status(200).json({ success: true, msg: "Unbookmark successfully" });
    else res.status(404).json({ success: false, msg: "Bookmark not found" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
});

module.exports = router;
