import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.body.className = theme;
    } else {
      document.body.className = "ocean";
    }
  }, []);

  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      try {
        type DecodedToken = { exp: number; [key: string]: unknown };
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log(decodedToken, currentTime);
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          return false;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
      return true;
    };

    return isAuthenticated() ? <>{element}</> : <Navigate to="/login" />;
  };
  const AuthRoute = ({ element }: { element: React.ReactElement }) => {
    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      try {
        type DecodedToken = { exp: number; [key: string]: unknown };
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          return false;
        }
      } catch (error) {
        console.error("Error decoding the token", error);
        return false;
      }
      return true;
    };
    return isAuthenticated() ? <Navigate to="/home" /> : <>{element}</>;
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route
          path="/register"
          element={<AuthRoute element={<Register />} />}
        />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
