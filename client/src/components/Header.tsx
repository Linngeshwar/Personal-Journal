import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setShowMenuItems(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        type DecodedToken = { exp: number; [key: string]: unknown };
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const headerVariants = isMobile
    ? {
        open: {
          opacity: 1,
          height: "10rem",
          display: "flex",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            when: "beforeChildren",
            staggerChildren: 0.07,
          },
        },
        closed: {
          opacity: 1,
          height: "2.3rem",
          display: "flex",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            when: "afterChildren",
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      }
    : {
        open: {
          opacity: 1,
          width: "23rem",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            when: "beforeChildren",
            staggerChildren: 0.07,
          },
        },
        closed: {
          opacity: 1,
          width: "8rem",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            when: "afterChildren",
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      };
  const itemVariants = isMobile
    ? {
        open: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
          display: "block",
        },
        closed: {
          opacity: 0,
          y: -20,
          transition: { type: "spring", stiffness: 300, damping: 24 },
          transitionEnd: { display: "none" },
        },
      }
    : {
        open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        closed: { opacity: 0, x: -20, transition: { duration: 0.3 } },
      };

  return (
    <>
      <motion.div className="flex flex-row justify-between w-full">
        <motion.div
          className={`bg-secondary-bg mt-3 w-[8rem] ml-[1rem] md:ml-[2rem] px-5 py-1 flex flex-col sm:flex-row items-center rounded-xl cursor-pointer overflow-hidden border-2 border-primary ${isMobile ? "w-[5rem] max-w-xs" : ""}`}
          initial="closed"
          animate={showMenuItems ? "open" : "closed"}
          variants={headerVariants}
        >
          {!isAuthenticated && (
            <>
              <motion.h1
                className={`text-lg font-bold outline-none ${isMobile ? "block" : "hidden sm:block"}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                Login
              </motion.h1>
              <motion.h1
                className={`text-lg font-bold outline-none ${isMobile ? "block" : "hidden sm:block"}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                Register
              </motion.h1>
            </>
          )}
          <div className="flex flex-col sm:justify-center items-center h-full w-[5rem] min-w-[5rem]">
            <motion.h1
              onClick={() => {
                setShowMenuItems(!showMenuItems);
              }}
              className="text-[1rem] font-bold outline-none text-center text-primary w-full hover:text-background hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              Menu
            </motion.h1>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center sm:ml-5 gap-4 ${isMobile ? "w-full" : ""}`}
          >
            <motion.h1
              className={`text-lg font-bold outline-none ${isMobile ? "block " : "hidden sm:block"}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link to="/home">Home</Link>
            </motion.h1>
            <motion.h1
              className={`text-lg font-bold outline-none ${isMobile ? "block" : "hidden sm:block"}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link to="/profile">Profile</Link>
            </motion.h1>
            <motion.h1
              className={`text-lg font-bold outline-none ${isMobile ? "block" : "hidden sm:block"}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link to="/contact">Contact</Link>
            </motion.h1>
          </div>
        </motion.div>
        <ThemeToggle />
      </motion.div>
    </>
  );
}
