const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogStats,
  incrementBlogView,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup for file upload
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only images are allowed"), false);
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter });

// Public routes
router.get("/", getAllBlogs);
router.get("/id/:id", getBlogById);
router.get("/stats", getBlogStats);
router.get("/:slug", getBlogBySlug);
router.put("/:slug/view", incrementBlogView);

// Admin-only routes
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
