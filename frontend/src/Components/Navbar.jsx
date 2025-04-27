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
    <nav className="bg-[#062f2e] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logonobg2.png"
              alt="Insight Scholar"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold text-white hidden sm:block">
              InsightScholar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-5">
              <Link
                to="/"
                className={`text-white hover:text-[#a08961] font-medium transition-colors py-1 border-b-2 ${
                  isActive("/")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/about")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                About
              </Link>
              <Link
                to="/colleges"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/colleges")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Colleges
              </Link>
              <Link
                to="/mentors"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/mentors")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Mentors
              </Link>
              <Link
                to="/compare-colleges"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/compare")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Compare
              </Link>
              <Link
                to="/add-college"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/compare")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Add Colleges
              </Link>
              <Link
                to="/update-college"
                className={`text-white hover:text-[#a08961] font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                  isActive("/add-college")
                    ? "border-[#a08961] text-[#a08961]"
                    : "border-transparent"
                }`}
              >
                Update Colleges
              </Link>
            </div>

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative user-dropdown">
                <div
                  className="flex items-center cursor-pointer gap-2 border border-[#a08961]/20 rounded-full px-3 py-1.5 hover:bg-[#a08961]/20 transition-all"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <img
                    src={user.profilePic || "/user-icon.svg"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[#a08961]/30"
                  />
                </div>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-[#a08961]/10">
                    <Link
                      to={`/user/${user._id}`}
                      className="block px-4 py-2 text-sm text-[#062f2e] hover:bg-[#a08961]/10"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#062f2e] hover:bg-[#a08961]/10"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#a08961] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#845c36] transition-colors duration-200 shadow-sm"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <Link to={`/user/${user._id}`} className="text-white">
                <div className="w-8 h-8 rounded-full bg-[#a08961]/20 flex items-center justify-center overflow-hidden border border-[#a08961]/20">
                  <img src="/user-icon.svg" alt="Profile" className="w-5 h-5" />
                </div>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#a08961] focus:outline-none"
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
          <div className="md:hidden py-3 border-t border-[#a08961]/20 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/")
                    ? "bg-[#a08961]/20 text-white font-medium"
                    : "text-white hover:text-[#a08961]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/about")
                    ? "bg-[#a08961]/20 text-white font-medium"
                    : "text-white hover:text-[#a08961]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/colleges"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/colleges")
                    ? "bg-[#a08961]/20 text-white font-medium"
                    : "text-white hover:text-[#a08961]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Colleges
              </Link>
              <Link
                to="/mentors"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/mentors")
                    ? "bg-[#a08961]/20 text-white font-medium"
                    : "text-white hover:text-[#a08961]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mentors
              </Link>
              <Link
                to="/compare-colleges"
                className={`px-2 py-1.5 rounded-md ${
                  isActive("/compare")
                    ? "bg-[#a08961]/20 text-white font-medium"
                    : "text-white hover:text-[#a08961]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>

              {!user && (
                <div className="pt-2">
                  <Link
                    to="/auth"
                    className="block bg-[#a08961] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#845c36] transition-colors duration-200 text-center shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-1">
                  <button
                    className="w-full bg-[#a08961]/20 text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#a08961]/30 transition-colors duration-200 text-center border border-[#a08961]/30"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
