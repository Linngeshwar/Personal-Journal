import { FaPaintRoller } from "react-icons/fa6";
import { useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "ocean";
  });
  const handleThemeChange = () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "purpur") {
      localStorage.setItem("theme", "ocean");
      document.body.classList.remove("purpur");
    } else {
      localStorage.setItem("theme", "purpur");
      document.body.classList.add("purpur");
    }
    setTheme(currentTheme === "purpur" ? "ocean" : "purpur");
  };

  return (
    <div className="flex items-center mt-3">
      <button
        className="bg-secondary-bg p-2 rounded-full hover:bg-background transition duration-300 outline-none cursor-pointer"
        onClick={handleThemeChange}
      >
        {theme === "ocean" ? (
          <FaPaintRoller className="text-[#A64D79] animate-rotateBlue outline-none" />
        ) : (
          <FaPaintRoller className="text-[#37B7C3] animate-rotatePurple outline-none" />
        )}
      </button>
    </div>
  );
}

export default ThemeToggle;
