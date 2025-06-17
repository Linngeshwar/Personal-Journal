import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import {
  getUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../api/api";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaIdBadge,
  FaCheckCircle,
  FaCamera,
  FaTrash,
  FaUpload,
  FaTimesCircle,
} from "react-icons/fa";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  created_at: string;
}

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data.user);
      setEditedProfile(response.data.user);
    } catch (error) {
      setError("Failed to fetch profile");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const response = await uploadProfilePicture(file);
      setUploadProgress(100);
      setTimeout(() => {
        setSuccess("Profile picture updated successfully!");
        setProfile((prev) =>
          prev ? { ...prev, profile_picture: response.data.imageUrl } : null
        );
        setUploadProgress(0);
      }, 300);
    } catch (error) {
      setError("Failed to upload profile picture");
      console.error("Error uploading profile picture:", error);
      setUploadProgress(0);
    } finally {
      setUploading(false);
      clearInterval(progressInterval);
    }
  };

  const handleInputFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDeletePicture = async () => {
    if (!profile?.profile_picture) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      await deleteProfilePicture();
      setSuccess("Profile picture deleted successfully!");
      setProfile((prev) =>
        prev ? { ...prev, profile_picture: undefined } : null
      );
    } catch (error) {
      setError("Failed to delete profile picture");
      console.error("Error deleting profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setEditedProfile(profile || {});
    }
  };

  const handleSaveProfile = () => {
    // In a real app, you'd send this to your API
    setProfile((prev) => (prev ? { ...prev, ...editedProfile } : null));
    setIsEditMode(false);
    setSuccess("Profile updated successfully!");
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading) {
    return (
      <div className="bg-background flex flex-col min-h-screen">
        <div className="flex flex-row justify-between items-center p-4 bg-primary">
          <Header />
        </div>
        <div className="flex items-center justify-center flex-grow">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full"
          />
          <motion.p
            className="ml-4 text-secondary font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading profile...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="bg-background flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row justify-between items-center p-4 bg-primary">
          <Header />
        </div>

        <div className="flex-grow p-4 sm:p-6 max-w-6xl mx-auto w-full">
          {/* Header Section */}
          <motion.div
            className="bg-secondary-bg rounded-lg shadow-lg p-6 sm:p-8 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Profile Management
              </motion.h1>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditMode ? <FaTimes /> : <FaEdit />}
                  {isEditMode ? "Cancel" : "Edit Profile"}
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FaTimesCircle />
                  {error}
                  <button onClick={clearMessages} className="ml-auto">
                    <FaTimes />
                  </button>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FaCheckCircle />
                  {success}
                  <button onClick={clearMessages} className="ml-auto">
                    <FaTimes />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <motion.div
              className="lg:col-span-1 bg-secondary-bg rounded-lg shadow-lg p-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCamera />
                Profile Picture
              </h2>
              <div className="flex flex-col items-center">
                <div
                  className={`relative group ${dragOver ? "scale-105" : ""} transition-transform duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-40 h-40 rounded-full bg-primary flex items-center justify-center overflow-hidden border-4 border-secondary shadow-lg">
                    {profile?.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-8xl text-secondary-bg" />
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploading && uploadProgress > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm">{uploadProgress}%</p>
                      </div>
                    </div>
                  )}

                  {/* Drag overlay */}
                  {dragOver && (
                    <div className="absolute inset-0 border-4 border-dashed border-secondary bg-secondary bg-opacity-20 rounded-full flex items-center justify-center">
                      <FaUpload className="text-4xl text-secondary" />
                    </div>
                  )}

                  <motion.button
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-secondary text-white p-3 rounded-full hover:bg-opacity-80 transition-colors disabled:opacity-50 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCamera />
                  </motion.button>

                  {profile?.profile_picture && (
                    <motion.button
                      onClick={handleDeletePicture}
                      disabled={uploading}
                      className="absolute bottom-2 left-2 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash />
                    </motion.button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputFileSelect}
                  className="hidden"
                />

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Drag & drop or click to upload
                  </p>
                  {uploading && (
                    <motion.p
                      className="text-secondary font-medium"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Uploading...
                    </motion.p>
                  )}
                </div>
              </div>
              {/* Upload Guidelines */}
              <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Guidelines:</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Max size: 5MB</li>
                  <li>• Formats: JPG, PNG, GIF</li>
                  <li>• Auto-resized to 400x400px</li>
                  <li>• Square images work best</li>
                </ul>
              </div>{" "}
            </motion.div>

            {/* Profile Information Section */}
            <motion.div
              className="lg:col-span-2 bg-secondary-bg rounded-lg shadow-lg p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaUser />
                  Personal Information
                </h2>
                {isEditMode && (
                  <motion.button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSave />
                    Save Changes
                  </motion.button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaUser className="text-secondary" />
                      Username
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedProfile.username || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    ) : (
                      <div className="bg-background p-3 rounded-lg border border-primary">
                        {profile?.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaEnvelope className="text-secondary" />
                      Email
                    </label>
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editedProfile.email || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    ) : (
                      <div className="bg-background p-3 rounded-lg border border-primary">
                        {profile?.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaIdBadge className="text-secondary" />
                      User ID
                    </label>
                    <div className="bg-background p-3 rounded-lg border border-primary text-gray-600">
                      #{profile?.id}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaCalendarAlt className="text-secondary" />
                      Member Since
                    </label>
                    <div className="bg-background p-3 rounded-lg border border-primary">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="mt-8 p-4 bg-primary bg-opacity-10 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Account Status
                </h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Active Account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Profile Complete</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Profile;
