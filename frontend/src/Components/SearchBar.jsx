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
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search colleges..."
          className="w-full px-4 py-2 rounded-lg border border-[#a08961]/20 focus:outline-none focus:border-[#a08961] focus:ring-1 focus:ring-[#a08961]"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08961] hover:text-[#845c36] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
                className="px-4 py-2 hover:bg-[#a08961]/10 cursor-pointer"
              >
                <Link
                  to={`/college/${college._id}`}
                  className="text-[#062f2e] hover:text-[#845c36]"
                  onClick={() => setIsOpen(false)}
                >
                  {college.name}
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
