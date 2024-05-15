const multer = require("multer");
const path = require("path");

// Upload Image controller
const uploadDirectory = "uploads";
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Image filter
const uploadSingle = multer({
  storage: imgconfig,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif/;
    const mimeType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback(new Error("Invalid file format. Please upload an image file."));
  },
}).single("picture");

module.exports = { uploadSingle };
