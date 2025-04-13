import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GetApiCall, PutApiCall } from "../utils/apiCall";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHistory } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const RECENTLY_UPDATED_KEY = "recentlyUpdatedColleges";

const UpdateCollege = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingColleges, setFetchingColleges] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyUpdated, setRecentlyUpdated] = useState([]);
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

  // Load recently updated colleges from localStorage
  useEffect(() => {
    const savedColleges = localStorage.getItem(RECENTLY_UPDATED_KEY);
    if (savedColleges) {
      try {
        setRecentlyUpdated(JSON.parse(savedColleges));
      } catch (error) {
        console.error("Error parsing recently updated colleges:", error);
        localStorage.removeItem(RECENTLY_UPDATED_KEY);
      }
    }
  }, []);

  // Fetch all colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      setFetchingColleges(true);
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        if (data.success) {
          setColleges(data.colleges);
        } else {
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error("An error occurred while fetching colleges");
      } finally {
        setFetchingColleges(false);
      }
    };

    fetchColleges();
  }, []);

  // Fetch selected college details when a college is selected
  useEffect(() => {
    if (selectedCollegeId) {
      const fetchCollegeDetails = async () => {
        setLoading(true);
        try {
          const data = await GetApiCall(
            `${backendUrl}/api/college/${selectedCollegeId}`
          );
          if (data.success && data.college) {
            const college = data.college;
            setFormData({
              name: college.name || "",
              profilePic: college.profilePic || "",
              location: college.location || "",
              description: college.description || "",
              domain: college.domain ? college.domain.join(", ") : "",
              emailDomains: college.emailDomains
                ? college.emailDomains.join(", ")
                : "",
              founded: college.facts?.founded || "",
              totalStudents: college.facts?.totalStudents || "",
              type: college.facts?.type || "",
              safetyRating: college.metrics?.safety?.rating || 0,
              safetyDescription: college.metrics?.safety?.description || "",
              healthcareRating: college.metrics?.healthcare?.rating || 0,
              healthcareDescription:
                college.metrics?.healthcare?.description || "",
              qualityOfTeachingRating:
                college.metrics?.qualityOfTeaching?.rating || 0,
              qualityOfTeachingDescription:
                college.metrics?.qualityOfTeaching?.description || "",
              campusCultureRating: college.metrics?.campusCulture?.rating || 0,
              campusCultureDescription:
                college.metrics?.campusCulture?.description || "",
              studentSupportRating:
                college.metrics?.studentSupport?.rating || 0,
              studentSupportDescription:
                college.metrics?.studentSupport?.description || "",
              affordabilityRating: college.metrics?.affordability?.rating || 0,
              affordabilityDescription:
                college.metrics?.affordability?.description || "",
              placementsRating: college.metrics?.placements?.rating || 0,
              placementsDescription:
                college.metrics?.placements?.description || "",
            });
          } else {
            toast.error("Failed to fetch college details");
          }
        } catch (error) {
          console.error("Error fetching college details:", error);
          toast.error("An error occurred while fetching college details");
        } finally {
          setLoading(false);
        }
      };

      fetchCollegeDetails();
    }
  }, [selectedCollegeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update recently updated colleges list
  const updateRecentlyUpdated = (collegeId, collegeName) => {
    const updatedCollege = {
      id: collegeId,
      name: collegeName,
      updatedAt: new Date().toISOString(),
    };

    // Get current list and remove the college if it already exists
    const currentList = [...recentlyUpdated];
    const filteredList = currentList.filter(
      (college) => college.id !== collegeId
    );

    // Add the college to the beginning of the list
    const newList = [updatedCollege, ...filteredList.slice(0, 4)]; // Keep only the 5 most recent

    setRecentlyUpdated(newList);
    localStorage.setItem(RECENTLY_UPDATED_KEY, JSON.stringify(newList));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollegeId) {
      toast.error("Please select a college to update");
      return;
    }

    // Validate required field
    if (!formData.name) {
      toast.error("College name is required");
      return;
    }

    // Build payload
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
      setLoading(true);
      const data = await PutApiCall(
        `${backendUrl}/api/college/${selectedCollegeId}`,
        payload
      );
      if (data.success) {
        toast.success("College updated successfully");
        updateRecentlyUpdated(selectedCollegeId, formData.name);
      } else {
        console.error("Failed to update college:", data.message);
        toast.error(data.message || "Failed to update college");
      }
    } catch (error) {
      console.error("Error updating college:", error);
      toast.error(error.response?.data?.error || "Failed to update college");
    } finally {
      setLoading(false);
    }
  };

  // Filter colleges based on search query
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-[#484848] mb-8 text-center">
            Update College Information
          </h1>

          {/* Recently Updated Colleges Section */}
          {recentlyUpdated.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-4">
                <FaHistory className="text-[#D43134C4] mr-2" />
                <h2 className="text-xl font-semibold text-[#484848]">
                  Recently Updated
                </h2>
              </div>
              <div className="space-y-2">
                {recentlyUpdated.map((college) => (
                  <div
                    key={college.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCollegeId(college.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          selectedCollegeId === college.id
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="font-medium">{college.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(college.updatedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* College Selection with Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <label
              htmlFor="collegeSearch"
              className="block text-[#484848] font-semibold mb-2"
            >
              Select College to Update
            </label>

            {fetchingColleges ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D43134C4]"></div>
              </div>
            ) : (
              <>
                {/* Search Input */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="collegeSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search colleges..."
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                  />
                </div>

                {/* Dropdown */}
                <select
                  id="collegeSelect"
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                >
                  <option value="">-- Select a College --</option>
                  {filteredColleges.map((college) => (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  ))}
                </select>

                {filteredColleges.length === 0 && searchQuery && (
                  <p className="mt-2 text-sm text-red-500">
                    No colleges match your search query.
                  </p>
                )}
              </>
            )}
          </div>

          {selectedCollegeId && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D43134C4]"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[#484848] font-semibold mb-2"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profilePic"
                        className="block text-[#484848] font-semibold mb-2"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                      />
                      {formData.profilePic && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Preview:</p>
                          <img
                            src={formData.profilePic}
                            alt="College Preview"
                            className="h-32 w-auto object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-[#484848] font-semibold mb-2"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-[#484848] font-semibold mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a brief description"
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="domain"
                        className="block text-[#484848] font-semibold mb-2"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="emailDomains"
                        className="block text-[#484848] font-semibold mb-2"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter domains that belong to this college. Students must
                        use these email domains to verify their affiliation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="founded"
                          className="block text-[#484848] font-semibold mb-2"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="totalStudents"
                          className="block text-[#484848] font-semibold mb-2"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="type"
                          className="block text-[#484848] font-semibold mb-2"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* College Metrics Section */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <h2 className="text-xl font-semibold text-[#484848] mb-4">
                        College Metrics
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        Rate each metric on a scale of 1-5 (1 being the lowest,
                        5 being the highest)
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="safetyRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Safety Rating
                          </label>
                          <select
                            name="safetyRating"
                            id="safetyRating"
                            value={formData.safetyRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="safetyDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Safety Description
                          </label>
                          <textarea
                            name="safetyDescription"
                            id="safetyDescription"
                            value={formData.safetyDescription}
                            onChange={handleChange}
                            placeholder="Enter safety description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="healthcareRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Healthcare Rating
                          </label>
                          <select
                            name="healthcareRating"
                            id="healthcareRating"
                            value={formData.healthcareRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="healthcareDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Healthcare Description
                          </label>
                          <textarea
                            name="healthcareDescription"
                            id="healthcareDescription"
                            value={formData.healthcareDescription}
                            onChange={handleChange}
                            placeholder="Enter healthcare description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="qualityOfTeachingRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Quality of Teaching Rating
                          </label>
                          <select
                            name="qualityOfTeachingRating"
                            id="qualityOfTeachingRating"
                            value={formData.qualityOfTeachingRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="qualityOfTeachingDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Quality of Teaching Description
                          </label>
                          <textarea
                            name="qualityOfTeachingDescription"
                            id="qualityOfTeachingDescription"
                            value={formData.qualityOfTeachingDescription}
                            onChange={handleChange}
                            placeholder="Enter quality of teaching description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="campusCultureRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Campus Culture Rating
                          </label>
                          <select
                            name="campusCultureRating"
                            id="campusCultureRating"
                            value={formData.campusCultureRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="campusCultureDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Campus Culture Description
                          </label>
                          <textarea
                            name="campusCultureDescription"
                            id="campusCultureDescription"
                            value={formData.campusCultureDescription}
                            onChange={handleChange}
                            placeholder="Enter campus culture description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="studentSupportRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Student Support Rating
                          </label>
                          <select
                            name="studentSupportRating"
                            id="studentSupportRating"
                            value={formData.studentSupportRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="studentSupportDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Student Support Description
                          </label>
                          <textarea
                            name="studentSupportDescription"
                            id="studentSupportDescription"
                            value={formData.studentSupportDescription}
                            onChange={handleChange}
                            placeholder="Enter student support description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="affordabilityRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Affordability Rating
                          </label>
                          <select
                            name="affordabilityRating"
                            id="affordabilityRating"
                            value={formData.affordabilityRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="affordabilityDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Affordability Description
                          </label>
                          <textarea
                            name="affordabilityDescription"
                            id="affordabilityDescription"
                            value={formData.affordabilityDescription}
                            onChange={handleChange}
                            placeholder="Enter affordability description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="placementsRating"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Placements Rating
                          </label>
                          <select
                            name="placementsRating"
                            id="placementsRating"
                            value={formData.placementsRating}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
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
                            htmlFor="placementsDescription"
                            className="block text-[#484848] font-semibold mb-2"
                          >
                            Placements Description
                          </label>
                          <textarea
                            name="placementsDescription"
                            id="placementsDescription"
                            value={formData.placementsDescription}
                            onChange={handleChange}
                            placeholder="Enter placements description"
                            rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D43134C4] focus:border-transparent"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/college/${selectedCollegeId}`)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-[#D43134C4] to-[#7B0F119E] text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Update College"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateCollege;
