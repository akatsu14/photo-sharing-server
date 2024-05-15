const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { uploadSingle } = require("../middleware/uploadFile");
const fs = require("fs");

// router.post("/", async (request, response) => {});

router.get("/list", verifyToken, async (request, response) => {
  try {
    const photo = await Photo.find({}).populate({
      path: "comments.user_id",
      model: "Users",
    });
    const transformedPhotos = photo.map((photos) => {
      const transformedComments = photos.comments.map((comment) => {
        return {
          _id: comment._id,
          user: comment.user_id,
          date_time: comment.date_time,
          comment: comment.comment,
        };
      });
      return {
        _id: photos._id,
        file_name: photos.file_name,
        file_path: photos.file_path,
        date_time: photos.date_time,
        user_id: photos.user_id,
        comments: transformedComments,
      };
    });
    if (transformedPhotos)
      response.status(200).json({ success: true, data: transformedPhotos });
    else response.status(404).json({ success: false, msg: "Photo not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});

router.get("/:id", verifyToken, async (request, response) => {
  try {
    const photo = await Photo.find({ user_id: request.params.id }).populate({
      path: "comments.user_id",
      model: "Users",
    });
    const transformedPhotos = photo.map((photos) => {
      const transformedComments = photos.comments.map((comment) => {
        return {
          _id: comment._id,
          user: comment.user_id,
          date_time: comment.date_time,
          comment: comment.comment,
        };
      });
      return {
        _id: photos._id,
        file_name: photos.file_name,
        file_path: photos.file_path,
        date_time: photos.date_time,
        user_id: photos.user_id,
        comments: transformedComments,
      };
    });

    if (transformedPhotos)
      response.status(200).json({ success: true, data: transformedPhotos });
    else response.status(404).json({ success: false, msg: "Photo not found" });
  } catch (err) {
    response.status(500).json({ success: false, msg: err });
  }
});
router.post("/uploadphoto", uploadSingle, verifyToken, async (req, res) => {
  try {
    // Lấy dữ liệu từ file tải lên
    const img = fs.readFileSync(req.file.path);

    // Tạo một bản ghi mới cho ảnh
    const newPhoto = new Photo({
      file_name: req.file.originalname, // Tên của file gốc
      file_path: req.file.path,
      user_id: req.user._id,
    });

    // Lưu ảnh vào cơ sở dữ liệu
    await newPhoto.save();

    res.status(201).json({ success: true, msg: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});

//delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.id });
    if (photo) {
      fs.unlinkSync(photo.file_path);
      res
        .status(200)
        .json({ success: true, msg: "Photo deleted successfully" });
    } else {
      res.status(404).json({ success: false, msg: "Photo not found" });
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});
module.exports = router;
