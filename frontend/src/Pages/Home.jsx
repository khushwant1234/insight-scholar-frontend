import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommunityChat from "../components/CommunityChat";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { GetApiCall } from "../utils/apiCall";
import FadeWrapper from "../Components/fadeIn";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [topColleges, setTopColleges] = useState([]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await GetApiCall(
          `http://localhost:8000/api/user/profile`
        );
        const { success, ...userData } = response;
        setUser(userData);
      } catch (err) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();

    window.scrollTo(0, 0);
  }, [setUser]);

  // Fetch all colleges and filter based on user's interests
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall("http://localhost:8000/api/college");
        if (data.success && data.colleges) {
          let matching = [];
          // Filter colleges that match user's interests
          if (user && user.interests && user.interests.length > 0) {
            matching = data.colleges.filter((college) => {
              return (
                college.domain &&
                college.domain.some((domain) =>
                  user.interests.some(
                    (interest) =>
                      interest.toLowerCase() === domain.toLowerCase()
                  )
                )
              );
            });
          }
          // If we have less than 3 matching, fill the gap with random colleges.
          if (matching.length < 3) {
            const missingCount = 3 - matching.length;
            // Exclude colleges already in matching
            const remaining = data.colleges.filter(
              (college) => !matching.some((m) => m._id === college._id)
            );
            // Randomly shuffle the remaining list and pick missingCount entries
            const randomPicked = remaining
              .sort(() => 0.5 - Math.random())
              .slice(0, missingCount);
            matching = [...matching, ...randomPicked];
          } else {
            // If there are more than 3, take only the first three
            matching = matching.slice(0, 3);
          }
          setTopColleges(matching);
        }
      } catch (error) {
        console.error("Error retrieving colleges:", error);
      }
    };
    fetchColleges();
  }, [user]);

  // Example comments and mentors data remain the same...
  const topComments = [
    {
      id: 1,
      author: "Sarah Johnson",
      content: "This platform has been amazing for my business growth!",
      date: "2 days ago",
    },
    {
      id: 2,
      author: "Mike Chen",
      content: "The features here are exactly what I've been looking for.",
      date: "3 days ago",
    },
    {
      id: 3,
      author: "Emma Wilson",
      content: "Great community and excellent support. Highly recommended!",
      date: "4 days ago",
    },
  ];

  const mentors = [
    {
      id: 1,
      name: "Alex Johnson",
      subject: "Computer Science",
      year: "Senior Year",
      rating: 4.8,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      id: 2,
      name: "Maria Garcia",
      subject: "Mathematics",
      year: "Junior Year",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      id: 3,
      name: "David Kim",
      subject: "Physics",
      year: "Senior Year",
      rating: 4.7,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
  ];

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 flex-1">
          <div className="flex flex-col items-center justify-center min-h-[90vh] text-center">
            <h1 className="text-[#484848] text-5xl font-bold mb-6">
              Welcome to Our Platform
            </h1>
            <p className="text-[#484848] text-xl mb-8 max-w-2xl">
              Discover amazing features and services that will help you achieve
              your goals. Start your journey with us today.
            </p>
            <button className="bg-[#D43134C4] text-white px-8 py-3 rounded-lg hover:bg-[#7B0F119E] transition-colors">
              Get Started
            </button>
          </div>

          {/* Separator */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-0.5 bg-[#D43134C4]/20"></div>
              <div className="w-2 h-2 rounded-full bg-[#D43134C4]"></div>
              <div className="flex-1 h-0.5 bg-[#D43134C4]/20"></div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="max-w-4xl mx-auto py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[#484848] text-3xl font-bold">
                What People Are Saying
              </h2>
              <Link to="/comments" className="text-[#D43134C4] hover:underline">
                View All Comments
              </Link>
            </div>
            <div className="grid gap-6">
              {topComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-[#D43134C4]/20"
                >
                  <p className="text-[#484848] mb-4">{comment.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[#D43134C4]">
                      {comment.author}
                    </span>
                    <span className="text-[#7B0F119E]">{comment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Colleges Section */}
          <div className="col-span-12 md:col-span-8 my-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#484848]">
                  Top Colleges
                </h2>
                <Link
                  to="/colleges"
                  className="text-[#D43134C4] hover:underline text-sm"
                >
                  View All Colleges
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topColleges.map((college) => (
                  <div
                    key={college._id}
                    className="flex flex-col gap-4 p-4 border border-[#D43134C4]/20 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={
                        college.profilePic || "https://via.placeholder.com/150"
                      }
                      alt={college.name}
                      className="w-full h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#484848]">
                            {college.name}
                          </h3>
                          <p className="text-sm text-[#484848]">
                            {college.location}
                          </p>
                        </div>
                        <span className="text-[#D43134C4] font-medium text-sm">
                          {college.facts.type}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-[#484848]">
                          Founded In: {college.facts.founded}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {college.domain &&
                          college.domain.map((domain, index) => (
                            <span
                              key={index}
                              className="text-xs bg-[#D43134C4]/10 text-[#D43134C4] px-2 py-1 rounded-full"
                            >
                              {domain}
                            </span>
                          ))}
                      </div>
                    </div>
                    <Link
                      to={`/college/${college._id}`}
                      className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* (Other sections ) */}
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default Home;
