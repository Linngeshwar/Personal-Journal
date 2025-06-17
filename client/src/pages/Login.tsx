import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { login } from "../api/api";
import ThemeToggle from "../components/ThemeToggle";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  error: string;
}

export default function Login() {
  const [errorText, setErrorText] = useState<string>("");
  const validateForm = (email: string, password: string) => {
    if (!email || !password) {
      setErrorText("All fields are required");
      return false;
    }
    if (password.length < 4) {
      setErrorText("Password must be at least 6 characters long");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorText("Email is not valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    const isValid = validateForm(email, password);
    if (isValid) {
      try {
        const response = await login(email, password);
        const token = response.data.token;
        localStorage.setItem("token", token);
        window.location.href = "/home";
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response) {
            setErrorText(axiosError.response.data?.error || "Login failed");
          } else if (axiosError.request) {
            setErrorText("Network error - please try again later");
          } else {
            setErrorText("An unexpected error occurred");
          }
        } else {
          setErrorText("An unexpected error occurred");
        }
        console.error("Login error:", error);
      }
    } else {
      console.error("Invalid form data");
    }
  };
  return (
    <>
      <AnimatePresence>
        <motion.div className="flex flex-col min-h-screen bg-background">
          <div className="flex flex-row justify-between items-center w-full p-4 bg-primary">
            <motion.h1 className="text-2xl font-bold text-center cursor-default">
              Personal Journal
            </motion.h1>
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center justify-center flex-grow">
            <motion.div className="bg-secondary-bg p-6 rounded shadow-md sm:w-96 w-11/12">
              <motion.form className="" onSubmit={handleSubmit}>
                <motion.h2
                  className="text-3xl font-bold mb-4 text-center cursor-default"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Login
                </motion.h2>
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.label
                    htmlFor="email"
                    whileHover={{ color: "var(--secondary)" }}
                    className="block text-sm font-medium hover:text-secondary transition-colors duration-200 cursor-pointer"
                  >
                    Email
                  </motion.label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    autoComplete="off"
                    type="email"
                    id="email"
                    className="mt-1 block w-full p-2 border border-primary rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"
                  />
                </motion.div>
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.label
                    htmlFor="password"
                    whileHover={{ color: "var(--secondary)" }}
                    className="block text-sm font-medium hover:text-secondary transition-colors duration-200 cursor-pointer"
                  >
                    Password
                  </motion.label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    autoComplete="off"
                    type="password"
                    id="password"
                    className="mt-1 block w-full p-2 border border-primary rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"
                  />
                </motion.div>
                <div className="mb-4">
                  <p className="text-red-600 font-bold text-center">
                    {errorText}
                  </p>
                </div>
                <motion.button
                  key="login-button"
                  type="submit"
                  className="w-full bg-secondary text-white p-2 rounded outline-none cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                >
                  Login
                </motion.button>{" "}
              </motion.form>
            </motion.div>
            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <a href="/register" className="text-secondary hover:underline">
                Register
              </a>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
