import "../styles/animations.css";
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { PostApiCall, GetApiCall } from "../utils/apiCall";
import { setItem } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Loading from "../Components/Loading";
import FadeWrapper from "../Components/fadeIn";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    major: "",
    year: "",
    linkedIn: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [emailDomainError, setEmailDomainError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Password not entered",
    color: "gray-400",
  });
  const navigate = useNavigate();
  const { setUser, setColleges } = useContext(UserContext);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  useEffect(() => {
    setLoading(true);
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        if (data.success && data.colleges) {
          setCollegeOptions(data.colleges);
        } else {
          toast.error("Failed to fetch colleges");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [setColleges]);

  const validateEmailDomain = (email, collegeId) => {
    if (!email || !collegeId || collegeId === "notInCollege") {
      setEmailDomainError("");
      return true;
    }

    const college = collegeOptions.find((c) => c._id === collegeId);
    if (
      !college ||
      !college.emailDomains ||
      college.emailDomains.length === 0
    ) {
      setEmailDomainError("");
      return true;
    }

    const emailDomain = email.split("@")[1];
    if (!emailDomain) {
      setEmailDomainError("Please enter a valid email address");
      return false;
    }

    if (!college.emailDomains.includes(emailDomain)) {
      setEmailDomainError(
        `To register with ${
          college.name
        }, you must use an email address from one of these domains: ${college.emailDomains.join(
          ", "
        )}`
      );
      return false;
    }

    setEmailDomainError("");
    return true;
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        message: "Password not entered",
        color: "gray-400",
      });
      return;
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set message based on score
    let message, color;

    switch (score) {
      case 0:
      case 1:
        message = "Very Weak";
        color = "red-500";
        break;
      case 2:
        message = "Weak";
        color = "orange-500";
        break;
      case 3:
        message = "Moderate";
        color = "yellow-500";
        break;
      case 4:
        message = "Strong";
        color = "green-500";
        break;
      case 5:
        message = "Very Strong";
        color = "green-600";
        break;
      default:
        message = "Unknown";
        color = "gray-400";
    }

    setPasswordStrength({ score, message, color });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      validateEmailDomain(value, signupForm.college);
    } else if (name === "college") {
      const college = collegeOptions.find((c) => c._id === value);
      setSelectedCollege(college);
      validateEmailDomain(signupForm.email, value);
    } else if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error("Please fill required fields");
      return;
    }

    if (signupForm.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (signupForm.college && signupForm.college !== "notInCollege") {
      const isValid = validateEmailDomain(signupForm.email, signupForm.college);
      if (!isValid) {
        return;
      }
    }

    try {
      const data = await PostApiCall(
        `${backendUrl}/api/auth/register`,
        signupForm
      );
      if (data.success) {
        await setItem("token", data.data.token);
        setRegistrationSuccess(true);
        setRegisteredEmail(signupForm.email);
        toast.success(
          data.message || "Signup Successful! Please verify your email."
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const data = await PostApiCall(`${backendUrl}/api/auth/login`, loginForm);

      if (data.success) {
        await setItem("token", data.data.token);
        toast.success("Login Successful");
        setUser(data.data.user);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Login failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleResendVerification = async (email) => {
    try {
      const response = await PostApiCall(
        `${backendUrl}/api/auth/resend-verification`,
        { email }
      );
      if (response.success) {
        toast.success("Verification email sent successfully!");
      } else {
        toast.error(response.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("Failed to send verification email");
    }
  };

  if (loading) {
    return (
      <FadeWrapper>
        <Loading />
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-stretch">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="smallGrid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <pattern
                    id="grid"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path
                      d="M 100 0 L 0 0 0 100"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full opacity-10"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-white rounded-full opacity-10"
              animate={{
                y: [0, 20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div>
              <div className="flex items-center space-x-3">
                <img src="/logonobg2.png" alt="Logo" className="h-12 w-12" />
                <h1 className="text-3xl font-bold text-white">
                  InsightScholar
                </h1>
              </div>
              <p className="text-indigo-100 mt-5 max-w-md text-lg">
                Connect with college communities, find mentors, and make
                informed academic decisions.
              </p>
            </div>

            <div className="flex-grow flex items-center justify-center">
              <img
                src="/gpt-edu1.png"
                alt="Education illustration"
                className="max-h-[60vh] object-contain drop-shadow-2xl"
              />
              <a className="absolute bottom-4 right-4 text-white text-sm hover:underline">
                Designed By FreePik
              </a>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="relative h-16 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <radialGradient
                        id="Gradient1"
                        cx="50%"
                        cy="50%"
                        fx="0.441602%"
                        fy="50%"
                        r=".5"
                      >
                        <animate
                          attributeName="fx"
                          dur="34s"
                          values="0%;3%;0%"
                          repeatCount="indefinite"
                        ></animate>
                        <stop
                          offset="0%"
                          stopColor="rgba(255, 0, 255, 1)"
                        ></stop>
                        <stop
                          offset="100%"
                          stopColor="rgba(255, 0, 255, 0)"
                        ></stop>
                      </radialGradient>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="url(#Gradient1)"
                    ></rect>
                  </svg>
                </div>

                <div className="flex h-full relative" style={{ zIndex: 10 }}>
                  <button
                    onClick={() => setIsSignup(false)}
                    className={`flex-1 flex items-center justify-center text-white font-medium transition-all duration-300 relative ${
                      !isSignup
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Sign In
                    {!isSignup && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setIsSignup(true)}
                    className={`flex-1 flex items-center justify-center text-white font-medium transition-all duration-300 relative ${
                      isSignup ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    Sign Up
                    {isSignup && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-8">
                {registrationSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-green-600"
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
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                      Verification Sent!
                    </h2>
                    <p className="mb-3 text-gray-600">
                      Please check your email at{" "}
                      <span className="font-semibold text-indigo-600">
                        {registeredEmail}
                      </span>{" "}
                      to verify your account.
                    </p>
                    <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700 font-medium">
                            Important!
                          </p>
                          <p className="text-sm text-yellow-600">
                            Please check your <strong>spam/junk folder</strong>{" "}
                            if you don't see the verification email in your
                            inbox within a few minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleResendVerification(registeredEmail)}
                      className="bg-indigo-100 text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Resend Verification
                    </button>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setIsSignup(false);
                          setRegistrationSuccess(false);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Back to Login
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    key={isSignup ? "signup" : "login"}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      {isSignup ? "Create your account" : "Welcome back"}
                    </h2>
                    <form
                      className="space-y-4"
                      onSubmit={
                        isSignup ? handleSignupSubmit : handleLoginSubmit
                      }
                    >
                      {isSignup && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="name"
                                value={signupForm.name}
                                onChange={handleSignupChange}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                              College
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                              </div>
                              <select
                                name="college"
                                value={signupForm.college}
                                onChange={handleSignupChange}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                              >
                                <option value="">Select College</option>
                                <option value="notInCollege">
                                  Not in College
                                </option>
                                {collegeOptions.map((college) => (
                                  <option key={college._id} value={college._id}>
                                    {college.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                            {isSignup &&
                              selectedCollege &&
                              selectedCollege.emailDomains &&
                              selectedCollege.emailDomains.length > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                  This college requires an email from:{" "}
                                  {selectedCollege.emailDomains.join(", ")}
                                </p>
                              )}
                          </div>

                          {signupForm.college &&
                            signupForm.college !== "notInCollege" && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700 block">
                                    Major
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <svg
                                        className="h-5 w-5 text-gray-400"
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
                                    </div>
                                    <input
                                      type="text"
                                      name="major"
                                      value={signupForm.major}
                                      onChange={handleSignupChange}
                                      placeholder="Computer Science"
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700 block">
                                    Graduation Year
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <svg
                                        className="h-5 w-5 text-gray-400"
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
                                    </div>
                                    <input
                                      type="text"
                                      name="year"
                                      value={signupForm.year}
                                      onChange={handleSignupChange}
                                      placeholder="2025"
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                              LinkedIn (optional)
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="linkedIn"
                                value={signupForm.linkedIn}
                                onChange={handleSignupChange}
                                placeholder="linkedin.com/in/username"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">
                          Email Address{" "}
                          {isSignup && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              />
                            </svg>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={
                              isSignup ? signupForm.email : loginForm.email
                            }
                            onChange={
                              isSignup ? handleSignupChange : handleLoginChange
                            }
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-2.5 border ${
                              emailDomainError
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            required
                          />
                        </div>
                        {isSignup && emailDomainError && (
                          <p className="text-red-500 text-sm mt-1">
                            {emailDomainError}
                          </p>
                        )}
                      </div>

                      {isSignup &&
                        signupForm.college &&
                        signupForm.college !== "notInCollege" &&
                        signupForm.email && (
                          <div className="flex items-center mt-1">
                            {emailDomainError ? (
                              <>
                                <svg
                                  className="w-4 h-4 text-red-500 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-sm text-red-500">
                                  Email domain doesn't match college
                                  requirements
                                </span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 text-green-500 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-sm text-green-500">
                                  Email domain verified for this college
                                </span>
                              </>
                            )}
                          </div>
                        )}

                      <div className="space-y-2">
                        {isSignup ? (
                          <label className="text-sm font-medium text-gray-700 block">
                            Password <span className="text-red-500">*</span>
                          </label>
                        ) : (
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <Link
                              to="/forgot-password"
                              className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            >
                              Forgot password?
                            </Link>
                          </div>
                        )}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <input
                            type="password"
                            name="password"
                            value={
                              isSignup
                                ? signupForm.password
                                : loginForm.password
                            }
                            onChange={
                              isSignup ? handleSignupChange : handleLoginChange
                            }
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            minLength={8}
                          />
                        </div>

                        {isSignup && signupForm.password && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">
                                Password Strength:
                              </span>
                              <span
                                className={`text-xs font-medium text-${passwordStrength.color}`}
                              >
                                {passwordStrength.message}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`bg-${passwordStrength.color} h-1.5 rounded-full`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    passwordStrength.score * 20
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Use 8+ characters with a mix of letters, numbers &
                              symbols
                            </p>
                          </div>
                        )}
                      </div>

                      {!isSignup && (
                        <button
                          type="button"
                          onClick={handleLoginSubmit}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 relative z-20"
                        >
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
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign In
                        </button>
                      )}

                      {isSignup && (
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 relative z-20"
                        >
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
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Create Account
                        </button>
                      )}
                    </form>
                  </motion.div>
                )}
              </div>

              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <div className="text-center text-gray-600 text-sm">
                  By continuing, you agree to InsightScholar's{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 text-center lg:hidden">
              <div className="flex items-center justify-center space-x-2">
                <img src="/logonobg2.png" alt="Logo" className="h-8 w-8" />
                <h2 className="text-xl font-semibold text-gray-800">
                  InsightScholar
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                © {new Date().getFullYear()} InsightScholar. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Auth;
