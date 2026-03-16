const express = require("express");
const router = express.Router();
const multer = require("multer");

const { generateImage } = require("../controllers/imageController");

const imageFileFilter = (_req, file, callback) => {
 if (file.mimetype.startsWith("image/")) {
  callback(null, true);
  return;
 }

 callback(new Error("Only image files are allowed"));
};

const upload = multer({
 storage: multer.memoryStorage(),
 limits: {
  fileSize: 10 * 1024 * 1024
 },
 fileFilter: imageFileFilter
});

router.post("/", upload.single("inputImage"), generateImage);

module.exports = router;