const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// const uploadImage = require("../middlewares/uploadsImage");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/auth/login
router.post("/login", loginAdmin);

// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

// // @route   PUT /api/auth/update-profile
// router.put(
//   "/update-profile",
//   protect,
//   uploadImage.single("avatar"),
//   updateProfile
//);

module.exports = router;
