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
  const navigate = useNavigate();
  const { setUser, setColleges } = useContext(UserContext);

  // Define the toggleForm function
  const toggleForm = () => {
    setIsSignup(!isSignup);
    // Reset any error states if needed
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

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    // Add validation to catch empty fields
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
        {/* Left Side: Illustration and Brand */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background gradient with patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
            {/* Abstract pattern */}
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

            {/* Floating circles */}
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

          {/* Content */}
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

            {/* Illustration */}
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

            {/* Testimonial */}
            {/* <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
              <p className="text-white italic">
                "InsightScholar helped me find the perfect college community and
                connect with mentors who've guided me through my academic
                journey."
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-700 font-bold">
                  JS
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Jamie Smith</p>
                  <p className="text-indigo-200 text-sm">
                    Computer Science, Stanford
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="relative h-16 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
                {/* Background animation - ensure it's behind everything and can't capture clicks */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    {/* SVG content remains unchanged */}
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
                      {/* Other gradient definitions remain the same */}
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="url(#Gradient1)"
                    >
                      {/* Animation elements remain the same */}
                    </rect>
                    {/* Other rectangle elements remain the same */}
                  </svg>
                </div>

                {/* Form switcher - ensure it's above the animation with a higher z-index */}
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

              {/* Form Content */}
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
                    <p className="mb-6 text-gray-600">
                      Please check your email at{" "}
                      <span className="font-semibold text-indigo-600">
                        {registeredEmail}
                      </span>{" "}
                      to verify your account.
                    </p>
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
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {!isSignup && (
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <a
                              href="#"
                              className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            >
                              Forgot password?
                            </a>
                          </div>
                        )}
                        {isSignup && (
                          <label className="text-sm font-medium text-gray-700 block">
                            Password <span className="text-red-500">*</span>
                          </label>
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
                          />
                        </div>
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

              {/* Footer */}
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

            {/* Mobile Brand for small screens */}
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
