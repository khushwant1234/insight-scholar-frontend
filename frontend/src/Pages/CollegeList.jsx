import React, { useState, useEffect, useMemo } from "react";
import { GetApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";
import Loading from "../Components/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // College types for filter options
  const collegeTypes = useMemo(() => {
    const types = new Set();
    colleges.forEach((college) => {
      if (college.facts && college.facts.type) {
        types.add(college.facts.type);
      }
    });
    return ["all", ...Array.from(types)];
  }, [colleges]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        if (data.success && data.colleges) {
          setColleges(data.colleges);
        } else if (Array.isArray(data)) {
          setColleges(data);
        } else {
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort colleges
  const filteredColleges = useMemo(() => {
    return colleges
      .filter(
        (college) =>
          (filter === "all" ||
            (college.facts && college.facts.type === filter)) &&
          college.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "founded") {
          return (a.facts?.founded || 0) - (b.facts?.founded || 0);
        } else if (sortBy === "popular") {
          return (b.members?.length || 0) - (a.members?.length || 0);
        }
        return 0;
      });
  }, [colleges, filter, searchTerm, sortBy]);

  if (loading) {
    return (
      <FadeWrapper>
        <Loading />
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#D43134C4] to-[#7B0F119E] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Your Perfect College Community
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Browse through {colleges.length} colleges and find your academic
                home
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-6 pr-12 rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 absolute right-4 top-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10 flex-1">
          {/* Filter and Sort Controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#D43134C4] focus:border-[#D43134C4] block w-full p-2.5"
                >
                  {collegeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#D43134C4] focus:border-[#D43134C4] block w-full p-2.5"
                >
                  <option value="name">Name</option>
                  <option value="founded">Year Founded</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-100 px-4 py-2 rounded-lg w-full md:w-auto">
              <span className="text-gray-700">
                Showing{" "}
                <span className="font-bold text-[#D43134C4]">
                  {filteredColleges.length}
                </span>{" "}
                of {colleges.length} colleges
              </span>
            </div>
          </div>

          {/* College Grid */}
          {filteredColleges.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No colleges found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredColleges.map((college) => (
                <div
                  key={college._id || college.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        college.profilePic ||
                        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sbGVnZSUyMGNhbXB1c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                      }
                      alt={college.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {college.facts && college.facts.type && (
                      <div className="absolute top-4 right-4 bg-white/90 text-[#D43134C4] text-xs font-semibold px-3 py-1 rounded-full">
                        {college.facts.type}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                        {college.name}
                      </h2>

                      <div className="flex items-center gap-1 mb-3 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{college.location}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-xs text-gray-500">Founded</span>
                          <p className="text-sm font-semibold text-gray-800">
                            {college.facts?.founded || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-xs text-gray-500">Members</span>
                          <p className="text-sm font-semibold text-gray-800">
                            {college.members?.length || 0}
                          </p>
                        </div>
                      </div>

                      {college.domain && college.domain.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {college.domain.slice(0, 3).map((domain, index) => (
                            <span
                              key={index}
                              className="bg-[#D43134C4]/10 text-[#D43134C4] text-xs px-2 py-1 rounded-full"
                            >
                              {domain}
                            </span>
                          ))}
                          {college.domain.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{college.domain.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/college/${college._id || college.id}`}
                      className="w-full bg-[#D43134C4] text-white py-2 px-4 rounded-md hover:bg-[#7B0F119E] transition-colors text-center font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredColleges.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              <p>
                Don't see your college?{" "}
                <Link
                  to="/request-college"
                  className="text-[#D43134C4] hover:underline"
                >
                  Request to add it
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default CollegeList;
