import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GetApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(
          `${backendUrl}/api/college/getCollegeNames`
        );
        if (data.success && data.colleges) {
          setColleges(data.colleges);
        } else if (Array.isArray(data)) {
          setColleges(data);
        } else {
          console.log(data);
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch colleges");
      }
    };

    fetchColleges();
  }, []);

  // Filter colleges based on search term
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(e.target.value.length > 0);
  };

  const handleSearch = () => {
    setIsOpen(false);
    navigate(`/search?q=${searchTerm}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search colleges..."
          className="w-full px-4 py-2 rounded-lg border border-[#D43134C4]/20 focus:outline-none focus:border-[#D43134C4]"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#D43134C4] transition-colors"
        >
          <svg
            className="w-5 h-5 text-[#484848]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Autocomplete dropdown with links */}
      {isOpen && filteredColleges.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#D43134C4]/20 rounded-lg shadow-lg">
          <ul className="py-1">
            {filteredColleges.map((college) => (
              <li
                key={college._id}
                className="px-4 py-2 hover:bg-[#D43134C4]/10 cursor-pointer text-[#484848]"
              >
                <Link
                  to={`/college/${college._id}`}
                  className="flex items-center space-x-2 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-4 h-4 text-[#484848]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{college.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
