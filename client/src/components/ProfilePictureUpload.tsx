import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaTrash, FaUser, FaUpload } from "react-icons/fa";

interface ProfilePictureUploadProps {
  profilePicture?: string;
  onFileSelect: (file: File) => void;
  onDelete: () => void;
  uploading: boolean;
  uploadProgress: number;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  onFileSelect,
  onDelete,
  uploading,
  uploadProgress,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative group ${dragOver ? "scale-105" : ""} transition-transform duration-200 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="w-40 h-40 rounded-full bg-primary flex items-center justify-center overflow-hidden border-4 border-secondary shadow-lg hover:shadow-xl transition-shadow duration-300">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-8xl text-secondary-bg" />
          )}
        </div>

        {/* Upload Progress Overlay */}
        {uploading && uploadProgress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
            <div className="text-white text-center">
              <motion.div
                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm font-medium">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        {dragOver && (
          <motion.div
            className="absolute inset-0 border-4 border-dashed border-secondary bg-secondary bg-opacity-20 rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <FaUpload className="text-4xl text-secondary" />
          </motion.div>
        )}

        {/* Upload Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          disabled={uploading}
          className="absolute bottom-2 right-2 bg-secondary text-white p-3 rounded-full hover:bg-opacity-80 transition-colors disabled:opacity-50 shadow-lg group-hover:scale-110"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaCamera />
        </motion.button>

        {/* Delete Button */}
        {profilePicture && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={uploading}
            className="absolute bottom-2 left-2 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg group-hover:scale-110"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTrash />
          </motion.button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
          <motion.div
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <FaCamera className="text-2xl" />
          </motion.div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-4 text-center">
        <motion.p
          className="text-sm text-gray-600 mb-1"
          whileHover={{ scale: 1.05 }}
        >
          {dragOver ? "Drop image here" : "Drag & drop or click to upload"}
        </motion.p>
        {uploading && (
          <motion.p
            className="text-secondary font-medium text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Uploading image...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
