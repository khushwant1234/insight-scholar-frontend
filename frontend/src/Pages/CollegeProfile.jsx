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
  const [postMedia, setPostMedia] = useState([]);
  const [currentMediaInput, setCurrentMediaInput] = useState("");
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

  // Add state for managing anonymity of replies
  const [replyIsAnonymous, setReplyIsAnonymous] = useState({});

  useEffect(() => {
    // Only fetch user data if there's no user in context already
    const fetchUserData = async () => {
      if (!user || !user._id) {
        // Only fetch if user data is missing
        try {
          const response = await PostApiCall(`${backendUrl}/api/user/profile`);
          if (response.success) {
            const { success, ...userData } = response;
            setUser(userData);
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          // Don't show toast error here
        }
      }
    };

    // Only run if we need user data
    if (!user || !user._id) {
      fetchUserData();
    }
  }, [user, setUser]);

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
        media: postMedia,
        isAnonymous: isAnonymous,
      });

      if (data.success) {
        toast.success("Post created successfully");
        setPostContent("");
        setPostMedia([]);
        setCurrentMediaInput("");
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

    setPostMedia([...postMedia, currentMediaInput.trim()]);
    setCurrentMediaInput("");
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

  // Add a new function for handling anonymous toggle for replies
  const handleReplyAnonymousToggle = (postId) => {
    setReplyIsAnonymous((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
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
        isAnonymous: replyIsAnonymous[postId] || false, // Include the isAnonymous field
      });
      if (data.success || data.reply._id) {
        toast.success("Reply posted successfully");
      } else {
        toast.error("Failed to post reply");
      }
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
      setReplyIsAnonymous((prev) => ({ ...prev, [postId]: false }));
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    // Format: May 5, 2025 at 2:30 PM
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  if (loading) {
    return (
      <FadeWrapper>
        <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center">
          <Loading />
        </div>
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
                <h3 className="text-xl font-semibold text-[#062f2e]">
                  Overview
                </h3>
                <p className="text-[#062f2e]/80">{college.description}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#062f2e]">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#845c36]">
                      <b>Founded</b>
                    </p>
                    <p className="font-medium text-[#062f2e]">
                      {college.facts.founded}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#845c36]">
                      <b>Type</b>
                    </p>
                    <p className="font-medium text-[#062f2e]">
                      {college.facts.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#845c36]">
                      <b>Total Students</b>
                    </p>
                    <p className="font-medium text-[#062f2e]">
                      {college.facts.totalStudents}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-[#062f2e] mb-4">
                College Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries({
                  safety: "Campus Safety",
                  healthcare: "Healthcare Services",
                  qualityOfTeaching: "Teaching Quality",
                  campusCulture: "Campus Culture & Student Life",
                  studentSupport: "Student Support Services",
                  affordability: "Affordability & Financial Aid",
                  placements: "Career Services & Job Placements",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className="bg-white p-4 rounded-lg shadow-sm border border-[#a08961]/10"
                  >
                    <h4 className="font-medium text-[#062f2e] mb-2">{label}</h4>

                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = college.metrics[key]?.rating || 0;
                          const filled = Math.max(
                            0,
                            Math.min(1, rating - (star - 1))
                          );

                          return (
                            <div key={star} className="relative w-6 h-6 mr-1">
                              <svg
                                className="w-6 h-6 text-[#a08961]/30 absolute"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>

                              {filled > 0 && (
                                <div
                                  className="absolute overflow-hidden"
                                  style={{ width: `${filled * 100}%` }}
                                >
                                  <svg
                                    className="w-6 h-6 text-[#a08961]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-sm text-[#062f2e]/70">
                        {parseFloat(college.metrics[key]?.rating || 0).toFixed(
                          1
                        )}
                        /5.0
                      </span>
                    </div>

                    <p className="text-sm text-[#062f2e]/70">
                      {college.metrics[key]?.description ||
                        "No information provided."}
                    </p>
                  </div>
                ))}
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
                className="bg-[#062f2e] text-white px-4 py-2 rounded-lg hover:bg-[#845c36] transition-colors"
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
                    className="w-full p-2 border border-[#a08961]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a08961]"
                    rows="4"
                  ></textarea>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={currentMediaInput}
                      onChange={(e) => setCurrentMediaInput(e.target.value)}
                      placeholder="Enter media URL (image or video)"
                      className="flex-grow p-2 border border-[#a08961]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a08961]"
                    />
                    <button
                      type="button"
                      onClick={addMediaUrl}
                      className="bg-[#a08961] text-white p-2 rounded-md hover:bg-[#845c36]"
                    >
                      Add Media
                    </button>
                  </div>

                  {postMedia.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-[#062f2e] mb-2">
                        Added Media:
                      </p>
                      <ul className="space-y-2">
                        {postMedia.map((url, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-[#f5f3ee] p-2 rounded-md"
                          >
                            <span className="text-sm text-[#062f2e]/70 truncate max-w-xs">
                              {url}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMediaUrl(index)}
                              className="text-[#845c36] hover:text-[#062f2e]"
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
                      className="h-4 w-4 text-[#a08961] border-[#a08961]/30 rounded focus:ring-[#a08961]"
                    />
                    <label
                      htmlFor="anonymous-checkbox"
                      className="ml-2 text-sm text-[#062f2e]/70"
                    >
                      Post anonymously
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#062f2e] text-white px-4 py-2 rounded-lg hover:bg-[#845c36] transition-colors"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>

            {posts.map((post) => {
              // Use displayCreatedAt if available, otherwise fall back to createdAt
              const createdAt = formatDate(
                post.displayCreatedAt || post.createdAt
              );

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md border border-[#a08961]/10 p-4 mb-4"
                >
                  <div className="flex items-center mb-2">
                    {post.isAnonymous ? (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#f5f3ee] flex items-center justify-center text-[#062f2e]/50">
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
                          <p className="font-semibold text-[#062f2e]">
                            Anonymous User
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <img
                          src={post.author.profilePic || "/user-icon.svg"}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <div>
                          <p className="font-semibold text-[#062f2e]">
                            {post.author.name}
                          </p>
                        </div>
                      </div>
                    )}
                    <span className="text-sm text-[#062f2e]/50 ml-auto">
                      {formatDate(post.displayCreatedAt || post.createdAt)}
                    </span>
                  </div>

                  <p className="mb-2 text-[#062f2e]/80">{post.content}</p>

                  {post.media && post.media.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {post.media.map((mediaUrl, index) => {
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
                          <a
                            key={index}
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#f5f3ee] p-3 rounded-lg text-[#845c36] hover:bg-[#a08961]/10"
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

                  <div className="mt-4 pt-3 border-t border-[#a08961]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePostUpvote(post._id)}
                        className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
                          upvotedPosts[post._id]
                            ? "bg-[#a08961]/10 text-[#845c36]"
                            : "hover:bg-[#f5f3ee] text-[#062f2e]/60"
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
                        className="flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-[#f5f3ee] text-[#062f2e]/60"
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
                        className="text-sm text-[#845c36] hover:text-[#062f2e] font-medium"
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
                className="bg-white p-4 rounded-lg shadow-sm border border-[#a08961]/20 overflow-hidden"
              >
                <div className="flex flex-row items-center gap-2">
                  {member.profilePic && (
                    <img
                      src={member.profilePic}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mb-2"
                    />
                  )}
                  <h4 className="font-medium text-[#062f2e]">{member.name}</h4>
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
    <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#062f2e]/80"></div>
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
              <div className="bg-white rounded-lg shadow-sm border border-[#a08961]/10 p-4 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-[#062f2e]">
                    All Colleges
                  </h2>
                  <Link
                    to="/colleges"
                    className="text-[#845c36] text-sm hover:text-[#062f2e] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {collegesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a08961]"></div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {allColleges.map((col) => (
                      <Link
                        key={col._id}
                        to={`/college/${col._id}`}
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          col._id === college._id
                            ? "bg-[#a08961]/10 border-l-4 border-[#a08961]"
                            : "hover:bg-[#f5f3ee]"
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
                          <h3 className="font-medium text-[#062f2e] text-sm">
                            {col.name}
                          </h3>
                          <p className="text-[#062f2e]/60 text-xs">
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
              <div className="bg-white rounded-lg shadow-sm border border-[#a08961]/10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#a08961]/10 text-[#845c36] px-3 py-1 rounded-full text-sm font-medium">
                      {college.facts.type}
                    </span>
                    <span className="bg-[#f5f3ee] text-[#062f2e]/80 px-3 py-1 rounded-full text-sm">
                      Founded: {college.facts.founded}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {isMember ? (
                      <button
                        disabled
                        className="bg-[#845c36] text-white px-4 py-2 rounded-md cursor-not-allowed text-sm flex-1 sm:flex-none"
                      >
                        Joined
                      </button>
                    ) : joinloading ? (
                      <button
                        disabled
                        className="bg-[#062f2e]/70 text-white px-4 py-2 rounded-md cursor-not-allowed text-sm flex-1 sm:flex-none"
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
                        className="bg-[#062f2e] text-white px-4 py-2 rounded-md hover:bg-[#845c36] transition-colors text-sm flex-1 sm:flex-none"
                      >
                        Join College
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="border border-[#062f2e] text-[#062f2e] px-4 py-2 rounded-md hover:bg-[#062f2e]/5 transition-colors text-sm flex-1 sm:flex-none"
                    >
                      {isCopied ? "Link Copied!" : "Share"}
                    </button>
                  </div>
                </div>

                <div className="border-b border-[#a08961]/20 mb-6 overflow-x-auto">
                  <div className="flex space-x-6 min-w-max pb-1">
                    {["description", "discussion", "members"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                          activeTab === tab
                            ? "border-b-2 border-[#062f2e] text-[#062f2e]"
                            : "text-[#062f2e]/60 hover:text-[#062f2e]"
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
              <div className="bg-white rounded-lg shadow-sm border border-[#a08961]/10 p-4 sticky top-4">
                <h2 className="text-lg font-semibold text-[#062f2e] mb-4">
                  Student Mentors
                </h2>

                {mentorsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a08961]"></div>
                  </div>
                ) : mentors.length > 0 ? (
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <div
                        key={mentor._id}
                        className="flex items-start p-3 bg-[#f5f3ee] rounded-lg"
                      >
                        <img
                          src={
                            mentor.profilePic ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                          }
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full border-2 border-[#a08961]/20 mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-[#062f2e]">
                            {mentor.name}
                          </h3>
                          <p className="text-[#062f2e]/70 text-sm">
                            {mentor.major}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="bg-[#a08961]/10 text-[#845c36] px-2 py-0.5 rounded text-xs">
                              {mentor.karma} karma
                            </span>
                            {mentor.isMentor && (
                              <span className="bg-[#062f2e]/10 text-[#062f2e] px-2 py-0.5 rounded text-xs">
                                Mentor
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/mentor/${mentor._id}`}
                            className="text-[#845c36] text-xs hover:underline inline-block mt-1"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-[#f5f3ee] rounded-lg">
                    <p className="text-[#062f2e]/70 mb-2">
                      No mentors available yet
                    </p>
                    <p className="text-sm text-[#062f2e]/50">
                      Students with 500+ karma points become mentors
                    </p>
                  </div>
                )}

                <div className="mt-6 p-3 bg-[#f5f3ee] rounded-lg">
                  <h3 className="font-medium text-[#062f2e] mb-2">
                    Community Stats
                  </h3>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#845c36]">
                        {college.members?.length || 0}
                      </p>
                      <p className="text-xs text-[#062f2e]/50">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#845c36]">
                        {posts.length}
                      </p>
                      <p className="text-xs text-[#062f2e]/50">Discussions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#845c36]">
                        {mentors.length}
                      </p>
                      <p className="text-xs text-[#062f2e]/50">Mentors</p>
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
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative max-h-[80vh] overflow-y-auto border border-[#a08961]/20 shadow-xl">
            <button
              onClick={() => setOpenDrawerPost(null)}
              className="absolute top-4 right-4 text-[#062f2e]/50 hover:text-[#062f2e]"
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
              <div className="mb-6 border-b border-[#a08961]/20 pb-4">
                <h3 className="text-xl mb-3 font-semibold text-[#062f2e]">
                  Post
                </h3>
                <div className="bg-[#f5f3ee] p-4 rounded-lg border border-[#a08961]/10">
                  <div className="flex items-center gap-3 mb-2">
                    {selectedPost.isAnonymous ? (
                      <div className="w-10 h-10 rounded-full bg-[#a08961]/20 flex items-center justify-center text-[#845c36]">
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
                      <h4 className="font-medium text-[#062f2e]">
                        {selectedPost.isAnonymous
                          ? "Anonymous User"
                          : selectedPost.author.name}
                      </h4>
                      <p className="text-xs text-[#062f2e]/50">
                        {formatDate(
                          selectedPost.displayCreatedAt ||
                            selectedPost.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#062f2e]/80 mb-3">
                    {selectedPost.content}
                  </p>

                  {selectedPost.media && selectedPost.media.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {selectedPost.media.map((mediaUrl, index) => {
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
                          <a
                            key={index}
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white p-3 rounded-lg text-[#845c36] hover:bg-[#a08961]/10 border border-[#a08961]/10"
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

            <h3 className="text-xl mb-4 font-semibold text-[#062f2e]">
              Replies ({repliesByPost[openDrawerPost]?.length || 0})
            </h3>

            {repliesByPost[openDrawerPost] &&
            repliesByPost[openDrawerPost].length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {repliesByPost[openDrawerPost].map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-[#f5f3ee] p-3 rounded-lg border border-[#a08961]/10"
                  >
                    <div className="flex justify-between items-start">
                      {/* Display anonymous user if isAnonymous is true */}
                      <h4 className="font-medium text-[#062f2e] text-sm">
                        {reply.isAnonymous
                          ? "Anonymous User"
                          : reply.author.name}
                      </h4>
                      <span className="text-xs text-[#062f2e]/50">
                        {formatDate(reply.displayCreatedAt || reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#062f2e]/80 mt-1">
                      {reply.content}
                    </p>
                    {/* Display media if any */}
                    {reply.media && reply.media.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {reply.media.map((mediaUrl, index) => {
                          const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(
                            mediaUrl
                          );

                          return isImage ? (
                            <img
                              key={index}
                              src={mediaUrl}
                              alt="Reply media"
                              className="rounded-lg max-w-full h-auto max-h-96"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/400x300?text=Image+Not+Available";
                              }}
                            />
                          ) : (
                            <a
                              key={index}
                              href={mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-white p-3 rounded-lg text-[#845c36] hover:bg-[#a08961]/10 border border-[#a08961]/10"
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
                ))}
              </div>
            ) : (
              <div className="bg-[#f5f3ee] p-4 rounded-lg text-center border border-[#a08961]/10">
                <p className="text-[#062f2e]/70">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            )}

            {canReply && (
              <form
                onSubmit={(e) => handleReplySubmit(e, openDrawerPost)}
                className="mt-4 border-t border-[#a08961]/20 pt-4"
              >
                <textarea
                  value={replyText[openDrawerPost] || ""}
                  onChange={(e) =>
                    handleReplyChange(openDrawerPost, e.target.value)
                  }
                  placeholder="Write your reply..."
                  className="w-full p-3 border border-[#a08961]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a08961]"
                  rows="3"
                ></textarea>

                {/* Add anonymous checkbox */}
                <div className="flex items-center mt-2">
                  <input
                    id={`drawer-reply-anonymous-checkbox`}
                    type="checkbox"
                    checked={replyIsAnonymous[openDrawerPost] || false}
                    onChange={() => handleReplyAnonymousToggle(openDrawerPost)}
                    className="h-4 w-4 text-[#a08961] border-[#a08961]/30 rounded focus:ring-[#a08961]"
                  />
                  <label
                    htmlFor={`drawer-reply-anonymous-checkbox`}
                    className="ml-2 text-sm text-[#062f2e]/70"
                  >
                    Reply anonymously
                  </label>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => setOpenDrawerPost(null)}
                    className="bg-gray-200 text-[#062f2e] px-4 py-2 rounded mr-2 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#062f2e] text-white px-4 py-2 rounded hover:bg-[#845c36] transition-colors"
                  >
                    Submit Reply
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeProfile;
