import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { removeItem } from "../utils/storage.js";
import { UserContext } from "../context/userContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await removeItem("token");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserDropdown && !e.target.closest(".user-dropdown")) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserDropdown]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logonobg2.png"
              alt="Insight Scholar"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold text-gray-800 hidden sm:block">
              InsightScholar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-5">
              <Link
                to="/"
                className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/")
                    ? "border-[#D43134] text-gray-900"
                    : "border-transparent"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/about")
                    ? "border-[#D43134] text-gray-900"
                    : "border-transparent"
                }`}
              >
                About
              </Link>
              <Link
                to="/colleges"
                className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/colleges")
                    ? "border-[#D43134] text-gray-900"
                    : "border-transparent"
                }`}
              >
                Colleges
              </Link>
              <Link
                to="/mentors"
                className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/mentors")
                    ? "border-[#D43134] text-gray-900"
                    : "border-transparent"
                }`}
              >
                Mentors
              </Link>
            </div>

            <Link
              to="/add-college"
              className="bg-[#D43134] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#b92c2f] transition-colors duration-200 shadow-sm"
            >
              Add College
            </Link>

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-gray-300">
                    <img
                      src="/user-icon.svg"
                      alt="Profile"
                      className="w-5 h-5"
                    />
                  </div>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link
                      to={`/user/${user._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <Link to={`/user/${user._id}`} className="text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src="/user-icon.svg" alt="Profile" className="w-5 h-5" />
                </div>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/")
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/about")
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/colleges"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/colleges")
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Colleges
              </Link>
              <Link
                to="/mentors"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/mentors")
                    ? "bg-gray-50 text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mentors
              </Link>
              <div className="pt-2">
                <Link
                  to="/add-college"
                  className="block bg-[#D43134] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#b92c2f] transition-colors duration-200 text-center shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add College
                </Link>
              </div>
              <div className="pt-1">
                <button
                  className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors duration-200 text-center border border-gray-200"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
