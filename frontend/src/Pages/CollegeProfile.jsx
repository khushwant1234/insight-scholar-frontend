import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { GetApiCall, PutApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";
import Loading from "../Components/Loading";
import PageNotFound from "../Components/PageNotFound";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CollegeProfile = () => {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("description");
  const [isCopied, setIsCopied] = useState(false);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinloading, setJoinloading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState([]); // Changed to array
  const [currentMediaInput, setCurrentMediaInput] = useState(""); // Added new state for input field
  const [posts, setPosts] = useState([]);
  const [replyFormVisible, setReplyFormVisible] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState({});
  const [repliesByPost, setRepliesByPost] = useState({});
  const [openDrawerPost, setOpenDrawerPost] = useState(null);
  const [allColleges, setAllColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

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
  }, [setUser]);

  useEffect(() => {
    setLoading(true);
    const fetchCollege = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/${id}`);
        if (data.success && data.college) {
          setCollege(data.college);
        } else {
          setCollege(null);
          toast.error("Failed to fetch college data");
        }
      } catch (error) {
        console.error(error);
        setCollege(null);
        toast.error("Failed to fetch college data");
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await PostApiCall(`${backendUrl}/api/post/college/${id}`);
        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          setPosts([]);
          toast.error("No posts found");
        }
      } catch (error) {
        console.error(error);
        setPosts([]);
        toast.error("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, [id]);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/${id}`);
        if (data.success && data.college) {
          setCollege(data.college);
        } else {
          setCollege(null);
        }
      } catch (error) {
        console.error(error);
        setCollege(null);
        toast.error("Failed to fetch college data");
      } finally {
        setJoinloading(false);
      }
    };
    fetchCollege();
  }, [joinloading]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await PostApiCall(`${backendUrl}/api/reply/post/${id}`);
        if (data.success && data.replies) {
          setReplies(data.replies);
        } else {
          setReplies([]);
          toast.error("No replies found");
        }
      } catch (error) {
        toast.error("Failed to fetch replies:", error);
        setReplies([]);
      }
    };

    fetchReplies();
  }, [id]);

  useEffect(() => {
    const fetchRepliesForPosts = async () => {
      const repliesMap = {};
      await Promise.all(
        posts.map(async (post) => {
          try {
            const data = await PostApiCall(
              `${backendUrl}/api/reply/post/${post._id}`
            );
            repliesMap[post._id] =
              data.success && data.replies ? data.replies : [];
          } catch (error) {
            repliesMap[post._id] = [];
            toast.error("Failed to fetch replies for post:", error);
          }
        })
      );
      setRepliesByPost(repliesMap);
    };

    if (posts.length > 0) {
      fetchRepliesForPosts();
    }
  }, [posts]);

  useEffect(() => {
    if (user && user.upvotedPosts) {
      const initialUpvotes = {};
      user.upvotedPosts.forEach((postId) => {
        initialUpvotes[postId] = true;
      });
      setUpvotedPosts(initialUpvotes);
    }
  }, [user]);

  const fetchUserUpvotes = async () => {
    if (!user || !user._id) return;

    try {
      const response = await GetApiCall(
        `${backendUrl}/api/upvote/user/${user._id}`
      );

      if (response.success && response.upvotes) {
        const upvotedMap = {};
        response.upvotes.forEach((upvote) => {
          upvotedMap[upvote.post] = true;
        });
        setUpvotedPosts(upvotedMap);
      }
    } catch (error) {
      console.error("Error fetching user upvotes:", error);
      toast.error("Failed to fetch user upvotes");
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchUserUpvotes();
    }
  }, [user, posts.length]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isMember = college?.members?.some(
    (member) => member._id === user._id || member.id === user._id
  );

  const canReply = user?.college === college?._id;

  const handleJoin = async () => {
    setJoinloading(true);
    try {
      const data = await PutApiCall(`${backendUrl}/api/college/${id}/join`, {
        userId: user._id,
      });
      if (data.success) {
        setCollege(data.college);
        toast.success("Joined college successfully!");
      } else {
        toast.error(data.message || "Failed to join college");
      }
    } catch (error) {
      toast.error("Error joining college");
      console.error("Join Error:", error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast.error("Post content is required");
      return;
    }
    if (postContent.length > 300) {
      toast.error("Post content cannot exceed 300 characters");
      return;
    }

    try {
      const data = await PostApiCall(`${backendUrl}/api/post`, {
        author: user._id,
        college: id,
        content: postContent,
        media: postMedia, // Now directly sending the array
        isAnonymous: isAnonymous,
      });

      if (data.success) {
        toast.success("Post created successfully");
        setPostContent("");
        setPostMedia([]); // Reset to empty array
        setCurrentMediaInput(""); // Clear the input field
        setIsAnonymous(false);
        setShowPostForm(false);

        const postsData = await PostApiCall(
          `${backendUrl}/api/post/college/${id}`
        );
        if (postsData.success && postsData.posts) {
          setPosts(postsData.posts);
        }
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      toast.error("Error creating post");
      console.error("Create post error:", error);
    }
  };

  const addMediaUrl = () => {
    if (currentMediaInput.trim() === "") {
      toast.error("Please enter a valid media URL");
      return;
    }

    // Add URL to the array
    setPostMedia([...postMedia, currentMediaInput.trim()]);
    setCurrentMediaInput(""); // Clear input field
  };

  const removeMediaUrl = (indexToRemove) => {
    setPostMedia(postMedia.filter((_, index) => index !== indexToRemove));
  };

  const toggleReplyForm = (postId) => {
    setReplyFormVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReplyChange = (postId, value) => {
    setReplyText((prev) => ({ ...prev, [postId]: value }));
  };

  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    if (!replyText[postId] || replyText[postId].trim() === "") {
      toast.error("Reply content is required");
      return;
    }
    try {
      const data = await PostApiCall(`${backendUrl}/api/reply`, {
        author: user._id,
        post: postId,
        content: replyText[postId],
        media: [],
      });
      if (data.success || data.reply._id) {
        toast.success("Reply posted successfully");
      } else {
        toast.error("Failed to post reply");
      }
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
      setReplyFormVisible((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      toast.error("Error posting reply:", error);
    }
  };

  const handlePostUpvote = async (postId) => {
    if (!user) {
      toast.info("Please log in to upvote posts");
      return;
    }

    try {
      const alreadyUpvoted = upvotedPosts[postId] || false;
      const userId = user._id;
      const upvoteChange = alreadyUpvoted ? -1 : 1;

      const data = await PutApiCall(
        `${backendUrl}/api/post/upvotes/${postId}`,
        { upvoteChange, userId }
      );
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, upvotes: data.upvotes } : post
          )
        );

        setUpvotedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));

        if (data.upvotedPosts) {
          const newUpvotedMap = {};
          data.upvotedPosts.forEach((postId) => {
            newUpvotedMap[postId] = true;
          });
          setUpvotedPosts(newUpvotedMap);
        }
      } else {
        toast.error(data.error || "Failed to update upvote");
      }
    } catch (error) {
      toast.error("Error updating upvote");
      console.error("Upvote error:", error);
    }
  };

  const selectedPost = posts.find((post) => post._id === openDrawerPost);

  useEffect(() => {
    const fetchAllColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        if (data.success && data.colleges) {
          setAllColleges(data.colleges);
        } else {
          setAllColleges([]);
          toast.error("No colleges found");
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
        toast.error("Failed to fetch colleges");
        setAllColleges([]);
      } finally {
        setCollegesLoading(false);
      }
    };

    fetchAllColleges();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await GetApiCall(
          `${backendUrl}/api/college/${id}/mentors`
        );
        if (data.success && data.mentors) {
          setMentors(data.mentors);
        } else {
          setMentors([]);
          toast.error("No mentors found for this college");
        }
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
        toast.error("Failed to fetch mentors");
        setMentors([]);
      } finally {
        setMentorsLoading(false);
      }
    };

    fetchMentors();
  }, [id]);

  if (loading) {
    return (
      <FadeWrapper>
        <Loading />
      </FadeWrapper>
    );
  }

  if (!college) {
    return <PageNotFound />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#484848]">
                  Overview
                </h3>
                <p className="text-[#484848]">{college.description}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#484848]">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#484848]">
                      <b>Founded</b>
                    </p>
                    <p className="font-medium text-[#484848]">
                      {college.facts.founded}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#484848]">
                      <b>Type</b>
                    </p>
                    <p className="font-medium text-[#484848]">
                      {college.facts.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#484848]">
                      <b>Total Students</b>
                    </p>
                    <p className="font-medium text-[#484848]">
                      {college.facts.totalStudents}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "discussion":
        return (
          <div className="space-y-6">
            <div className="mt-6">
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {showPostForm ? "Cancel" : "Create Post"}
              </button>
              {showPostForm && (
                <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
                  <textarea
                    value={postContent}
                    maxLength="300"
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind? (Max 300 characters)"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="4"
                  ></textarea>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={currentMediaInput}
                      onChange={(e) => setCurrentMediaInput(e.target.value)}
                      placeholder="Enter media URL (image or video)"
                      className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={addMediaUrl}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                      Add Media
                    </button>
                  </div>

                  {/* Display list of added media URLs */}
                  {postMedia.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Added Media:
                      </p>
                      <ul className="space-y-2">
                        {postMedia.map((url, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                          >
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                              {url}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMediaUrl(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      id="anonymous-checkbox"
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="anonymous-checkbox"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Post anonymously
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>

            {posts.map((post) => {
              const createdAt = new Date(post.createdAt).toLocaleString();

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  <div className="flex items-center mb-2">
                    {post.isAnonymous ? (
                      // Anonymous user display
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="ml-2">
                          <p className="font-semibold">Anonymous User</p>
                        </div>
                      </div>
                    ) : (
                      // Regular user display
                      <div className="flex items-center">
                        <img
                          src={post.author.profilePic || "/user-icon.svg"}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <div>
                          <p className="font-semibold">{post.author.name}</p>
                        </div>
                      </div>
                    )}
                    <span className="text-sm text-gray-500 ml-auto">
                      {createdAt}
                    </span>
                  </div>

                  <p className="mb-2">{post.content}</p>

                  {/* Display post media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {post.media.map((mediaUrl, index) => {
                        // Check if it's an image URL
                        const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(
                          mediaUrl
                        );

                        return isImage ? (
                          <img
                            key={index}
                            src={mediaUrl}
                            alt="Post media"
                            className="rounded-lg max-h-96 w-auto"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Image+Not+Available";
                            }}
                          />
                        ) : (
                          // If not an image, show as a clickable link
                          <a
                            key={index}
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-100 p-3 rounded-lg text-blue-600 hover:bg-gray-200"
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>
                              View Media
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Add this section for viewing replies/comments */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePostUpvote(post._id)}
                        className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
                          upvotedPosts[post._id]
                            ? "bg-red-50 text-red-600"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
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
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        {post.upvotes || 0}
                      </button>

                      <button
                        onClick={() => setOpenDrawerPost(post._id)}
                        className="flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600"
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {repliesByPost[post._id]?.length || 0} Replies
                      </button>
                    </div>

                    {canReply && (
                      <button
                        onClick={() => setOpenDrawerPost(post._id)}
                        className="text-sm text-[#D43134C4] hover:text-[#7B0F119E] font-medium"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      case "members":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {college.members.map((member) => (
              <div
                key={member._id || member.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-[#D43134C4]/20 overflow-hidden"
              >
                <div className="flex flex-row items-center gap-2">
                  {member.profilePic && (
                    <img
                      src={member.profilePic}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mb-2"
                    />
                  )}
                  <h4 className="font-medium text-[#484848] ">{member.name}</h4>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="w-full h-[300px] relative">
          <img
            src={
              college.profilePic ||
              "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sbGVnZXxlbnwwfHwwfHx8MA%3D%3D"
            }
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold">{college.name}</h1>
              <p className="text-xl mt-2 opacity-90">{college.location}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 order-3 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-[#484848]">
                    All Colleges
                  </h2>
                  <Link
                    to="/colleges"
                    className="text-[#D43134C4] text-sm hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {collegesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D43134C4]"></div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {allColleges.map((col) => (
                      <Link
                        key={col._id}
                        to={`/college/${col._id}`}
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          col._id === college._id
                            ? "bg-[#D43134C4]/10 border-l-4 border-[#D43134C4]"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <img
                          src={
                            col.profilePic || "https://via.placeholder.com/40"
                          }
                          alt={`.`}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-[#484848] text-sm">
                            {col.name}
                          </h3>
                          <p className="text-gray-500 text-xs">
                            {col.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#D43134C4]/10 text-[#D43134C4] px-3 py-1 rounded-full text-sm font-medium">
                      {college.facts.type}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      Founded: {college.facts.founded}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {isMember ? (
                      <button
                        disabled
                        className="bg-[#7B0F119E] text-white px-4 py-2 rounded-md cursor-not-allowed text-sm flex-1 sm:flex-none"
                      >
                        Joined
                      </button>
                    ) : joinloading ? (
                      <button
                        disabled
                        className="bg-[#D43134C4] text-white px-4 py-2 rounded-md cursor-not-allowed text-sm flex-1 sm:flex-none"
                      >
                        <svg
                          className="animate-spin h-5 w-5 text-white inline mr-1"
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
                        Joining...
                      </button>
                    ) : (
                      <button
                        onClick={handleJoin}
                        className="bg-[#D43134C4] text-white px-4 py-2 rounded-md hover:bg-[#7B0F119E] transition-colors text-sm flex-1 sm:flex-none"
                      >
                        Join College
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="border border-[#D43134C4] text-[#D43134C4] px-4 py-2 rounded-md hover:bg-[#D43134C4] hover:text-white transition-colors text-sm flex-1 sm:flex-none"
                    >
                      {isCopied ? "Link Copied!" : "Share"}
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                  <div className="flex space-x-6 min-w-max pb-1">
                    {["description", "discussion", "members"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                          activeTab === tab
                            ? "border-b-2 border-[#D43134C4] text-[#D43134C4]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-hidden">{renderTabContent()}</div>
              </div>
            </div>

            <div className="lg:col-span-3 order-2 lg:order-3">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h2 className="text-lg font-semibold text-[#484848] mb-4">
                  Student Mentors
                </h2>

                {mentorsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D43134C4]"></div>
                  </div>
                ) : mentors.length > 0 ? (
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <div
                        key={mentor._id}
                        className="flex items-start p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={
                            mentor.profilePic ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                          }
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full border-2 border-[#D43134C4]/20 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-[#484848]">
                            {mentor.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {mentor.major}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="bg-[#D43134C4]/10 text-[#D43134C4] px-2 py-0.5 rounded text-xs">
                              {mentor.karma} karma
                            </span>
                            {mentor.isMentor && (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                Mentor
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/mentor/${mentor._id}`}
                            className="text-[#D43134C4] text-xs hover:underline inline-block mt-1"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-2">
                      No mentors available yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Students with 500+ karma points become mentors
                    </p>
                  </div>
                )}

                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[#484848] mb-2">
                    Community Stats
                  </h3>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#D43134C4]">
                        {college.members?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#D43134C4]">
                        {posts.length}
                      </p>
                      <p className="text-xs text-gray-500">Discussions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#D43134C4]">
                        {mentors.length}
                      </p>
                      <p className="text-xs text-gray-500">Mentors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {openDrawerPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setOpenDrawerPost(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
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

            {selectedPost && (
              <div className="mb-6 border-b pb-4">
                <h3 className="text-xl mb-3 font-semibold text-[#484848]">
                  Post
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    {selectedPost.isAnonymous ? (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={
                          selectedPost.author.profilePic ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                        }
                        alt={selectedPost.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-[#484848]">
                        {selectedPost.isAnonymous
                          ? "Anonymous User"
                          : selectedPost.author.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedPost.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#484848] mb-3">
                    {selectedPost.content}
                  </p>

                  {/* Add media display */}
                  {selectedPost.media && selectedPost.media.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {selectedPost.media.map((mediaUrl, index) => {
                        // Check if it's an image URL
                        const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(
                          mediaUrl
                        );

                        return isImage ? (
                          <img
                            key={index}
                            src={mediaUrl}
                            alt="Post media"
                            className="rounded-lg max-w-full h-auto max-h-96"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Image+Not+Available";
                            }}
                          />
                        ) : (
                          // If not an image, show as a clickable link
                          <a
                            key={index}
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-100 p-3 rounded-lg text-blue-600 hover:bg-gray-200"
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>
                              View Media
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <h3 className="text-xl mb-4 font-semibold text-[#484848]">
              Replies ({repliesByPost[openDrawerPost]?.length || 0})
            </h3>

            {repliesByPost[openDrawerPost] &&
            repliesByPost[openDrawerPost].length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {repliesByPost[openDrawerPost].map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-gray-50 p-3 rounded-lg border"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={reply.author.profilePic || "/user-icon.svg"}
                        alt={reply.author.name}
                        className="w-8 h-8 rounded-full mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-[#484848] text-sm">
                            {reply.author.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-[#484848] mt-1">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            )}

            {canReply && (
              <form
                onSubmit={(e) => handleReplySubmit(e, openDrawerPost)}
                className="mt-6"
              >
                <textarea
                  value={replyText[openDrawerPost] || ""}
                  onChange={(e) =>
                    handleReplyChange(openDrawerPost, e.target.value)
                  }
                  placeholder="Add your reply..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] resize-none"
                  rows="3"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-[#D43134C4] text-white px-4 py-2 rounded-md hover:bg-[#7B0F119E] transition-colors"
                >
                  Submit Reply
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeProfile;
