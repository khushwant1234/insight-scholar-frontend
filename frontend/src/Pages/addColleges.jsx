import React, { useState } from "react";
import { toast } from "react-toastify";
import { PostApiCall } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Descriptive labels for metrics
const metricLabels = {
  safety: "Campus Safety",
  healthcare: "Healthcare Services",
  qualityOfTeaching: "Teaching Quality",
  campusCulture: "Campus Culture & Student Life",
  studentSupport: "Student Support Services",
  affordability: "Affordability & Financial Aid",
  placements: "Career Services & Job Placements",
};

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
    // Metrics with both rating and description
    safetyRating: 0,
    safetyDescription: "",
    healthcareRating: 0,
    healthcareDescription: "",
    qualityOfTeachingRating: 0,
    qualityOfTeachingDescription: "",
    campusCultureRating: 0,
    campusCultureDescription: "",
    studentSupportRating: 0,
    studentSupportDescription: "",
    affordabilityRating: 0,
    affordabilityDescription: "",
    placementsRating: 0,
    placementsDescription: "",
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

    // Build payload to match your College schema
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
        safety: {
          rating: formData.safetyRating ? Number(formData.safetyRating) : 0,
          description: formData.safetyDescription || "",
        },
        healthcare: {
          rating: formData.healthcareRating
            ? Number(formData.healthcareRating)
            : 0,
          description: formData.healthcareDescription || "",
        },
        qualityOfTeaching: {
          rating: formData.qualityOfTeachingRating
            ? Number(formData.qualityOfTeachingRating)
            : 0,
          description: formData.qualityOfTeachingDescription || "",
        },
        campusCulture: {
          rating: formData.campusCultureRating
            ? Number(formData.campusCultureRating)
            : 0,
          description: formData.campusCultureDescription || "",
        },
        studentSupport: {
          rating: formData.studentSupportRating
            ? Number(formData.studentSupportRating)
            : 0,
          description: formData.studentSupportDescription || "",
        },
        affordability: {
          rating: formData.affordabilityRating
            ? Number(formData.affordabilityRating)
            : 0,
          description: formData.affordabilityDescription || "",
        },
        placements: {
          rating: formData.placementsRating
            ? Number(formData.placementsRating)
            : 0,
          description: formData.placementsDescription || "",
        },
      },
    };

    try {
      const data = await PostApiCall(
        `${backendUrl}/api/college/createCollege`,
        payload
      );
      if (data.success) {
        toast.success("College added successfully");
        navigate("/colleges");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to add college");
    }
  };

  // Helper function to render metric fields
  const renderMetricFields = (metricName) => {
    const ratingName = `${metricName}Rating`;
    const descriptionName = `${metricName}Description`;

    return (
      <div className="mb-6 border p-4 rounded-lg bg-gray-50">
        <h3 className="font-bold text-gray-700 mb-3">
          {metricLabels[metricName]}
        </h3>

        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-2">
            Rating (0-5)
          </label>
          <div className="flex items-center">
            <input
              type="number"
              name={ratingName}
              id={ratingName}
              value={formData[ratingName]}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-24 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="ml-2 text-sm text-gray-500">
              (0 = Not Available, 5 = Excellent)
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name={descriptionName}
            value={formData[descriptionName]}
            onChange={handleChange}
            placeholder={`Describe the ${metricLabels[
              metricName
            ].toLowerCase()} at this college...`}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            rows="3"
          ></textarea>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Add New College
        </h1>
        <form
          className="w-full max-w-3xl bg-white p-8 rounded shadow"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b">
              Basic Information
            </h2>

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
                Enter domains that belong to this college. Students must use
                these email domains to verify their affiliation.
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
          </div>

          <div className="mb-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b">
              College Metrics
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Rate each aspect of the college on a scale of 0-5 (0 = not
              available, 1 = poor, 5 = excellent) and provide a descriptive text
              for each metric.
            </p>

            {renderMetricFields("safety")}
            {renderMetricFields("healthcare")}
            {renderMetricFields("qualityOfTeaching")}
            {renderMetricFields("campusCulture")}
            {renderMetricFields("studentSupport")}
            {renderMetricFields("affordability")}
            {renderMetricFields("placements")}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/colleges")}
              className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add College
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddColleges;
