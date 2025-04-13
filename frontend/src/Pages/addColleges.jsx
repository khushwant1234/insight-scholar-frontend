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
    domain: "",
    emailDomains: "",
    founded: "",
    totalStudents: "",
    type: "",
    safety: "",
    healthcare: "",
    qualityOfTeaching: "",
    campusCulture: "",
    studentSupport: "",
    affordability: "",
    placements: "",
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
      emailDomains: formData.emailDomains
        ? formData.emailDomains.split(",").map((item) => item.trim())
        : [],
      facts: {
        founded: formData.founded ? Number(formData.founded) : undefined,
        totalStudents: formData.totalStudents
          ? Number(formData.totalStudents)
          : undefined,
        type: formData.type,
      },
      metrics: {
        safety: formData.safety ? Number(formData.safety) : undefined,
        healthcare: formData.healthcare
          ? Number(formData.healthcare)
          : undefined,
        qualityOfTeaching: formData.qualityOfTeaching
          ? Number(formData.qualityOfTeaching)
          : undefined,
        campusCulture: formData.campusCulture
          ? Number(formData.campusCulture)
          : undefined,
        studentSupport: formData.studentSupport
          ? Number(formData.studentSupport)
          : undefined,
        affordability: formData.affordability
          ? Number(formData.affordability)
          : undefined,
        placements: formData.placements
          ? Number(formData.placements)
          : undefined,
      },
    };

    try {
      // Replace with your correct endpoint if needed
      const data = await PostApiCall(
        `${backendUrl}/api/college/createCollege`,
        payload
      );
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

          <div className="mb-4">
            <label
              htmlFor="emailDomains"
              className="block text-gray-700 font-bold mb-2"
            >
              Email Domains (Comma-separated)
            </label>
            <input
              type="text"
              name="emailDomains"
              id="emailDomains"
              value={formData.emailDomains}
              onChange={handleChange}
              placeholder="e.g., harvard.edu, g.harvard.edu"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter domains that belong to this college. Students must use these
              email domains to verify their affiliation.
            </p>
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

          <div className="mb-6 mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
              College Metrics
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Rate each metric on a scale of 1-5 (1 being the lowest, 5 being
              the highest)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="safety"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Safety
                </label>
                <select
                  name="safety"
                  id="safety"
                  value={formData.safety}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="healthcare"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Healthcare
                </label>
                <select
                  name="healthcare"
                  id="healthcare"
                  value={formData.healthcare}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="qualityOfTeaching"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Quality of Teaching
                </label>
                <select
                  name="qualityOfTeaching"
                  id="qualityOfTeaching"
                  value={formData.qualityOfTeaching}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="campusCulture"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Campus Culture
                </label>
                <select
                  name="campusCulture"
                  id="campusCulture"
                  value={formData.campusCulture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="studentSupport"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Student Support
                </label>
                <select
                  name="studentSupport"
                  id="studentSupport"
                  value={formData.studentSupport}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="affordability"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Affordability
                </label>
                <select
                  name="affordability"
                  id="affordability"
                  value={formData.affordability}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="placements"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Placements
                </label>
                <select
                  name="placements"
                  id="placements"
                  value={formData.placements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
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
