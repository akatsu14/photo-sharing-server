const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// router.post("/", async (request, response) => {});

router.get("/:id", async (request, response) => {
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
        _id: photo._id,
        file_name: photos.file_name,
        date_time: photos.date_time,
        user_id: photos.user_id,
        comments: transformedComments,
      };
    });

    if (transformedPhotos) response.status(200).json(transformedPhotos);
    else response.status(404).send("Photo not found");
  } catch (err) {
    response.status(500).send(err);
  }
});

module.exports = router;
