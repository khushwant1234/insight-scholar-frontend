import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Fetch mentors data on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/user/mentors`);
        if (data.success) {
          // Filter to only include mentors who aren't assigned
          const availableMentors = data.mentors.filter(
            (mentor) => mentor.mentorDetails && !mentor.mentorDetails.isAssigned
          );
          setMentors(availableMentors);
        } else {
          toast.error(data.error || "Failed to fetch mentors");
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error("Error fetching mentors");
      }
    };

    fetchMentors();
  }, []);

  // Fetch colleges data on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        if (data.success) {
          setColleges(data.colleges);
        } else {
          toast.error(data.error || "Failed to fetch colleges");
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error("Error fetching colleges");
      }
    };

    fetchColleges();
  }, []);

  // Filter mentors based on search term and selected college
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.major?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by college ID
    const matchesFilter =
      selectedFilter === "" ||
      (mentor.college && mentor.college._id === selectedFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#484848]">
              Available Mentors
            </h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-[#D43134C4]/20 rounded-lg focus:outline-none focus:border-[#D43134C4]"
              />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-[#D43134C4]/20 rounded-lg focus:outline-none focus:border-[#D43134C4]"
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="border border-[#D43134C4]/20 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        mentor.profilePic ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                      }
                      alt={mentor.name}
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/mentor/${mentor._id}`}
                        className="text-xl font-semibold text-[#484848] hover:text-[#D43134C4]"
                      >
                        {mentor.name}
                      </Link>
                      <p className="text-[#484848]">
                        {mentor.college && mentor.college.name
                          ? mentor.college.name
                          : "No College"}{" "}
                        • {mentor.year || "N/A"}
                      </p>
                      <p className="text-[#484848]">
                        {mentor.major || "No Major"}
                      </p>

                      {/* Display available tag with a green badge */}
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Available for mentoring
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/mentor/${mentor._id}`}
                        className="mt-4 inline-block bg-[#D43134C4] text-white px-4 py-2 rounded hover:bg-[#7B0F119E] transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No available mentors found
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentMentors;
