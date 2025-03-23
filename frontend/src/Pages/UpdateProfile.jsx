import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { PutApiCall, GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define your available college options
const collegeOptions = ["Shiv Nadar University", "IIT Delhi", "IIT Bombay"];

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

  useEffect(() => {
    setLoading(true);
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        // Assuming API returns an object with a 'colleges' array or the array directly
        // console.log(data.colleges);
        // console.log(data.success);
        if (data.success && data.colleges) {
          // console.log("inside if in getColleges");
          // setColleges(data.colleges);
          setCollegeOptions(data.colleges); // Set fetched colleges in local state
        } else {
          // console.log("error in else");
          // console.log(data);
          toast.error("Failed to fetch colleges ");
        }
      } catch (error) {
        // console.log("error in catch");
        console.log(error);
        toast.error("Failed to fetch colleges abc");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [setColleges]);

  useEffect(() => {
    setLoading(true);
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
  }, []);

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
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert the interests field (comma separated string) into an array.
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen flex flex-col bg-[#D9D9D9]">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <h1 className="text-3xl font-bold text-[#484848] mb-6 text-center">
            Update Profile
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-4"
          >
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">College</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">LinkedIn</label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/..."
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">
                Profile Picture URL
              </label>
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#484848] font-medium">
                Interests (Seperated with comma ,)
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g., programming, music, sports"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D43134C4]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D43134C4] text-white py-3 rounded-lg hover:bg-[#7B0F119E] transition-colors"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default UpdateProfile;
