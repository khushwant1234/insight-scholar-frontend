import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { PutApiCall, GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateProfile = () => {
  const { user, setUser, setColleges } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    major: "",
    year: "",
    linkedIn: "",
    profilePic: "",
    interests: "",
  });
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch colleges
        const collegesData = await GetApiCall(
          `${backendUrl}/api/college/allColleges`
        );
        if (collegesData.success && collegesData.colleges) {
          setCollegeOptions(collegesData.colleges);
        } else {
          toast.error("Failed to fetch colleges");
        }

        // Fetch user data
        const userData = await PostApiCall(`${backendUrl}/api/user/profile`);
        if (userData.success) {
          const { success, ...userInfo } = userData;
          setUser(userInfo);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setColleges, setUser]);

  // Pre-fill form with user info
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        major: user.major || "",
        year: user.year || "",
        linkedIn: user.linkedIn || "",
        profilePic: user.profilePic || "",
        interests: user.interests ? user.interests.join(", ") : "",
      });

      if (user.profilePic) {
        setPreviewImage(user.profilePic);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update preview when profile pic URL changes
    if (name === "profilePic") {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        interests: formData.interests
          .split(",")
          .map((interest) => interest.trim())
          .filter((interest) => interest),
      };

      const data = await PutApiCall(
        `${backendUrl}/api/user/profile`,
        updatedData
      );
      if (data.success) {
        const { success, ...userData } = data;
        setUser(userData);
        toast.success("Profile updated successfully");
        navigate(`/user/${data._id}`);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D9D9D9]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-b-indigo-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white">
                  Edit Your Profile
                </h1>
                <p className="text-indigo-100 mt-1">
                  Update your information and customize your profile
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Profile Picture */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">
                          Profile Picture
                        </h2>
                        <div className="mb-4 flex justify-center">
                          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                                onError={() => setPreviewImage("")}
                              />
                            ) : (
                              <svg
                                className="w-20 h-20 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          Paste an image URL or use a hosting service like Imgur
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            placeholder="https://example.com/yourimage.jpg"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Profile Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Section */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800 mb-4">
                        Basic Information
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            College
                          </label>
                          <select
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select College</option>
                            <option value="notInCollege">Not in College</option>
                            {collegeOptions.map((college) => (
                              <option key={college._id} value={college._id}>
                                {college.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {formData.college &&
                          formData.college !== "notInCollege" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Major
                                </label>
                                <input
                                  type="text"
                                  name="major"
                                  value={formData.major}
                                  onChange={handleChange}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Graduation Year
                                </label>
                                <input
                                  type="text"
                                  name="year"
                                  value={formData.year}
                                  onChange={handleChange}
                                  placeholder="e.g., 2025"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800 mb-4">
                        Additional Information
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn Profile
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </div>
                            <input
                              type="url"
                              name="linkedIn"
                              value={formData.linkedIn}
                              onChange={handleChange}
                              placeholder="https://linkedin.com/in/your-profile"
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Interests
                          </label>
                          <textarea
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="Separate interests with commas (e.g., Programming, Music, Travel)"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          ></textarea>
                          <p className="mt-1 text-sm text-gray-500">
                            These will help connect you with like-minded users
                            and relevant content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving Changes
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default UpdateProfile;
