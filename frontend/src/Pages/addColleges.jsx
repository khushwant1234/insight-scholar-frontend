import React, { useState } from "react";
import { toast } from "react-toastify";
import { PostApiCall } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddColleges = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    profilePic: "",
    location: "",
    description: "",
    domain: "", // New field for domains (comma-separated)
    founded: "",
    totalStudents: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate required field
    if (!formData.name) {
      toast.error("College name is required");
      return;
    }

    // Build payload to match your College schema.
    const payload = {
      name: formData.name,
      profilePic: formData.profilePic,
      location: formData.location,
      description: formData.description,
      domain: formData.domain
        ? formData.domain.split(",").map((item) => item.trim())
        : [],
      facts: {
        founded: formData.founded ? Number(formData.founded) : undefined,
        totalStudents: formData.totalStudents
          ? Number(formData.totalStudents)
          : undefined,
        type: formData.type,
      },
    };

    console.log(payload);
    try {
      // Replace with your correct endpoint if needed
      const data = await PostApiCall(`${backendUrl}/api/college`, payload);
      if (data.success) {
        toast.success("College added successfully");
        // navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "Failed to add college");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Add New College
        </h1>
        <form
          className="w-full max-w-lg bg-white p-8 rounded shadow"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              College Name*
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter college name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="profilePic"
              className="block text-gray-700 font-bold mb-2"
            >
              Profile Picture URL
            </label>
            <input
              type="text"
              name="profilePic"
              id="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              rows="3"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            ></textarea>
          </div>

          {/* New input section for domain */}
          <div className="mb-4">
            <label
              htmlFor="domain"
              className="block text-gray-700 font-bold mb-2"
            >
              Domain (Comma-separated)
            </label>
            <input
              type="text"
              name="domain"
              id="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="e.g., Engineering, Science, Arts"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="founded"
                className="block text-gray-700 font-bold mb-2"
              >
                Founded
              </label>
              <input
                type="number"
                name="founded"
                id="founded"
                value={formData.founded}
                onChange={handleChange}
                placeholder="Year"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="totalStudents"
                className="block text-gray-700 font-bold mb-2"
              >
                Total Students
              </label>
              <input
                type="number"
                name="totalStudents"
                id="totalStudents"
                value={formData.totalStudents}
                onChange={handleChange}
                placeholder="Number"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-gray-700 font-bold mb-2"
              >
                Type
              </label>
              <input
                type="text"
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Public/Private"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add College
          </button>
        </form>
      </div>
    </>
  );
};

export default AddColleges;
