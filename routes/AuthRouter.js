const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const agorn2 = require("argon2");
const jwt = require("jsonwebtoken");
// router.post("/", async (request, response) => {});
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields" });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    console.log("🚀 ~ router.post ~ user:", user);
    if (user)
      return res
        .status(400)
        .json({ success: false, msg: "Username already exists" });
    // All good
    else {
      const hashedPassword = await agorn2.hash(password);
      const newUser = new User({
        username,
        password: hashedPassword,
        first_name,
        last_name,
        location,
        description,
        occupation,
      });
      await newUser.save();
      // Return token
      jwt.sign(
        { user: newUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.log("🚀 ~ router.post ~ err:", err);
            res
              .status(500)
              .json({ success: false, msg: "Error generating token" });
          } else {
            // cache.set(user._id, user);
            res.json({
              success: true,
              // data: user,
              msg: "User registered successfully",
              token,
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Please enter all fields" });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect username or password" });
    // Username found
    const passwordValid = await agorn2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect username or password" });
    // All good
    // Return token

    jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err)
          res
            .status(500)
            .json({ success: false, msg: "Error generating token" });
        else {
          // cache.set(user._id, user);
          console.log("🚀 ~ router.post ~ afterCache2:", user._id + "");
          res.status(200).json({
            success: true,
            // data: user,
            msg: "User logged in successfully",
            token,
          });
        }
      }
    );
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

module.exports = router;
