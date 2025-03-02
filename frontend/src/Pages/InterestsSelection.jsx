import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PutApiCall } from "../utils/apiCall";
import { UserContext } from "../context/userContext";
import FadeWrapper from "../Components/fadeIn";

const interestOptions = [
  "Programming",
  "Music",
  "Sports",
  "Movies",
  "Travel",
  "Cooking",
  "Photography",
  "Reading",
];

const InterestsSelection = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleCardClick = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    try {
      const data = await PutApiCall("http://localhost:8000/api/user/profile", {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-col items-center py-16 px-4">
        <h1 className="text-4xl text-white font-bold mb-10">
          Select Your Interests
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {interestOptions.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <div
                key={interest}
                onClick={() => handleCardClick(interest)}
                className={`w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center cursor-pointer transform transition duration-300 hover:scale-110 ${
                  isSelected ? "shadow-2xl ring-4 ring-green-500" : "shadow-md"
                }`}
              >
                <span className="text-center text-sm md:text-base font-semibold">
                  {interest}
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-10 px-8 py-3 bg-white text-blue-500 rounded-full font-bold transition transform hover:scale-105 hover:bg-blue-100"
        >
          Add Interests
        </button>
      </div>
    </FadeWrapper>
  );
};

export default InterestsSelection;
