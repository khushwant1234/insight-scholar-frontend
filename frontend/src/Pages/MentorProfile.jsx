import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { UserContext } from "../context/userContext";
import FadeWrapper from "../Components/fadeIn";
import Loading from "../Components/Loading";

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

          // Check if user has already requested this mentor
          if (user && data.mentor) {
            const checkRequest = await GetApiCall(
              `${backendUrl}/api/mentor-requests/check/${data.mentor._id}/${user._id}`
            );
            if (checkRequest.success && checkRequest.exists) {
              setRequestSubmitted(true);
            }
          }
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
  }, [id, user]);

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

  if (loading) {
    return (
      <FadeWrapper>
        <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
          <Navbar />
          <div className="flex-1 flex justify-center items-center">
            <Loading />
          </div>
          <Footer />
        </div>
      </FadeWrapper>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md border border-[#a08961]/10">
            <h2 className="text-2xl font-bold text-[#062f2e] mb-4">
              Mentor not found
            </h2>
            <Link
              to="/mentors"
              className="text-[#845c36] hover:text-[#062f2e] transition-colors"
            >
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-md w-full border border-[#a08961]/20 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#062f2e]">
            Pay to Request Mentorship
          </h2>
          <button
            onClick={() => setShowQrModal(false)}
            className="text-[#062f2e]/70 hover:text-[#062f2e] rounded-full p-1"
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
        </div>

        <p className="mb-4 text-[#062f2e]/80">
          Scan the QR code below to pay ₹1000 for mentorship with {mentor.name}.
        </p>

        <div className="flex justify-center mb-6">
          <div className="border-4 border-[#a08961]/10 p-2 rounded-lg bg-[#f5f3ee]">
            {/* Replace with your actual payment QR code */}
            <div className="w-64 h-64 bg-[#a08961]/5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-[#845c36]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mb-6 p-3 bg-[#f5f3ee] rounded-lg border border-[#a08961]/10">
          <p className="text-sm text-[#062f2e]/70">
            After scanning and completing payment, click the button below to
            submit your request.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowQrModal(false)}
            className="px-4 py-2 bg-[#f5f3ee] text-[#062f2e] rounded-lg hover:bg-[#a08961]/10 transition-colors border border-[#a08961]/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitRequest}
            disabled={processingRequest}
            className={`px-4 py-2 ${
              processingRequest
                ? "bg-[#062f2e]/50 cursor-not-allowed"
                : "bg-[#062f2e] hover:bg-[#845c36]"
            } text-white rounded-lg transition-colors`}
          >
            {processingRequest ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </span>
            ) : (
              "I have paid"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-4">
              <ol className="flex items-center space-x-1 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-[#062f2e]/60 hover:text-[#062f2e]"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-[#062f2e]/60">
                  <span className="mx-1">/</span>
                </li>
                <li>
                  <Link
                    to="/mentors"
                    className="text-[#062f2e]/60 hover:text-[#062f2e]"
                  >
                    Mentors
                  </Link>
                </li>
                <li className="text-[#062f2e]/60">
                  <span className="mx-1">/</span>
                </li>
                <li className="text-[#845c36] font-medium">{mentor.name}</li>
              </ol>
            </nav>

            {/* Main content card */}
            <div className="bg-white rounded-xl shadow-md border border-[#a08961]/10 overflow-hidden">
              {/* Cover photo */}
              <div className="h-48 bg-gradient-to-r from-[#062f2e] to-[#083e3d] relative">
                <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Profile content */}
              <div className="relative px-6 pb-6">
                {/* Profile photo */}
                <div className="absolute -top-16 left-6 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={
                      mentor.profilePic ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
                    }
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Header with name and action buttons */}
                <div className="pt-20 pb-6 sm:ml-36 sm:pt-2 border-b border-[#a08961]/10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-[#062f2e] mb-1">
                        {mentor.name}
                      </h1>
                      <div className="flex items-center gap-2 text-[#062f2e]/70">
                        <span className="inline-flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-[#a08961]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {mentor.major || "No Major"}
                        </span>
                        {mentor.college && mentor.college.name && (
                          <>
                            <span className="text-[#062f2e]/40">•</span>
                            <span className="inline-flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-[#a08961]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                              {mentor.college.name}
                            </span>
                          </>
                        )}
                        {mentor.year && (
                          <>
                            <span className="text-[#062f2e]/40">•</span>
                            <span className="inline-flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-[#a08961]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Year {mentor.year}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {isAvailable ? (
                        requestSubmitted ? (
                          <div className="px-5 py-2.5 bg-[#a08961]/10 text-[#845c36] rounded-lg font-medium text-sm text-center">
                            Request Submitted
                          </div>
                        ) : (
                          <button
                            onClick={handleRequestMentorship}
                            className="px-5 py-2.5 bg-[#062f2e] text-white rounded-lg hover:bg-[#845c36] transition-colors text-sm font-medium"
                          >
                            Request Mentorship
                          </button>
                        )
                      ) : (
                        <div className="px-5 py-2.5 bg-[#a08961]/10 text-[#845c36] rounded-lg font-medium text-sm text-center">
                          Currently Unavailable
                        </div>
                      )}

                      <button className="px-5 py-2.5 border border-[#a08961]/20 text-[#062f2e] rounded-lg hover:bg-[#f5f3ee] transition-colors text-sm font-medium">
                        Message
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 py-6 mb-6 border-b border-[#a08961]/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#845c36]">
                      {mentor.karma || 0}
                    </div>
                    <div className="text-sm text-[#062f2e]/70">
                      Karma Points
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#845c36]">
                      {mentor.mentorDetails?.studentsHelped || 0}
                    </div>
                    <div className="text-sm text-[#062f2e]/70">
                      Students Helped
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#845c36]">
                      {mentor.mentorDetails?.rating || 0}/5
                    </div>
                    <div className="text-sm text-[#062f2e]/70">Rating</div>
                  </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* About section */}
                    <section>
                      <h2 className="text-xl font-semibold text-[#062f2e] mb-3">
                        About
                      </h2>
                      <p className="text-[#062f2e]/80 whitespace-pre-line">
                        {mentor.mentorDetails?.bio || "No bio available."}
                      </p>
                    </section>

                    {/* Expertise section */}
                    <section>
                      <h2 className="text-xl font-semibold text-[#062f2e] mb-3">
                        Areas of Expertise
                      </h2>
                      {mentor.interests && mentor.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {mentor.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-[#a08961]/10 text-[#845c36] rounded-lg text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#062f2e]/60">
                          No expertise areas specified.
                        </p>
                      )}
                    </section>

                    {/* Experience section */}
                    {mentor.mentorDetails?.experiences &&
                      mentor.mentorDetails.experiences.length > 0 && (
                        <section>
                          <h2 className="text-xl font-semibold text-[#062f2e] mb-3">
                            Experience
                          </h2>
                          <div className="space-y-4">
                            {mentor.mentorDetails.experiences.map(
                              (exp, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-[#f5f3ee] rounded-lg border border-[#a08961]/10"
                                >
                                  <h3 className="font-medium text-[#062f2e]">
                                    {exp.title}
                                  </h3>
                                  <p className="text-sm text-[#062f2e]/70">
                                    {exp.company} • {exp.duration}
                                  </p>
                                  <p className="text-[#062f2e]/80 mt-2">
                                    {exp.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Reviews section */}
                    <section>
                      <h2 className="text-xl font-semibold text-[#062f2e] mb-3">
                        Reviews
                      </h2>

                      {mentor.mentorDetails?.reviews &&
                      mentor.mentorDetails.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {mentor.mentorDetails.reviews.map((review, index) => (
                            <div
                              key={index}
                              className="p-4 bg-[#f5f3ee] rounded-lg border border-[#a08961]/10"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#062f2e] text-white flex items-center justify-center mr-2">
                                    {review.studentName.charAt(0)}
                                  </div>
                                  <span className="font-medium text-[#062f2e]">
                                    {review.studentName}
                                  </span>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-[#a08961]"
                                          : "text-[#a08961]/30"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <p className="text-[#062f2e]/80">
                                {review.comment}
                              </p>
                              <p className="text-xs text-[#062f2e]/50 mt-2">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-[#f5f3ee] rounded-lg text-center border border-[#a08961]/10">
                          <p className="text-[#062f2e]/60">No reviews yet.</p>
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    {/* Details box */}
                    <div className="bg-[#f5f3ee] rounded-lg p-5 border border-[#a08961]/10">
                      <h3 className="text-lg font-semibold text-[#062f2e] mb-3">
                        Mentorship Details
                      </h3>

                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-[#062f2e]/70">Fee</span>
                          <span className="font-medium text-[#062f2e]">
                            ₹1000
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#062f2e]/70">Format</span>
                          <span className="font-medium text-[#062f2e]">
                            Virtual
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#062f2e]/70">Duration</span>
                          <span className="font-medium text-[#062f2e]">
                            One month
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#062f2e]/70">
                            Availability
                          </span>
                          <span
                            className={`font-medium ${
                              isAvailable
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Contact info */}
                    <div className="bg-[#f5f3ee] rounded-lg p-5 border border-[#a08961]/10">
                      <h3 className="text-lg font-semibold text-[#062f2e] mb-3">
                        Contact Information
                      </h3>

                      <ul className="space-y-3">
                        {mentor.email && (
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-[#a08961] mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-[#062f2e]">
                              {mentor.email}
                            </span>
                          </li>
                        )}
                        {mentor.linkedIn && (
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-[#a08961] mr-2 mt-0.5 flex-shrink-0"
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
                            <a
                              href={mentor.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#845c36] hover:text-[#062f2e]"
                            >
                              LinkedIn Profile
                            </a>
                          </li>
                        )}
                      </ul>

                      {!mentor.email && !mentor.linkedIn && (
                        <p className="text-[#062f2e]/60">
                          Contact information unavailable.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-6">
              <Link
                to="/mentors"
                className="inline-flex items-center text-[#845c36] hover:text-[#062f2e] transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to mentors list
              </Link>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQrModal && <QRModal />}

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default MentorProfile;
