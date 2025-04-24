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
        <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center">
          <Loading />
        </div>
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#062f2e] to-[#083e3d] text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#a08961] to-[#845c36]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Your Perfect College Community
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Connect with peers, explore programs, and find the right college
                fit for you
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10 flex-1">
          {/* Search Input */}
          <div className="mb-8 max-w-xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search colleges by name..."
                className="w-full p-4 pl-12 border border-[#a08961]/30 rounded-xl focus:ring-2 focus:ring-[#a08961] focus:border-[#a08961] shadow-sm bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-[#a08961]"
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
            <div className="absolute -z-10 -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-br from-[#a08961]/5 to-[#845c36]/5 rounded-2xl blur-xl"></div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="bg-white rounded-lg shadow-md border border-[#a08961]/10 p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div>
                <label className="block text-sm font-medium text-[#062f2e] mb-1">
                  Filter by Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-[#f5f3ee] border border-[#a08961]/30 text-[#062f2e] text-sm rounded-lg focus:ring-[#a08961] focus:border-[#a08961] block w-full p-2.5"
                >
                  {collegeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062f2e] mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f5f3ee] border border-[#a08961]/30 text-[#062f2e] text-sm rounded-lg focus:ring-[#a08961] focus:border-[#a08961] block w-full p-2.5"
                >
                  <option value="name">Name</option>
                  <option value="founded">Year Founded</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#a08961]/10 to-[#845c36]/10 px-4 py-2 rounded-lg w-full md:w-auto border border-[#a08961]/10">
              <span className="text-[#062f2e]">
                Showing{" "}
                <span className="font-bold text-[#845c36]">
                  {filteredColleges.length}
                </span>{" "}
                of {colleges.length} colleges
              </span>
            </div>
          </div>

          {/* College Grid */}
          {filteredColleges.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-[#a08961]/10 p-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-[#a08961]/70 mb-4"
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
              <h3 className="text-xl font-semibold text-[#062f2e] mb-2">
                No colleges found
              </h3>
              <p className="text-[#062f2e]/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredColleges.map((college) => (
                <div
                  key={college._id || college.id}
                  className="bg-white rounded-lg shadow-md border border-[#a08961]/10 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#062f2e] to-[#083e3d]"></div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        college.profilePic ||
                        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sbGVnZSUyMGNhbXB1c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                      }
                      alt={college.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {college.facts && college.facts.type && (
                      <div className="absolute top-4 right-4 bg-white/90 text-[#845c36] text-xs font-semibold px-3 py-1 rounded-full border border-[#a08961]/20 shadow-sm">
                        {college.facts.type}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#062f2e] mb-1 line-clamp-1">
                        {college.name}
                      </h2>

                      <div className="flex items-center gap-1 mb-3 text-[#062f2e]/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#a08961]"
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
                        <div className="bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/70 p-3 rounded-lg shadow-sm border border-[#a08961]/5">
                          <span className="text-xs text-[#845c36] font-medium">
                            Founded
                          </span>
                          <p className="text-sm font-semibold text-[#062f2e]">
                            {college.facts?.founded || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/70 p-3 rounded-lg shadow-sm border border-[#a08961]/5">
                          <span className="text-xs text-[#845c36] font-medium">
                            Members
                          </span>
                          <p className="text-sm font-semibold text-[#062f2e]">
                            {college.members?.length || 0}
                          </p>
                        </div>
                      </div>

                      {college.domain && college.domain.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {college.domain.slice(0, 3).map((domain, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-[#a08961]/10 to-[#845c36]/10 text-[#845c36] text-xs px-3 py-1 rounded-full border border-[#a08961]/10"
                            >
                              {domain}
                            </span>
                          ))}
                          {college.domain.length > 3 && (
                            <span className="text-xs text-[#062f2e]/50 px-2 py-1">
                              +{college.domain.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/college/${college._id || college.id}`}
                      className="w-full bg-gradient-to-r from-[#062f2e] to-[#083e3d] text-white py-2.5 px-4 rounded-md hover:from-[#845c36] hover:to-[#a08961] transition-all duration-300 text-center font-medium shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredColleges.length > 0 && (
            <div className="mt-10 text-center">
              <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border border-[#a08961]/10 text-[#062f2e]/80">
                <p>
                  Don't see your college?{" "}
                  <Link
                    to="/add-college"
                    className="text-[#845c36] font-medium hover:text-[#062f2e] transition-colors"
                  >
                    Request to add it
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default CollegeList;
