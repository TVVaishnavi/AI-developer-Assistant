import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaHistory, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";

function Header({ userEmail }) { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    alert("Logged out successfully");
    navigate("/");
  };

  const goToHistory = () => {
    navigate("/history");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const getRandomColor = () => {
    const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <header className="w-full z-50 bg-gray-900 shadow-md border-b-4 border-purple-500 flex justify-between items-center px-6 py-4">
      {/* Left: Branding & Hamburger */}
      <div className="flex items-center space-x-3">
        <div className="cursor-pointer" onClick={toggleMenu}>
          <div className="h-1 w-6 bg-white mb-1"></div>
          <div className="h-1 w-6 bg-white mb-1"></div>
          <div className="h-1 w-6 bg-white"></div>
        </div>

        <a href="/">
          <img src="/src/assets/logo.png" alt="CodeMuse AI Logo" className="h-15 w-15" />
        </a>

        <span className="text-xl font-bold text-white">
          CodeMuse <span className="text-purple-500">AI</span>
        </span>
      </div>

      {/* Right: Email Avatar */}
      {userEmail && (
        <div className={`inline-flex items-center justify-center w-10 h-10 ${getRandomColor()} text-white rounded-full text-xl`}>
          {userEmail.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Side Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 text-white p-4 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Arrow Back Icon for Closing */}
        <div className="flex justify-end">
          <button className="p-2 text-white" onClick={toggleMenu}>
            <FaArrowLeft size={20} />
          </button>
        </div>

        <ul>
          <li className="flex items-center space-x-2 py-3 cursor-pointer" onClick={() => navigate("/")}>
            <FaHome /> <span>Home</span>
          </li>
          {userEmail && (
            <>
              <li className="flex items-center space-x-2 py-3 cursor-pointer" onClick={goToHistory}>
                <FaHistory /> <span>History</span>
              </li>
              <li className="flex items-center space-x-2 py-3 cursor-pointer" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;