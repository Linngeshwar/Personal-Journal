const express = require("express");
const {
  upload,
  uploadProfilePicture,
  getUserProfile,
  deleteProfilePicture,
} = require("../controllers/ProfileController");
const authenticateToken = require("../middlewares/Authentication");

const profileRouter = express.Router();

profileRouter.get("/", authenticateToken, getUserProfile);

profileRouter.post(
  "/upload-picture",
  authenticateToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);

profileRouter.delete(
  "/delete-picture",
  authenticateToken,
  deleteProfilePicture
);

module.exports = profileRouter;
