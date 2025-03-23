import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import {
  GetApiCall,
  PutApiCall,
  DeleteApiCall,
  PostApiCall,
} from "../utils/apiCall";
import FadeWrapper from "../Components/fadeIn";
import Loading from "../Components/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const { user, setUser, userCollege, setUserCollege } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [postloading, setPostloading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Fetch User Profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await PostApiCall(`${backendUrl}/api/user/profile`);
        const { success, ...userData } = response;
        setUser(userData);
        if (response.success) {
          setLoading(false);
        }
      } catch (err) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [setUser]);

  useEffect(() => {
    setLoading(true);
    const fetchUserPosts = async () => {
      try {
        const response = await PostApiCall(`${backendUrl}/api/post/user/${id}`);
        if (response.success && response.posts) {
          setPosts(response.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        toast.error("Failed to fetch user posts");
      } finally {
        // setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    setLoading(true);
    if (user) {
      const fetchCollege = async () => {
        try {
          const data = await GetApiCall(
            `${backendUrl}/api/college/${user.college}`
          );
          if (data.success && data.college) {
            setUserCollege(data.college);
          } else {
            setUserCollege(null);
          }
        } catch (error) {
          setUserCollege(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCollege();
    }
  }, [user]);

  // Fetch User Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostApiCall(`${backendUrl}/api/post/user/${id}`);
        if (response.success && response.posts) {
          setPosts(response.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        toast.error("Failed to fetch user posts");
      }
      setPostloading(false);
    };
    fetchPosts();
  }, [user]);

  // Handle post editing
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    if (!editedContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    // Check for a maximum of 300 words
    const wordCount = editedContent.trim().split(/\s+/).length;
    if (wordCount > 300) {
      toast.error("Post content cannot exceed 300 words");
      return;
    }
    try {
      const updatedData = { content: editedContent };
      const data = await PutApiCall(
        `${backendUrl}/api/post/${postId}`,
        updatedData
      );

      if (data.success) {
        toast.success("Post updated successfully");
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, content: data.content } : post
          )
        );
        setEditingPostId(null);
        setEditedContent("");
      } else {
        toast.error("Failed to update post");
      }
    } catch (error) {
      toast.error("Error updating post");
      // console.error("Update post error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditedContent("");
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;
    const id = postId;
    try {
      const data = await DeleteApiCall(`${backendUrl}/api/post/${id}`);
      if (data && data.message) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
      // console.error("Delete post error:", error);
    }
  };

  // Add this function to handle toggling mentor status
  const handleToggleMentor = async () => {
    try {
      const response = await PutApiCall(`${backendUrl}/api/user/toggle-mentor`);
      if (response.success) {
        setUser({ ...user, isMentor: false });
        toast.success("You are no longer a mentor");
      } else {
        toast.error(response.message || "Failed to update mentor status");
      }
    } catch (error) {
      toast.error("Error updating mentor status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <FadeWrapper>
        <Loading />
      </FadeWrapper>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-xl font-medium bg-white p-8 rounded-lg shadow-sm">
          User not found
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stats */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800">
                    Activity Statistics
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Karma points */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                    <div className="text-3xl font-bold text-indigo-600">
                      {user.karma}
                    </div>
                    <div className="text-sm font-medium text-gray-600 mt-1">
                      Karma Points
                    </div>
                  </div>

                  {/* Other stats */}
                  {Object.entries(user.stats)
                    .filter(([key]) => key !== "upvotes")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <div className="text-3xl font-bold text-gray-700">
                          {value}
                        </div>
                        <div className="text-sm font-medium text-gray-600 mt-1 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800">
                    Interests & Skills
                  </h3>
                </div>

                {user.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-3">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-3 text-center">
                      No interests added yet
                    </p>
                    <button
                      onClick={() => navigate("/interests")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Interests
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5"
                    />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">
                  Education
                </h3>
              </div>

              {userCollege ? (
                <div className="flex flex-col md:flex-row md:items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {userCollege.name}
                    </h4>
                    {user.major && user.year && (
                      <p className="text-gray-600">
                        {user.major} • Class of {user.year}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-gray-600">
                    Not affiliated with any college
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                Recent Activity
              </h3>
            </div>

            {postloading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Loading posts...</p>
                </div>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    {editingPostId === post._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows="4"
                        ></textarea>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(post._id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            {post.college && (
                              <Link
                                to={`/college/${post.college._id}`}
                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                {post.college.name}
                              </Link>
                            )}
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>

                          {post.author._id === user._id && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(post)}
                                className="text-sm text-gray-600 hover:text-indigo-600 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(post._id)}
                                className="text-sm text-gray-600 hover:text-red-600 flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No posts yet
                </h3>
                <p className="text-gray-500 max-w-sm">
                  When you create posts, they'll appear here on your profile.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden mb-6 md:mb-8 border border-gray-200">
            {/* Banner */}
            <div className="h-28 sm:h-32 md:h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Main Profile Info Container - Better stacking behavior */}
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 sm:-mt-16 gap-4 md:gap-6">
                {/* Profile Image - More responsive sizing */}
                <div className="flex-shrink-0 relative z-10">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="group relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <svg
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <Link
                        to="/update-profile"
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 rounded-xl flex items-center justify-center transition-opacity duration-200"
                      >
                        <div className="text-white text-sm font-medium bg-indigo-600 px-3 py-1.5 rounded-lg">
                          Add Photo
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* User Info - Center aligned on mobile, left aligned on desktop */}
                <div className="flex-1 text-center md:text-left pt-1 md:pt-0">
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-1 justify-center md:justify-start">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {user.name}
                    </h1>
                    {user.isMentor && (
                      <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-sm">
                        Mentor
                      </div>
                    )}
                  </div>

                  <div className="text-gray-600 flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
                    {userCollege && (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {userCollege.name}
                      </span>
                    )}

                    {user.major && (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        {user.major}
                      </span>
                    )}

                    {user.year && (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Class of {user.year}
                      </span>
                    )}
                  </div>

                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Actions - Better responsive layout with wrapping */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-center md:justify-end">
                <div className="px-3 sm:px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-bold text-indigo-600">
                      {user.karma}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Karma Points</div>
                </div>

                <Link
                  to="/update-profile"
                  className="px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>

                {user.isMentor && (
                  <button
                    onClick={handleToggleMentor}
                    className="px-3 sm:px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium shadow-sm flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    <span className="hidden sm:inline">Resign as</span> Mentor
                  </button>
                )}
              </div>
            </div>

            {/* Tabs - Ensure scrolling on mobile */}
            <div className="px-4 sm:px-6 border-t border-gray-200 overflow-x-auto">
              <div className="flex -mb-px min-w-max">
                {["overview", "activity"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-4 sm:px-6 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="capitalize">{tab}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div>{renderTabContent()}</div>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default UserProfile;
