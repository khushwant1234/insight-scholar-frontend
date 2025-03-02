import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { GetApiCall, PutApiCall, DeleteApiCall } from "../utils/apiCall";
import FadeWrapper from "../Components/fadeIn";

const UserProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [postloading, setPostloading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Fetch User Profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await GetApiCall(
          `http://localhost:8000/api/user/profile`
        );
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

  // Fetch User Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await GetApiCall(
          `http://localhost:8000/api/post/user/${id}`
        );
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
  }, [id]);

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
        `http://localhost:8000/api/post/${postId}`,
        updatedData
      );
      if (data && data._id) {
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
      console.error("Update post error:", error);
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
      const data = await DeleteApiCall(`http://localhost:8000/api/post/${id}`);
      if (data && data.message) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
      console.error("Delete post error:", error);
    }
  };

  if (loading) {
    return (
      <FadeWrapper>
        <div className="min-h-screen bg-[#D9D9D9] flex items-center justify-center">
          <div className="text-[#484848] text-xl">Loading...</div>
        </div>
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
                  {Object.entries(user.stats).map(([key, value]) => (
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-32 bg-[#D43134C4]/20"></div>
            <div className="px-6 py-4 relative">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                <img
                  src={user.profilePic || "/user-icon.svg"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white -mt-16"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#484848]">
                    {user.name}
                  </h1>
                  <p className="text-[#484848]">{user.college}</p>
                  <p className="text-[#484848]">
                    {user.major} • {user.year}
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                  <a
                    href="/update-profile"
                    className="text-[#484848] hover:text-[#D43134C4]"
                  >
                    <img src="/icons/edit.svg" alt="Edit Profile" />
                  </a>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                  <div className="bg-[#D43134C4]/10 px-4 py-2 rounded-lg">
                    <span className="text-[#D43134C4] font-bold">
                      {user.karma}
                    </span>
                    <span className="text-[#484848] ml-2">Karma Points</span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#484848] hover:text-[#D43134C4]"
                    >
                      <span className="capitalize">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-t border-[#D43134C4]/20">
              <div className="flex space-x-8">
                {["overview", "activity"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-[#D43134C4] text-[#D43134C4]"
                        : "text-[#484848]"
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
