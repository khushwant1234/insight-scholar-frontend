import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const StudentMentors = () => {
  // Example mentors data - replace with API call
  const mentors = [
    {
      id: 1,
      name: "Alex Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      college: "MIT",
      major: "Computer Science",
      year: "Senior",
      rating: 4.8,
      specializations: ["Data Structures", "Algorithms", "Web Development"],
      studentsHelped: 45,
      availability: "Weekdays Evening",
    },
    {
      id: 2,
      name: "Maria Garcia",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      college: "Stanford",
      major: "Mathematics",
      year: "Junior",
      rating: 4.9,
      specializations: ["Calculus", "Linear Algebra", "Statistics"],
      studentsHelped: 38,
      availability: "Weekends",
    },
    {
      id: 3,
      name: "David Kim",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      college: "Harvard",
      major: "Physics",
      year: "Senior",
      rating: 4.7,
      specializations: ["Mechanics", "Quantum Physics", "Mathematics"],
      studentsHelped: 52,
      availability: "Flexible",
    },
  ];

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Filter mentors based on search term and selected filter
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "" || mentor.specializations.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#484848]">
              Student Mentors
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
                <option value="">All Subjects</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Web Development">Web Development</option>
                <option value="Calculus">Calculus</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Statistics">Statistics</option>
                <option value="Mechanics">Mechanics</option>
                <option value="Quantum Physics">Quantum Physics</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="border border-[#D43134C4]/20 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/user/${mentor.id}`}
                      className="text-xl font-semibold text-[#484848] hover:text-[#D43134C4]"
                    >
                      {mentor.name}
                    </Link>
                    <p className="text-[#484848]">
                      {mentor.college} • {mentor.year}
                    </p>
                    <p className="text-[#484848]">{mentor.major}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#D43134C4] font-bold">
                      {mentor.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(mentor.rating)
                              ? "text-[#D43134C4]"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-[#484848]">
                      ({mentor.studentsHelped} students helped)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-[#D43134C4]/10 text-[#D43134C4] rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#484848]">
                      Available: {mentor.availability}
                    </span>
                    <button className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentMentors;
