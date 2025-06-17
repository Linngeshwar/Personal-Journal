const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const pool = require("../db");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user_id = req.user.user_id;

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "journal_app_profiles",
            public_id: `profile_${user_id}`,
            overwrite: true,
            transformation: [
              { width: 400, height: 400, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(req.file.buffer);
    });

    // Update user's profile picture URL in database
    await pool.query("UPDATE users SET profile_picture = $1 WHERE id = $2", [
      result.secure_url,
      user_id,
    ]);

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const result = await pool.query(
      "SELECT id, username, email, profile_picture, created_at FROM users WHERE id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Get current profile picture URL
    const userResult = await pool.query(
      "SELECT profile_picture FROM users WHERE id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentProfilePicture = userResult.rows[0].profile_picture;

    // Delete from Cloudinary if exists
    if (currentProfilePicture) {
      try {
        await cloudinary.uploader.destroy(
          `journal_app_profiles/profile_${user_id}`
        );
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database update even if Cloudinary deletion fails
      }
    }

    // Remove profile picture URL from database
    await pool.query("UPDATE users SET profile_picture = NULL WHERE id = $1", [
      user_id,
    ]);

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ error: "Failed to delete profile picture" });
  }
};

module.exports = {
  upload,
  uploadProfilePicture,
  getUserProfile,
  deleteProfilePicture,
};
