const express = require("express");
const Online = require("../db/onlineModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/all", verifyToken, async (req, res) => {
  try {
    const online = await Online.find({});
    if (online) res.status(200).json({ success: true, data: online });
    else
      res
        .status(404)
        .json({ success: false, msg: "There are no one online here" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});
module.exports = router;
