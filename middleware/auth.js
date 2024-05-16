const jwt = require("jsonwebtoken");
const getOrSetCache = require("../functions/cache");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) res.status(403).json({ success: false, msg: "Invalid token" });
      else {
        let userNew = getOrSetCache(decoded.user._id + "");
        console.log(
          "🚀 ~ verifyToken ~ userNew:",
          decoded.user.version,
          userNew.version
        );
        if (decoded.user.version !== userNew.version) {
          throw new Error("Invalid Token");
        }
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    // console.log("verifyToken", error);
    return res.status(403).json({ success: false, msg: "Invalid token" });
  }
};
module.exports = verifyToken;
