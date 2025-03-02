import React, { useState, useEffect } from "react";
import { GetApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall("http://localhost:8000/api/college");
        // console.log(data);
        // Assuming API returns an object with a 'colleges' array or the array directly
        if (data.success && data.colleges) {
          setColleges(data.colleges);
        } else if (Array.isArray(data)) {
          setColleges(data);
        } else {
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        toast.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <FadeWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-700">Loading Colleges...</div>
        </div>
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            All Colleges
          </h1>
          {colleges.length === 0 ? (
            <p className="text-lg text-gray-600">No colleges found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colleges.map((college) => (
                <div
                  key={college._id || college.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={
                      college.profilePic ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"
                    }
                    alt={college.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {college.name}
                    </h2>
                    <p className="text-gray-600">{college.location}</p>
                    <p className="text-gray-600">
                      <b>Founded:</b> {college.facts.founded}
                    </p>
                    <p className="text-gray-600">
                      <b>Type:</b> {college.facts.type}
                    </p>
                    <Link
                      to={`/college/${college._id || college.id}`}
                      className="mt-4 inline-block bg-[#D43134C4] text-white px-4 py-2 rounded hover:bg-[#7B0F119E] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default CollegeList;
