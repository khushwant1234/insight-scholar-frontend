import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { removeItem } from "../utils/storage.js";
import { UserContext } from "../context/userContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await removeItem("token");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-[#D43134C4]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#D43134C4]">
            <img src="/logonobg1.png" alt="Insight Scholar" className="h-16" />
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#484848] hover:text-[#D43134C4]">
              Home
            </Link>
            <Link to="/about" className="text-[#484848] hover:text-[#D43134C4]">
              About
            </Link>
            <Link
              to="/colleges"
              className="text-[#484848] hover:text-[#D43134C4]"
            >
              Colleges
            </Link>
            <Link
              to="/add-college"
              className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors"
            >
              Add College
            </Link>
            {/* User Profile Icon using user-icon.svg */}
            {user && (
              <Link to={`/user/${user._id}`} className="hover:text-[#D43134C4]">
                <img
                  src="/user-icon.svg"
                  alt="User Profile Icon"
                  className="w-6 h-6"
                />
              </Link>
            )}
            <button
              className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#484848] hover:text-[#D43134C4]"
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

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#D43134C4]/20">
            <div className="flex flex-col space-y-4">
              <SearchBar />

              <Link
                to="/"
                className="text-[#484848] hover:text-[#D43134C4] px-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-[#484848] hover:text-[#D43134C4] px-2"
              >
                About
              </Link>
              <Link
                to="/colleges"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Colleges
              </Link>
              <Link
                to="/add-college"
                className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors text-center"
              >
                Add College
              </Link>
              {/* Mobile User Profile Icon using user-icon.svg */}
              {user && (
                <Link
                  to={`/user/${user._id}`}
                  className="flex items-center hover:text-[#D43134C4] px-2"
                >
                  <img
                    src="/user-icon.svg"
                    alt="User Profile Icon"
                    className="w-6 h-6 mr-2"
                  />
                  Profile
                </Link>
              )}

              <button
                className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors w-full"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
