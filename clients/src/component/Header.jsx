import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { RiChatNewLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import custom from "../hook/custom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { history, fetchHistory, deletePrompt, renamePrompt, sharePrompt, userDetail } = custom();

  const userEmail = userDetail?.email || "";
  const userName = userDetail?.name || "";

  const getShortTitle = (text) => {
    const words = text.trim().split(" ");
    return words.length > 8 ? words.slice(0, 8).join(" ") + "..." : text;
  };

  const handleRename = async (item) => {
    const newTitle = prompt("Enter new name:", getShortTitle(item.userPrompt));
    if (newTitle) {
      await renamePrompt(item._id, newTitle);
      fetchHistory();
    }
    setActiveMenu(null);
  };

  const handleShare = (item) => {
    sharePrompt(item._id);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("usertoken");
    await deletePrompt(id, token);
    fetchHistory();
    setActiveMenu(null);
  };

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (newState) fetchHistory();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      alert("Logging out...");
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.log("Logout error: ", err);
    }
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <header className="w-full z-50 bg-gray-900 shadow-md border-b-4 border-purple-500 flex justify-between items-center px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="cursor-pointer" onClick={toggleMenu}>
          <div className="h-1 w-6 bg-white mb-1"></div>
          <div className="h-1 w-6 bg-white mb-1"></div>
          <div className="h-1 w-6 bg-white"></div>
        </div>
        <a href="/">
          <img
            src="/src/assets/logo.png"
            alt="CodeMuse AI Logo"
            className="h-12 w-12"
          />
        </a>
        <span className="text-xl font-bold text-white">
          CodeMuse <span className="text-purple-500">AI</span>
        </span>
      </div>

      {userName ? (
        <div
          title={userName}
          className={`w-10 h-10 ${getRandomColor()} text-white rounded-full flex items-center justify-center text-xl`}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center text-xl">
          ?
        </div>
      )}

      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 text-white p-4 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button className="p-2 text-white" onClick={toggleMenu}>
            <FaArrowLeft size={20} />
          </button>
        </div>

        <ul>
          <li
            className="flex items-center space-x-2 py-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <RiChatNewLine />
            <span>New Chat</span>
          </li>
          <li
            className="flex items-center space-x-2 py-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaHome /> <span>Home</span>
          </li>
          {userEmail && (
            <li
              className="flex items-center space-x-2 py-3 cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          )}
        </ul>

        <div
          className="flex-1 overflow-auto space-y-2 flex flex-col p-1 mt-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          style={{ maxHeight: "calc(100vh - 150px)" }}
        >
          {history.length > 0 ? (
            history.map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors flex justify-between items-center cursor-pointer group"
                onClick={() =>
                  navigate("/result", {
                    state: {
                      id: item._id,
                      prompt: item.userPrompt,
                      response: item.aiResponse,
                    },
                  })
                }
              >
                <p className="truncate w-full pr-6">
                  <span className="font-medium text-white">
                    {getShortTitle(item.userPrompt)}
                  </span>
                  <span className="text-gray-400">
                    {" "}
                    — {item.aiResponse.slice(0, 30)}...
                  </span>
                </p>

                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === item._id ? null : item._id);
                    }}
                    className="text-white"
                  >
                    <FaEllipsisV />
                  </button>

                  {activeMenu === item._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50">
                      <button
                        onClick={() => handleRename(item)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleShare(item)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No prompt history found.</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
