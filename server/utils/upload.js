const multer = require("multer");
const AppError = require("./AppError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `image-${Math.round(Math.random() * 1e9)}-${Date.now()}.${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(new AppError("Not an Image", 400), false);
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
