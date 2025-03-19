import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LiveChat from "../Components/LiveChat";
// import CommunityChat from "../components/CommunityChat";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import FadeWrapper from "../Components/fadeIn";

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
        // console.log(data);
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
          // console.log(data.topPosts);
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

        {/* Main content */}
        <div className="flex-1 container mx-auto px-4 py-8">
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
              {/* <Link to="/posts" className="text-[#D43134C4] hover:underline">
                View All Posts
              </Link> */}
            </div>
            <div className="grid gap-6">
              {topCommentsLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D43134C4]"></div>
                </div>
              ) : (
                topComments.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-6 rounded-lg shadow-md border border-[#D43134C4]/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={
                          post.author?.profilePic ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                        }
                        alt={post.author?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-[#484848]">
                          {post.author?.name || "Anonymous"}
                        </h4>
                        {post.college && (
                          <p className="text-xs text-gray-500">
                            {/* Add link to college profile */}
                            <Link
                              to={`/college/${post.college._id}`}
                              className="hover:text-[#D43134C4] hover:underline"
                            >
                              {post.college.name}
                            </Link>
                          </p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-[#484848] mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[#484848] mb-4">
                      {/* Limit content to 150 characters */}
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
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
                        {post.upvotes} upvotes
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
                {topCollegesLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D43134C4]"></div>
                  </div>
                ) : (
                  topColleges.map((college) => (
                    <div
                      key={college._id}
                      className="flex flex-col gap-4 p-4 border border-[#D43134C4]/20 rounded-lg hover:shadow-lg transition-shadow"
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
