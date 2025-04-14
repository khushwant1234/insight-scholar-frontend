import React, { useState, useEffect } from "react";
import { GetApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CollegeComparison = () => {
  const [allColleges, setAllColleges] = useState([]); // For search only
  const [loading, setLoading] = useState(true); // Initial page loading
  const [selectedColleges, setSelectedColleges] = useState([null, null, null]);
  const [loadingStates, setLoadingStates] = useState([false, false, false]); // Loading state for each column
  const [searchTerms, setSearchTerms] = useState(["", "", ""]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileView, setMobileView] = useState(null);

  // Fetch all college basic info for search functionality
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Get all colleges for search
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);

        if (data.success && data.colleges) {
          setAllColleges(data.colleges);

          // Check if we have colleges to compare from localStorage
          const compareColleges = JSON.parse(
            localStorage.getItem("compareColleges") || "[]"
          );

          // If we have colleges in localStorage, use those
          if (compareColleges.length > 0) {
            // Set loading states to true for specified columns
            const initialLoadingStates = [false, false, false];
            const initialSelectedColleges = [null, null, null];

            // Fetch detailed data for each college from localStorage
            await Promise.all(
              compareColleges.slice(0, 3).map(async (collegeId, index) => {
                initialLoadingStates[index] = true;
                setLoadingStates([...initialLoadingStates]);
                await fetchCollegeDetails(collegeId, index);
              })
            );
          } else {
            // Default: Select 3 random colleges if no localStorage data
            const shuffled = [...data.colleges].sort(() => 0.5 - Math.random());
            const randomThree = shuffled.slice(0, 3);

            // Set loading states to true for all three columns
            setLoadingStates([true, true, true]);

            // Fetch detailed data for each college
            await Promise.all(
              randomThree.map(async (college, index) => {
                await fetchCollegeDetails(college._id, index);
              })
            );
          }
        } else {
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Error loading colleges");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    window.scrollTo(0, 0);
  }, []);

  // Fetch detailed college information
  const fetchCollegeDetails = async (collegeId, index) => {
    try {
      // Update loading state for this column
      const newLoadingStates = [...loadingStates];
      newLoadingStates[index] = true;
      setLoadingStates(newLoadingStates);

      // Fetch college details
      const data = await GetApiCall(`${backendUrl}/api/college/${collegeId}`);

      if (data.success && data.college) {
        // Update the specific college with detailed info
        const newSelectedColleges = [...selectedColleges];
        newSelectedColleges[index] = data.college;
        setSelectedColleges(newSelectedColleges);
      } else {
        toast.error(`Failed to fetch details for college ${index + 1}`);
      }
    } catch (error) {
      console.error(
        `Error fetching college details for index ${index}:`,
        error
      );
      toast.error(`Error loading college ${index + 1} details`);
    } finally {
      // Update loading state
      const newLoadingStates = [...loadingStates];
      newLoadingStates[index] = false;
      setLoadingStates(newLoadingStates);
    }
  };

  const handleSearchChange = (index, value) => {
    const newTerms = [...searchTerms];
    newTerms[index] = value;
    setSearchTerms(newTerms);
    setActiveDropdown(index);
  };

  const handleSelectCollege = (index, collegeId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Get basic college info from search results
    const selectedCollege = allColleges.find(
      (college) => college._id === collegeId
    );

    if (!selectedCollege) return;

    // Show a temporary placeholder with basic info while fetching details
    const newSelectedColleges = [...selectedColleges];
    newSelectedColleges[index] = {
      ...selectedCollege,
      isPartialData: true, // Flag to indicate this is just basic data
    };
    setSelectedColleges(newSelectedColleges);

    // Reset search
    const newTerms = [...searchTerms];
    newTerms[index] = "";
    setSearchTerms(newTerms);
    setActiveDropdown(null);

    // Fetch detailed info for this college
    fetchCollegeDetails(collegeId, index);
  };

  const getFilteredColleges = (index) => {
    if (!searchTerms[index]) return [];
    return allColleges
      .filter((college) =>
        college.name.toLowerCase().includes(searchTerms[index].toLowerCase())
      )
      .slice(0, 5);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".college-search-result")) {
        return;
      }
      setActiveDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial loading screen
  if (loading) {
    return (
      <FadeWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <Loading />
            </div>
          </div>
        </div>
      </FadeWrapper>
    );
  }

  // Render loading placeholder for a college card
  const renderCollegeLoadingCard = (index) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-2 md:h-3 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
      <div className="relative h-40 md:h-48 bg-gray-200"></div>
      <div className="p-4 md:p-5">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-100 rounded mb-4 w-2/3"></div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-16 bg-gray-50 rounded"></div>
          <div className="h-16 bg-gray-50 rounded"></div>
        </div>
        <div className="h-8 bg-indigo-100 rounded"></div>
      </div>
    </div>
  );

  // Mobile view
  const renderMobileDetail = () => {
    if (mobileView === null) return null;
    const college = selectedColleges[mobileView];
    const isLoading = loadingStates[mobileView];

    if (isLoading || !college) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-8 flex flex-col items-center">
            <Loading />
            <p className="mt-4 text-gray-600">Loading college details...</p>
            <button
              onClick={() => setMobileView(null)}
              className="mt-6 px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">{college.name}</h3>
            <button
              onClick={() => setMobileView(null)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <img
              src={
                college.profilePic ||
                `https://source.unsplash.com/800x600/?university,college,campus&random=${mobileView}`
              }
              alt={college.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Location</h4>
                <p>{college.location || "—"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Type</h4>
                <p>{college.facts?.type || "—"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Founded</h4>
                <p>{college.facts?.founded || "—"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">
                  Student Population
                </h4>
                <p>
                  {college.facts?.totalStudents
                    ? college.facts.totalStudents.toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Academic Fields</h4>
                {college.domain?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {college.domain.map((field, i) => (
                      <span
                        key={i}
                        className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>—</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Community Members</h4>
                <p>{college.members?.length || "—"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Description</h4>
                <p className="text-sm text-gray-600">
                  {college.description || "—"}
                </p>
              </div>
              <Link
                to={`/college/${college._id}`}
                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors font-medium mt-4"
              >
                View College Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                Compare Colleges Side by Side
              </h1>
              <p className="text-indigo-100 text-base md:text-xl">
                Make informed decisions by comparing key features and statistics
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
          <div className="max-w-7xl mx-auto">
            {/* College Selection Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 relative">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search with Icon */}
                  <div className="mb-4 md:mb-6 relative">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`${index + 1}. Search for a college...`}
                        value={searchTerms[index]}
                        onChange={(e) =>
                          handleSearchChange(index, e.target.value)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(index);
                        }}
                        className="w-full p-3 md:p-4 pl-10 md:pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm bg-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-indigo-600"
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
                      </div>
                    </div>

                    {/* Dropdown results */}
                    {activeDropdown === index && searchTerms[index] && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto">
                        {getFilteredColleges(index).length > 0 ? (
                          getFilteredColleges(index).map((college) => (
                            <div
                              key={college._id}
                              className="p-3 md:p-4 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 transition duration-150 college-search-result"
                              onClick={(event) => {
                                handleSelectCollege(index, college._id, event);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={
                                      college.profilePic ||
                                      "https://via.placeholder.com/100?text=College"
                                    }
                                    alt={college.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3 md:ml-4">
                                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                                    {college.name}
                                  </p>
                                  <p className="text-xs md:text-sm text-gray-500">
                                    {college.location}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-gray-500 text-center">
                            No colleges found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected College Card or Loading State */}
                  {loadingStates[index] ? (
                    renderCollegeLoadingCard(index)
                  ) : selectedColleges[index] ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.01] md:hover:scale-[1.02] hover:shadow-xl border border-gray-100">
                      {/* College Header with Color Band */}
                      <div className="h-2 md:h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                      {/* College Image */}
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <img
                          src={
                            selectedColleges[index].profilePic ||
                            `https://source.unsplash.com/800x600/?university,college,campus&random=${index}`
                          }
                          alt={selectedColleges[index].name}
                          className="object-cover w-full h-full transform hover:scale-105 transition-all duration-500"
                        />
                        {/* Remove button */}
                        <button
                          onClick={() => {
                            const newSelected = [...selectedColleges];
                            newSelected[index] = null;
                            setSelectedColleges(newSelected);
                          }}
                          className="absolute top-2 right-2 md:top-3 md:right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-1 md:p-1.5 rounded-full text-gray-700 hover:text-red-600 transition-colors"
                          title="Remove college"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 md:h-5 md:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Partial data indicator if needed */}
                      {selectedColleges[index].isPartialData && (
                        <div className="bg-yellow-50 px-3 py-1 text-xs text-yellow-700 text-center">
                          Loading complete details...
                        </div>
                      )}

                      {/* College Info */}
                      <div className="p-4 md:p-5">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 truncate">
                          {selectedColleges[index].name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 truncate">
                          {selectedColleges[index].location ||
                            "Location not specified"}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm mb-3 md:mb-4">
                          <div className="bg-gray-50 p-1.5 md:p-2 rounded">
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium truncate">
                              {selectedColleges[index].facts?.type || "—"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-1.5 md:p-2 rounded">
                            <p className="text-gray-500">Founded</p>
                            <p className="font-medium truncate">
                              {selectedColleges[index].facts?.founded || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {/* Mobile: View Details Button */}
                          <button
                            onClick={() => setMobileView(index)}
                            className="md:hidden flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center rounded-lg transition-colors text-xs font-medium"
                          >
                            See Details
                          </button>

                          <Link
                            to={`/college/${selectedColleges[index]._id}`}
                            className="block flex-grow py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors text-xs md:text-sm font-medium"
                          >
                            Visit Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white rounded-xl shadow-lg border border-dashed border-gray-300 p-4 md:p-8 flex flex-col items-center justify-center h-48 md:h-64 text-center cursor-pointer hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Focus the search input for this slot
                        const inputElement = document.querySelector(
                          `input[placeholder="${
                            index + 1
                          }. Search for a college..."]`
                        );
                        if (inputElement) {
                          inputElement.focus();
                          setActiveDropdown(index);
                        }
                      }}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3 md:mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 md:h-8 md:w-8 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base md:text-xl font-semibold text-gray-700 mb-1">
                        Select College {index + 1}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-4">
                        Use search to pick a college
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/4 left-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -z-10 bottom-1/4 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Comparison Table Section - Desktop */}
            <div className="mt-8 md:mt-12 mx-auto hidden md:block">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
                Detailed Comparison
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* College Names - Header Row */}
                <div className="grid grid-cols-4 border-b border-gray-200">
                  <div className="p-4 md:p-6 font-semibold text-gray-500 bg-gray-50 flex items-center">
                    <h3 className="text-base md:text-lg font-semibold text-indigo-800">
                      Specifications
                    </h3>
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 font-semibold text-center border-l border-gray-200"
                    >
                      {loadingStates[index] ? (
                        <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
                      ) : (
                        <h3 className="text-base md:text-lg text-gray-800 truncate">
                          {selectedColleges[index]?.name || "Select a College"}
                        </h3>
                      )}
                    </div>
                  ))}
                </div>

                {/* College Images Row */}
                <div className="grid grid-cols-4 border-b border-gray-200 bg-white">
                  <div className="p-4 md:p-5 font-medium text-gray-700 flex items-center">
                    College Image
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 text-center border-l border-gray-200 flex items-center justify-center"
                    >
                      {loadingStates[index] ? (
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                      ) : selectedColleges[index] ? (
                        <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={
                              selectedColleges[index].profilePic ||
                              `https://source.unsplash.com/200x200/?university,college,campus&random=${index}`
                            }
                            alt={selectedColleges[index].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comparison Rows */}
                {[
                  { label: "Location", field: "location" },
                  { label: "Type", field: "facts.type" },
                  { label: "Founded", field: "facts.founded" },
                  { label: "Student Population", field: "facts.totalStudents" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 border-b border-gray-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="p-4 md:p-5 font-medium text-gray-700 flex items-center">
                      <span>{row.label}</span>
                    </div>
                    {[0, 1, 2].map((index) => {
                      // Show loading state
                      if (loadingStates[index]) {
                        return (
                          <div
                            key={index}
                            className="p-4 md:p-5 text-center border-l border-gray-200 flex items-center justify-center"
                          >
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                          </div>
                        );
                      }

                      // Handle nested properties like facts.type
                      let value = selectedColleges[index];
                      const fieldParts = row.field.split(".");
                      for (const part of fieldParts) {
                        value = value?.[part];
                      }

                      // Format specific fields
                      if (row.field === "facts.totalStudents" && value) {
                        value = value.toLocaleString();
                      }

                      return (
                        <div
                          key={index}
                          className="p-4 md:p-5 text-center border-l border-gray-200 flex items-center justify-center"
                        >
                          <div
                            className={`font-medium ${
                              selectedColleges[index]
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {value || "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Domains/Fields */}
                <div className="grid grid-cols-4 border-b border-gray-200 bg-white">
                  <div className="p-4 md:p-5 font-medium text-gray-700 flex items-center">
                    Academic Fields
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 text-center border-l border-gray-200"
                    >
                      {loadingStates[index] ? (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      ) : selectedColleges[index]?.domain?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1 md:gap-1.5">
                          {selectedColleges[index].domain.map((field, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Community Size */}
                <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">
                  <div className="p-4 md:p-5 font-medium text-gray-700 flex items-center">
                    Community Members
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 text-center border-l border-gray-200 flex items-center justify-center"
                    >
                      {loadingStates[index] ? (
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-8"></div>
                      ) : (
                        <div
                          className={`font-medium ${
                            selectedColleges[index]
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedColleges[index]?.members?.length || "—"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="grid grid-cols-4 border-b border-gray-200 bg-white">
                  <div className="p-4 md:p-5 font-medium text-gray-700">
                    Description
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 border-l border-gray-200 text-xs md:text-sm"
                    >
                      {loadingStates[index] ? (
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
                        </div>
                      ) : selectedColleges[index]?.description ? (
                        <div className="max-h-24 md:max-h-28 overflow-y-auto text-gray-600 text-left">
                          {selectedColleges[index].description}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">—</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* View Profile Buttons */}
                <div className="grid grid-cols-4 bg-gray-50">
                  <div className="p-4 md:p-5 font-medium text-gray-700 flex items-center">
                    College Profile
                  </div>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="p-4 md:p-5 flex justify-center border-l border-gray-200"
                    >
                      {loadingStates[index] ? (
                        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                      ) : selectedColleges[index] ? (
                        <Link
                          to={`/college/${selectedColleges[index]._id}`}
                          className="px-3 md:px-5 py-2 md:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 md:h-4 md:w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                            />
                          </svg>
                          Visit Profile
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Comparison Section */}
            <div className="mt-8 mb-6">
              <h2 className="text-xl font-bold mb-4">
                College Metrics Comparison
              </h2>

              {Object.entries({
                safety: "Campus Safety",
                healthcare: "Healthcare Services",
                qualityOfTeaching: "Teaching Quality",
                campusCulture: "Campus Culture",
                studentSupport: "Student Support",
                affordability: "Affordability",
                placements: "Job Placements",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="grid grid-cols-4 border-b border-gray-200 py-4"
                >
                  <div className="font-medium">{label}</div>

                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex flex-col items-center">
                      {selectedColleges[index] ? (
                        <>
                          {/* Rating Display */}
                          <div className="flex items-center mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating =
                                  selectedColleges[index]?.metrics?.[key]
                                    ?.rating || 0;
                                // Calculate filled percentage
                                const filled = Math.max(
                                  0,
                                  Math.min(1, rating - (star - 1))
                                );

                                return (
                                  <div
                                    key={star}
                                    className="relative w-4 h-4 mr-0.5"
                                  >
                                    {/* Background star */}
                                    <svg
                                      className="w-4 h-4 text-gray-300 absolute"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>

                                    {/* Filled star with clipping based on rating */}
                                    {filled > 0 && (
                                      <div
                                        className="absolute overflow-hidden"
                                        style={{ width: `${filled * 100}%` }}
                                      >
                                        <svg
                                          className="w-4 h-4 text-yellow-400"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="ml-1 text-xs">
                              (
                              {parseFloat(
                                selectedColleges[index]?.metrics?.[key]
                                  ?.rating || 0
                              ).toFixed(1)}
                              )
                            </span>
                          </div>

                          {/* Description (truncated) */}
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {selectedColleges[index]?.metrics?.[key]
                              ?.description || "No information"}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile View: Comparison Cards */}
            <div className="md:hidden mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Detailed Comparison
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Tap "See Details" on each college card to view detailed
                information
              </p>

              {/* College navigation pills */}
              <div className="flex justify-center mb-4 gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() =>
                      selectedColleges[index] &&
                      !loadingStates[index] &&
                      setMobileView(index)
                    }
                    disabled={!selectedColleges[index] || loadingStates[index]}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      !selectedColleges[index] || loadingStates[index]
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {loadingStates[index] ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 text-indigo-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      `College ${index + 1}`
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile College Detail Modal */}
        {renderMobileDetail()}

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default CollegeComparison;
