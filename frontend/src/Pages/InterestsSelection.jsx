import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PutApiCall } from "../utils/apiCall";
import { UserContext } from "../context/userContext";
import FadeWrapper from "../Components/fadeIn";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Comprehensive categorized interests
const interestCategories = [
  {
    category: "Engineering & Technology",
    icon: "💻",
    interests: [
      "Computer Science & Engineering (CSE)",
      "Information Technology (IT)",
      "Mechanical Engineering",
      "Electronics & Communication Engineering (ECE)",
      "Artificial Intelligence & Machine Learning",
      "Data Science & Big Data Analytics",
    ],
  },
  {
    category: "Medical & Health Sciences",
    icon: "🧬",
    interests: [
      "MBBS",
      "Dental Surgery",
      "Pharmacy",
      "Nursing",
      "Physiotherapy",
    ],
  },
  {
    category: "Business & Management",
    icon: "📊",
    interests: [
      "MBA",
      "BBA",
      "Finance & Investment Banking",
      "Marketing Management",
      "Entrepreneurship & Startups",
      "BMS",
    ],
  },
  {
    category: "Law & Government Studies",
    icon: "⚖️",
    interests: ["Bachelor of Law (LLB)", "Integrated Law (BA LLB)"],
  },
  {
    category: "Commerce & Finance",
    icon: "💼",
    interests: [
      "Commerce (B.Com)",
      "Chartered Accountancy (CA)",
      "Company Secretary (CS)",
    ],
  },
  {
    category: "Science & Research",
    icon: "🔬",
    interests: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Microbiology & Biotechnology",
    ],
  },
  {
    category: "Computer & IT",
    icon: "🖥️",
    interests: ["Software Development", "Cybersecurity", "Cloud Computing"],
  },
  {
    category: "Design & Creativity",
    icon: "🎨",
    interests: ["Fashion Designing", "Graphic Designing", "Animation & VFX"],
  },
];

// Flatten the interests for the selection logic
const allInterests = interestCategories.flatMap((cat) => cat.interests);

const InterestsSelection = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState(null);

  // Initialize active category on component mount
  useEffect(() => {
    if (interestCategories.length > 0) {
      setActiveCategory(interestCategories[0].category);
    }
  }, []);

  const handleCardClick = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    try {
      const data = await PutApiCall(`${backendUrl}/api/user/profile`, {
        interests: selected,
      });
      if (data.success) {
        // Interests updated successfully, navigate to home
        const { success, ...userData } = data;
        setUser(userData);
        navigate("/");
      } else {
        console.error("Failed to update interests:", data.error);
      }
    } catch (error) {
      console.error("Error updating interests:", error);
    }
  };

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">
              Personalize Your Experience
            </h1>
            <p className="mt-2 text-gray-600 max-w-3xl">
              Select your interests to help us customize your feed and connect
              you with relevant opportunities.
            </p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full px-4 py-8 gap-8">
          {/* Category Navigation Sidebar */}
          <div className="md:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4 pb-2 border-b">
                Categories
              </h2>
              <nav className="space-y-1">
                {interestCategories.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(category.category)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                      activeCategory === category.category
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span>{category.category}</span>
                    {selected.some((item) =>
                      category.interests.includes(item)
                    ) && (
                      <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs rounded-full px-2 py-1">
                        {
                          category.interests.filter((i) => selected.includes(i))
                            .length
                        }
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">
                  Selected: {selected.length}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={selected.length === 0}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    selected.length > 0
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save Interests
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {interestCategories.map((category) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: activeCategory === category.category ? 1 : 0,
                  y: activeCategory === category.category ? 0 : 20,
                  display:
                    activeCategory === category.category ? "block" : "none",
                }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.interests.map((interest) => {
                    const isSelected = selected.includes(interest);
                    return (
                      <motion.div
                        key={interest}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCardClick(interest)}
                        className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow"
                        }`}
                      >
                        <div
                          className={`px-5 py-4 ${
                            isSelected ? "bg-indigo-50" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {interest}
                              </h3>
                            </div>
                            {isSelected && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-indigo-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Selected Interests Bar */}
        <div className="md:hidden sticky bottom-0 bg-white shadow-lg border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              {selected.length} interests selected
            </div>
            <button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selected.length > 0
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              Save
            </button>
          </div>

          {selected.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {selected.map((interest) => (
                <div
                  key={interest}
                  className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center"
                >
                  <span>{interest}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(interest);
                    }}
                    className="ml-1 text-indigo-400 hover:text-indigo-600"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeWrapper>
  );
};

export default InterestsSelection;
