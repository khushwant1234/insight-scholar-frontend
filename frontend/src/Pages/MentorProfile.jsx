import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { UserContext } from "../context/userContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const { user } = useContext(UserContext);

  // Fetch mentor data
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const data = await GetApiCall(`${backendUrl}/api/user/mentor/${id}`);
        if (data.success) {
          setMentor(data.mentor);
        } else {
          toast.error(data.error || "Failed to fetch mentor information");
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        toast.error("Error fetching mentor information");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorData();
    }
  }, [id]);

  // Function to show QR code for payment
  const handleRequestMentorship = () => {
    if (!user) {
      toast.error("Please log in to request mentorship");
      return;
    }
    setShowQrModal(true);
  };

  // Function to submit mentorship request after payment
  const handleSubmitRequest = async () => {
    try {
      setProcessingRequest(true);

      const response = await PostApiCall(
        `${backendUrl}/api/mentor-requests/create`,
        {
          mentorId: mentor._id,
          studentId: user._id,
          paymentAmount: 1000, // ₹1000 fee
          paymentStatus: "pending_verification", // Admin will verify
        }
      );

      if (response.success) {
        toast.success(
          "Your mentorship request has been submitted for approval"
        );
        setRequestSubmitted(true);
        setShowQrModal(false);
      } else {
        toast.error(response.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit mentorship request");
    } finally {
      setProcessingRequest(false);
    }
  };

  // Loading and not found states remain the same...
  if (loading) {
    return (
      <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D43134C4]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#484848] mb-4">
              Mentor not found
            </h2>
            <Link to="/mentors" className="text-[#D43134C4] hover:underline">
              Return to mentors list
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isAvailable = mentor.mentorDetails && !mentor.mentorDetails.isAssigned;

  // QR Code Payment Modal
  const QRModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#484848] mb-4">
          Pay to Request Mentorship
        </h2>
        <p className="mb-4">
          Scan the QR code below to pay ₹1000 for mentorship with {mentor.name}.
        </p>

        <div className="flex justify-center mb-6">
          <div className="border-4 border-gray-200 p-2 rounded-lg">
            {/* Replace with your actual payment QR code */}
            <img></img>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">
            After scanning and completing payment, click the button below to
            submit your request.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowQrModal(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitRequest}
            disabled={processingRequest}
            className={`px-4 py-2 ${
              processingRequest
                ? "bg-gray-400"
                : "bg-[#D43134C4] hover:bg-[#7B0F119E]"
            } text-white rounded-lg`}
          >
            {processingRequest ? "Processing..." : "I have paid"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header with profile image and name */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Same profile section as before */}
            <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-[#D43134C4]">
              <img
                src={
                  mentor.profilePic ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                }
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#484848] mb-2">
                {mentor.name}
              </h1>
              <p className="text-xl text-[#484848]">
                {mentor.college && mentor.college.name
                  ? mentor.college.name
                  : "No College"}{" "}
                • {mentor.year || "N/A"}
              </p>
              <p className="text-lg text-[#484848] mb-4">
                {mentor.major || "No Major"}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {mentor.interests &&
                  mentor.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-[#D43134C4]/10 text-[#D43134C4] rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
              </div>
            </div>

            <div className="md:ml-auto text-center md:text-right">
              <div className="inline-block px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium mb-4">
                {isAvailable
                  ? "Available for Mentoring"
                  : "Currently Mentoring"}
              </div>

              {isAvailable && !requestSubmitted ? (
                <button
                  onClick={handleRequestMentorship}
                  className="block w-full md:w-auto bg-[#D43134C4] hover:bg-[#7B0F119E] text-white px-6 py-3 rounded-lg transition-colors font-bold"
                >
                  Request Mentorship
                </button>
              ) : requestSubmitted ? (
                <div className="block w-full md:w-auto bg-amber-500 text-white px-6 py-3 rounded-lg font-bold">
                  Request Pending Approval
                </div>
              ) : null}
            </div>
          </div>

          {/* Rest of your component - stats, bio, contact info */}
          {/* ... */}

          {/* Back button */}
          <Link
            to="/mentors"
            className="inline-block mt-4 text-[#D43134C4] hover:underline"
          >
            ← Back to mentors list
          </Link>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && <QRModal />}

      <Footer />
    </div>
  );
};

export default MentorProfile;
