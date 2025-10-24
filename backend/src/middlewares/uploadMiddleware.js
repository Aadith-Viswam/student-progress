import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    // file name: timestamp-originalname
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// File filter to allow only certain file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, JPG, PNG files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter
});

export default upload;
