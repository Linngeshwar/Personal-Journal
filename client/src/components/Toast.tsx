import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-100",
          borderColor: "border-green-400",
          textColor: "text-green-700",
          icon: <FaCheckCircle />,
          progressColor: "bg-green-500",
        };
      case "error":
        return {
          bgColor: "bg-red-100",
          borderColor: "border-red-400",
          textColor: "text-red-700",
          icon: <FaTimesCircle />,
          progressColor: "bg-red-500",
        };
      case "warning":
        return {
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-400",
          textColor: "text-yellow-700",
          icon: <FaExclamationTriangle />,
          progressColor: "bg-yellow-500",
        };
      case "info":
      default:
        return {
          bgColor: "bg-blue-100",
          borderColor: "border-blue-400",
          textColor: "text-blue-700",
          icon: <FaInfoCircle />,
          progressColor: "bg-blue-500",
        };
    }
  };

  const config = getToastConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 ${config.bgColor} ${config.borderColor} ${config.textColor} px-6 py-4 rounded-lg border shadow-lg max-w-md overflow-hidden`}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {autoClose && (
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
