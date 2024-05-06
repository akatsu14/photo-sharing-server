const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/numsOfComment/:id", async (request, response) => {
  try {
    console.log(request.params.id);
    const numsOfComment = 0;

    console.log("numsOfComment", numsOfComment);
    if (numsOfComment) response.status(200).json(numsOfComment);
    else response.status(404).send("Photo not found");
  } catch (err) {
    response.status(500).send(err);
  }
});
router.get("/:id", async (request, response) => {
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
    if (transformedPhotos) response.status(200).json(transformedPhotos);
    else response.status(404).send("Photo not found");
  } catch (err) {
    response.status(500).send(err);
  }
});
module.exports = router;
