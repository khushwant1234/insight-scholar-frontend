import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { GetApiCall, PutApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Loading from "../Components/Loading";
import PageNotFound from "../Components/PageNotFound";
import FadeWrapper from "../Components/fadeIn";

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
  const [postMedia, setPostMedia] = useState("");
  const [posts, setPosts] = useState([]);
  const [replyFormVisible, setReplyFormVisible] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState({});
  const [repliesByPost, setRepliesByPost] = useState({});
  // New state to track which post's replies drawer is open (store post _id)
  const [openDrawerPost, setOpenDrawerPost] = useState(null);

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
  }, [setUser]);

  useEffect(() => {
    setLoading(true);
    const fetchCollege = async () => {
      try {
        const data = await GetApiCall(
          `http://localhost:8000/api/college/${id}`
        );
        if (data.success && data.college) {
          setCollege(data.college);
        } else {
          setCollege(null);
        }
      } catch (error) {
        console.error(error);
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await GetApiCall(
          `http://localhost:8000/api/post/college/${id}`
        );
        if (data.success && data.posts) {
          // console.log(data.posts);
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error(error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [id]);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const data = await GetApiCall(
          `http://localhost:8000/api/college/${id}`
        );
        if (data.success && data.college) {
          setCollege(data.college);
        } else {
          setCollege(null);
        }
      } catch (error) {
        console.error(error);
        setCollege(null);
      } finally {
        setJoinloading(false);
      }
    };
    fetchCollege();
  }, [joinloading]);

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
  }, [id]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await GetApiCall(
          `http://localhost:8000/api/reply/post/${id}`
        );
        if (data.success && data.replies) {
          // console.log(data.replies);
          setReplies(data.replies);
        } else {
          setReplies([]);
        }
      } catch (error) {
        toast.error("Failed to fetch replies:", error);
        setReplies([]);
      }
    };

    fetchReplies();
  }, [id]);

  // New useEffect: Fetch replies for each post
  useEffect(() => {
    const fetchRepliesForPosts = async () => {
      const repliesMap = {};
      await Promise.all(
        posts.map(async (post) => {
          try {
            const data = await GetApiCall(
              `http://localhost:8000/api/reply/post/${post._id}`
            );
            // console.log(data);
            repliesMap[post._id] =
              data.success && data.replies ? data.replies : [];
          } catch (error) {
            repliesMap[post._id] = [];
          }
        })
      );
      setRepliesByPost(repliesMap);
    };

    if (posts.length > 0) {
      fetchRepliesForPosts();
    }
  }, [posts]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Determine if the current user is already a member of the college.
  const isMember = college?.members?.some(
    (member) => member._id === user._id || member.id === user._id
  );

  // Determine if the current user belongs to this college based on their college property
  const canReply = user?.college === college?._id;

  // Handle join action
  const handleJoin = async () => {
    setJoinloading(true);
    try {
      const data = await PutApiCall(
        `http://localhost:8000/api/college/${id}/join`,
        { userId: user._id }
      );
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

  // New: Handle creating a post with a 300-character limit
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
      const data = await PostApiCall("http://localhost:8000/api/post", {
        author: user._id,
        college: id,
        content: postContent,
        media: postMedia ? [postMedia] : [],
      });
      if (data.success) {
        toast.success("Post created successfully");
        // Optionally clear form or refresh posts list if present
        setPostContent("");
        setPostMedia("");
        setShowPostForm(false);
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      toast.error("Error creating post");
      console.error("Create post error:", error);
    }
  };

  // Function to toggle reply form visibility for a given post
  const toggleReplyForm = (postId) => {
    setReplyFormVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Function to update reply content for a given post
  const handleReplyChange = (postId, value) => {
    setReplyText((prev) => ({ ...prev, [postId]: value }));
  };

  // Function to handle reply submission for a given post
  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    if (!replyText[postId] || replyText[postId].trim() === "") {
      toast.error("Reply content is required");
      return;
    }
    try {
      const data = await PostApiCall("http://localhost:8000/api/reply", {
        author: user._id,
        post: postId,
        content: replyText[postId],
        media: [],
      });
      // Assuming a successful reply creation returns the reply object (check your API response shape)
      if (data.success || data.reply._id) {
        toast.success("Reply posted successfully");
        // Optionally, refresh replies for the post here if needed.
      } else {
        toast.error("Failed to post reply");
      }
      // Clear the reply form and hide it
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
      setReplyFormVisible((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      toast.error("Error posting reply:", error);
    }
  };

  // New handler to toggle upvote for a given post
  const handlePostUpvote = async (postId) => {
    const alreadyUpvoted = upvotedPosts[postId] || false;
    // Toggle: +1 if not upvoted; -1 if already upvoted (allowing user to remove upvote)
    const upvoteChange = alreadyUpvoted ? -1 : 1;
    try {
      const data = await PutApiCall(
        `http://localhost:8000/api/post/upvotes/${postId}`,
        { upvoteChange }
      );
      if (data) {
        // Update the post's upvotes count in the local posts state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, upvotes: data.upvotes } : post
          )
        );

        // Toggle the upvoted status
        setUpvotedPosts((prev) => ({ ...prev, [postId]: !alreadyUpvoted }));
      }
    } catch (error) {
      toast.error("Error updating upvote");
      console.error("Upvote error:", error);
    }
  };

  // New: Determine the selected post to display in the drawer
  const selectedPost = posts.find((post) => post._id === openDrawerPost);

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
      case "comments":
        return (
          <div className="space-y-6">
            {posts.map((post) => {
              const createdAt = new Date(post.createdAt).toLocaleString();
              const updatedAt = new Date(post.updatedAt).toLocaleString();
              return (
                <div
                  key={post._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-[#D43134C4]/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-row items-center gap-2">
                      {post.author.profilePic && (
                        <img
                          src={post.author.profilePic || "/user-icon.svg"}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full "
                        />
                      )}
                      <h4 className="font-medium text-[#484848]">
                        {post.author.name}
                      </h4>
                    </div>
                    <span className="text-sm text-[#484848]">{createdAt}</span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="text-sm text-[#484848]">
                        Updated at: {updatedAt}
                      </span>
                    )}
                  </div>
                  <p className="text-[#484848]">{post.content}</p>

                  {/* Upvote option */}
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => handlePostUpvote(post._id)}
                      className={`px-3 py-1 rounded transition-colors ${
                        upvotedPosts[post._id]
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {upvotedPosts[post._id] ? "Upvoted" : "Upvote"}
                    </button>
                    <span className="text-sm text-gray-600">
                      {post.upvotes} Upvotes
                    </span>
                  </div>

                  {/* Instead of inline displaying replies, show a button to open the drawer */}
                  {repliesByPost[post._id] &&
                    repliesByPost[post._id].length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={() => setOpenDrawerPost(post._id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View Replies ({repliesByPost[post._id].length})
                        </button>
                      </div>
                    )}

                  {/* Reply option visible only to users whose profile college matches the current college */}
                  {canReply && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleReplyForm(post._id)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Reply
                      </button>
                      {replyFormVisible[post._id] && (
                        <form
                          onSubmit={(e) => handleReplySubmit(e, post._id)}
                          className="mt-2 space-y-2"
                        >
                          <textarea
                            value={replyText[post._id] || ""}
                            onChange={(e) =>
                              handleReplyChange(post._id, e.target.value)
                            }
                            placeholder="Write your reply..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          ></textarea>
                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Submit Reply
                          </button>
                        </form>
                      )}
                    </div>
                  )}
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
                className="bg-white p-4 rounded-lg shadow-sm border border-[#D43134C4]/20"
              >
                <div className="flex flex-row items-center gap-2">
                  {member.profilePic && (
                    <img
                      src={member.profilePic}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mb-2"
                    />
                  )}
                  <h4 className="font-medium text-[#484848]">{member.name}</h4>
                </div>

                {/* <p className="text-sm text-[#484848]">{member.year}</p>
                <p className="text-sm text-[#484848]">{member.major}</p> */}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Image */}
        <div className="w-full h-[400px] relative">
          <img
            src={college.profilePic}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* College Info */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#484848]">
                  {college.name}
                </h1>
                <p className="text-[#484848] mt-2">{college.location}</p>
              </div>
              <div className="flex gap-4">
                {isMember ? (
                  <button
                    disabled
                    className="bg-[#7B0F119E] text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  >
                    Joined
                  </button>
                ) : joinloading ? (
                  <button
                    disabled
                    className="bg-[#D43134C4] text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="bg-[#D43134C4] text-white px-6 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors"
                  >
                    Join
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="border border-[#D43134C4] text-[#D43134C4] px-6 py-2 rounded-lg hover:bg-[#D43134C4] hover:text-white transition-colors"
                >
                  {isCopied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* New: Create Post Button and Form */}
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
                  <input
                    type="text"
                    value={postMedia}
                    onChange={(e) => setPostMedia(e.target.value)}
                    placeholder="Media URL (optional)"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-[#D43134C4]/20">
              <div className="flex space-x-8">
                {["description", "comments", "members"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 capitalize ${
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

            {/* Tab Content */}
            <div className="mt-8">{renderTabContent()}</div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Replies Drawer */}
      {openDrawerPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-4 relative">
            <button
              onClick={() => setOpenDrawerPost(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>

            {/* Display the selected post details */}
            {selectedPost && (
              <div className="mb-4 border-b pb-4">
                <h3 className="text-xl mb-2 font-semibold">Post Details</h3>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center gap-2">
                    {selectedPost.author.profilePic && (
                      <img
                        src={selectedPost.author.profilePic || "/user-icon.svg"}
                        alt={selectedPost.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <h4 className="font-medium text-[#484848]">
                      {selectedPost.author.name}
                    </h4>
                  </div>
                  <p className="text-sm text-[#484848] mt-2">
                    {selectedPost.content}
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-xl mb-4 font-semibold">Replies</h3>
            {repliesByPost[openDrawerPost] &&
            repliesByPost[openDrawerPost].length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {repliesByPost[openDrawerPost].map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-gray-100 p-2 rounded border"
                  >
                    <div className="flex flex-row items-center gap-2">
                      {reply.author.profilePic && (
                        <img
                          src={reply.author.profilePic || "/user-icon.svg"}
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <h4 className="font-light text-[#484848]">
                        {reply.author.name}
                      </h4>
                    </div>
                    <p className="text-sm text-[#484848]">{reply.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No replies available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeProfile;
