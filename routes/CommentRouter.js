const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");

// router.get("/numsOfComment/:id", verifyToken, async (request, response) => {
//   try {
//     console.log(request.params.id);
//     const numsOfComment = 0;

//     console.log("numsOfComment", numsOfComment);
//     if (numsOfComment)
//       response.status(200).json({ success: true, data: numsOfComment });
//     else response.status(404).json({ success: false, msg: "Photo not found" });
//   } catch (err) {
//     response.status(500).json({ success: false, msg: err });
//   }
// });
//post comment in photo
router.post("/:id", verifyToken, async (request, response) => {
  try {
    const photo = await Photo.findOne({ _id: request.params.id });

    if (photo) {
      const newComment = {
        user_id: request.user._id,
        comment: request.body.comment,
      };
      photo.comments.push(newComment);
      await photo.save();
      const photoAfterAddComment = await Photo.findOne({
        _id: request.params.id,
      }).populate({
        path: "comments.user_id",
        model: "Users",
      });

      let commentId;
      const transformedComments = photoAfterAddComment.comments.map(
        (comment) => {
          commentId = comment._id;
          return {
            _id: comment._id,
            user: comment.user_id,
            date_time: comment.date_time,
            comment: comment.comment,
          };
        }
      );
      const transformedPhotos = {
        _id: photoAfterAddComment._id,
        file_name: photoAfterAddComment.file_name,
        file_path: photoAfterAddComment.file_path,
        date_time: photoAfterAddComment.date_time,
        user_id: photoAfterAddComment.user_id,
        comments: transformedComments,
      };

      response
        .status(200)
        .json({ success: true, data: transformedPhotos, commentId: commentId });
    } else {
      response.status(404).json({ success: false, msg: "Photo not found" });
    }
  } catch (err) {
    console.log("🚀 ~ router.post ~ err:", err);
    response.status(500).json({ success: false, msg: err });
  }
});
router.get("/:id", verifyToken, async (request, response) => {
  try {
    const photosOfUserComment = await Photo.find({
      comments: { $elemMatch: { user_id: request.params.id } },
    }).populate({ path: "comments.user_id", model: "Users" });
    const transformedPhotos = photosOfUserComment.map((photo) => {
      const transformedComments = photo.comments.map((comment) => {
        return {
          _id: comment._id,
          user: comment.user_id,
          date_time: comment.date_time,
          comment: comment.comment,
        };
      });
      return {
        _id: photo._id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: photo.user_id,
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
module.exports = router;
