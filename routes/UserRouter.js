const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// router.post("/", async (request, response) => {});

router.get("/list", async (request, response) => {
  try {
    const user = await User.find({});
    if (user) response.status(200).json(user);
    else response.status(404).send("User not found");
  } catch (err) {
    response.status(500).send(err);
  }
});
router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById({ _id: request.params.id });
    if (user) response.status(200).json(user);
    else response.status(404).send("User not found");
  } catch (err) {
    response.status(500).send(err);
  }
});
router.post("/chuacolink", async (request, response) => {});
module.exports = router;
