import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LiveChat from "../Components/LiveChat";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import FadeWrapper from "../Components/fadeIn";
import SearchBar from "../Components/SearchBar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [topColleges, setTopColleges] = useState([]);
  const [topCommentsLoading, setTopCommentsLoading] = useState(true);
  const [topCollegesLoading, setTopCollegesLoading] = useState(true);
  const [topComments, setTopComments] = useState([]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await PostApiCall(`${backendUrl}/api/user/profile`);
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
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
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
      } finally {
        setTopCollegesLoading(false);
      }
    };
    fetchColleges();
  }, [user]);

  useEffect(() => {
    const fetchTopComments = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/post/top`);
        if (data.success && data.topPosts) {
          setTopComments(data.topPosts);
        } else {
          console.error("Error fetching top comments");
          toast.error("Failed to fetch top comments");
        }
      } catch (error) {
        console.error("Error fetching top comments:", error);
        toast.error("Failed to fetch top comments");
      } finally {
        setTopCommentsLoading(false);
      }
    };

    fetchTopComments();
  }, []);

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
        <Navbar />

        {/* Main content */}
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              {/* Hero Content */}
              <div className="md:w-1/2 text-left">
                <h1 className="text-[#062f2e] text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Find Your Perfect College Community
                </h1>
                <p className="text-[#062f2e]/80 text-lg mb-8 max-w-xl">
                  Connect with peers, get answers from mentors, and join college
                  communities that will shape your academic journey.
                </p>

                {/* Search Bar Section */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-[#a08961]/20 mb-6">
                  <h2 className="text-xl font-semibold text-[#062f2e] mb-4">
                    Find Your College
                  </h2>
                  <SearchBar />
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <Link
                    to="/mentors"
                    className="bg-[#062f2e] text-white px-6 py-3 rounded-lg hover:bg-[#845c36] transition-colors flex items-center gap-2"
                  >
                    Find Mentors
                  </Link>
                  <Link
                    to="/colleges"
                    className="border border-[#062f2e] text-[#062f2e] bg-white px-6 py-3 rounded-lg hover:bg-[#062f2e]/5 transition-colors"
                  >
                    Browse Colleges
                  </Link>
                </div>

                {/* Stats */}
                {/* <div className="flex gap-8 mt-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#062f2e]">500+</p>
                    <p className="text-sm text-[#062f2e]/80">Colleges</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#062f2e]">10k+</p>
                    <p className="text-sm text-[#062f2e]/80">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#062f2e]">50k+</p>
                    <p className="text-sm text-[#062f2e]/80">Discussions</p>
                  </div>
                </div> */}
              </div>

              {/* Hero Image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-[#a08961]/20 rounded-2xl"></div>
                  <img
                    src="/images/campus-life.jpg"
                    alt="Campus Life"
                    className="w-full h-auto rounded-2xl shadow-lg relative z-10"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute -bottom-4 -right-4 w-3/4 h-1/2 bg-[#a08961]/10 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-0.5 bg-[#a08961]/30"></div>
              <div className="w-2 h-2 rounded-full bg-[#a08961]"></div>
              <div className="flex-1 h-0.5 bg-[#a08961]/30"></div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="max-w-5xl mx-auto py-20">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-[#062f2e] text-3xl md:text-4xl font-bold mb-3">
                What Our Community Is Discussing
              </h2>
              <p className="text-[#062f2e]/70 text-lg max-w-2xl mx-auto">
                Join thousands of students sharing insights and experiences
                across colleges nationwide
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-20 h-1 bg-[#a08961]"></div>
              </div>
            </div>

            {/* Comments Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCommentsLoading ? (
                <div className="col-span-full flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#062f2e]"></div>
                </div>
              ) : (
                topComments.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-6 rounded-lg shadow-md border border-[#a08961]/20 hover:shadow-lg transition-shadow group"
                  >
                    {/* Quote Icon */}
                    <div className="text-[#a08961] mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <p className="text-[#062f2e]/90 mb-3 line-clamp-3">
                        {post.content.length > 150
                          ? `${post.content.substring(0, 150)}...`
                          : post.content}
                      </p>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              post.author?.profilePic ||
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                            }
                            alt={post.author?.name}
                            className="w-10 h-10 rounded-full border-2 border-[#a08961]/20"
                          />
                          <div>
                            <h4 className="font-medium text-[#062f2e]">
                              {post.author?.name || "Anonymous"}
                            </h4>
                            {post.college && (
                              <div className="flex items-center text-xs text-[#062f2e]/70">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
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
                                <Link
                                  to={`/college/${post.college._id}`}
                                  className="hover:text-[#845c36]"
                                >
                                  {post.college.name}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-[#062f2e] bg-[#062f2e]/5 px-2 py-1 rounded-full">
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
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            <span className="font-medium">{post.upvotes}</span>
                          </div>
                          <span className="text-xs text-[#062f2e]/70 mt-1">
                            {new Date(post.createdAt).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View More Button */}
            <div className="mt-10 text-center">
              <Link
                to="/colleges"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#062f2e] text-[#062f2e] rounded-lg hover:bg-[#062f2e]/5 transition-colors"
              >
                Explore More Discussions
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Top Colleges Section */}
          <div className="col-span-12 md:col-span-8 my-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#062f2e]">
                  Top Colleges
                </h2>
                <Link
                  to="/colleges"
                  className="text-[#a08961] hover:underline text-sm"
                >
                  View All Colleges
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topCollegesLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#062f2e]"></div>
                  </div>
                ) : (
                  topColleges.map((college) => (
                    <div
                      key={college._id}
                      className="flex flex-col gap-4 p-4 border border-[#a08961]/30 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={
                          college.profilePic ||
                          "https://via.placeholder.com/150"
                        }
                        alt={college.name}
                        className="w-full h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-[#062f2e]">
                              {college.name}
                            </h3>
                            <p className="text-sm text-[#062f2e]/80">
                              {college.location}
                            </p>
                          </div>
                          <span className="text-[#845c36] font-medium text-sm">
                            {college.facts.type}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-[#062f2e]/80">
                            Founded In: {college.facts.founded}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {college.domain &&
                            college.domain.map((domain, index) => (
                              <span
                                key={index}
                                className="text-xs bg-[#a08961]/20 text-[#845c36] px-2 py-1 rounded-full"
                              >
                                {domain}
                              </span>
                            ))}
                        </div>
                      </div>
                      <Link
                        to={`/college/${college._id}`}
                        className="bg-[#062f2e] text-white px-4 py-2 rounded-lg hover:bg-[#845c36] transition-colors text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* (Other sections ) */}
        </div>

        {/* Add LiveChat component */}
        <LiveChat />

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default Home;
