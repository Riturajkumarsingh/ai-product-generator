const express = require("express");
const router = express.Router();

const multer = require("multer");

const { generateVideo } = require("../controllers/videoController");

const storage = multer.memoryStorage();

const imageFileFilter = (_req, file, callback) => {
 if (file.mimetype.startsWith("image/")) {
  callback(null, true);
  return;
 }

 callback(new Error("Only image files are allowed"));
};

const upload = multer({
 storage,
 limits: {
  fileSize: 10 * 1024 * 1024,
  files: 8
 },
 fileFilter: imageFileFilter
});

router.post(
 "/",
 upload.array("images"),
 generateVideo
);

module.exports = router;