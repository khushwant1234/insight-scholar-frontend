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
import { use } from "react";

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
      <div className="min-h-screen bg-[#D9D9D9] flex items-center justify-center">
        <div className="text-[#484848] text-xl">User not found</div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D43134C4]/20">
                <h3 className="text-xl font-semibold text-[#484848] mb-4">
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Show karma points */}
                  <div className="text-center p-3 bg-[#D9D9D9] rounded-lg">
                    <div className="text-2xl font-bold text-[#D43134C4]">
                      {user.karma}
                    </div>
                    <div className="text-sm text-[#484848] capitalize">
                      Karma Points
                    </div>
                  </div>

                  {/* Filter out upvotes from stats and show other stats */}
                  {Object.entries(user.stats)
                    .filter(([key]) => key !== "upvotes")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-3 bg-[#D9D9D9] rounded-lg"
                      >
                        <div className="text-2xl font-bold text-[#D43134C4]">
                          {value}
                        </div>
                        <div className="text-sm text-[#484848] capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* Interests */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D43134C4]/20">
                <h3 className="text-xl font-semibold text-[#484848] mb-4">
                  Interests
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#D43134C4]/10 text-[#D43134C4] rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                {user.interests.length === 0 && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => navigate("/interests")}
                      className="px-4 py-2 bg-[#D43134C4] text-white rounded-md hover:bg-[#D43134C4]/80 transition-colors text-sm flex items-center gap-2"
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Interests
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="space-y-4">
            {postloading ? (
              <div className="flex justify-center items-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-[#D43134C4]"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-[#D43134C4]/20"
                >
                  {editingPostId === post._id ? (
                    <div>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="3"
                      ></textarea>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleSaveEdit(post._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-[#484848]">
                        {post.content}
                      </div>
                      {post.college && (
                        <div className="mt-2">
                          <span className="text-xs text-[#7B7B7B]">In: </span>
                          <Link
                            to={`/college/${post.college._id}`}
                            className="text-[#D43134C4] hover:underline text-xs"
                          >
                            {post.college.name}
                          </Link>
                        </div>
                      )}
                      <div className="text-xs text-[#7B7B7B] mt-2">
                        Posted on: {new Date(post.createdAt).toLocaleString()}
                      </div>
                      {post.author._id === user._id && (
                        <div className="mt-2 space-x-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-xs text-[#D43134C4] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-[#484848] text-center py-8">
                No posts to display.
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
      <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-[#D43134C4]/20 to-indigo-100"></div>

            <div className="px-6 py-4 relative">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={user.profilePic || "/user-icon.svg"}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md -mt-16 object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h1 className="text-3xl font-bold text-[#484848]">
                      {user.name}
                    </h1>

                    {/* Mentor Badge */}
                    {user && user.isMentor && (
                      <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-800 text-sm font-medium inline-block">
                        Mentor
                      </div>
                    )}
                  </div>

                  <div className="text-[#484848] mt-2">
                    {userCollege ? userCollege.name : "Not in College"}
                    {user.major && user.year && (
                      <span>
                        {" "}
                        • {user.major} • {user.year}
                      </span>
                    )}
                  </div>

                  {/* LinkedIn Link */}
                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#484848] hover:text-[#D43134C4] inline-flex items-center gap-1 mt-2"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 mt-4 md:mt-0">
                  {/* Karma Points */}
                  <div className="bg-[#D43134C4]/10 px-4 py-2 rounded-lg">
                    <span className="text-[#D43134C4] font-bold">
                      {user.karma}
                    </span>
                    <span className="text-[#484848] ml-2">Karma Points</span>
                  </div>

                  {/* Edit Profile */}
                  <Link
                    to="/update-profile"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
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
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </Link>

                  {/* Mentor Resign Button */}
                  {user && user.isMentor && (
                    <button
                      onClick={handleToggleMentor}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
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
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Resign as Mentor
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-[#D43134C4]/20">
              <div className="flex space-x-8 px-6">
                {["overview", "activity"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 capitalize font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-[#D43134C4] text-[#D43134C4]"
                        : "text-[#484848] hover:text-[#D43134C4]/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">{renderTabContent()}</div>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default UserProfile;
