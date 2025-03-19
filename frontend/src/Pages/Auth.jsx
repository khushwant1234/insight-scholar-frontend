import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { PostApiCall, GetApiCall } from "../utils/apiCall";
import { setItem } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Loading from "../Components/Loading";
import FadeWrapper from "../Components/fadeIn";

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
  const [collegeOptions, setCollegeOptions] = useState([]); // New state for fetched colleges
  const [loading, setLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();
  const { setUser, setColleges } = useContext(UserContext);

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
  };

  useEffect(() => {
    setLoading(true);
    const fetchColleges = async () => {
      try {
        const data = await GetApiCall(`${backendUrl}/api/college/allColleges`);
        // Assuming API returns an object with a 'colleges' array or the array directly
        // console.log(data.colleges);
        // console.log(data.success);
        if (data.success && data.colleges) {
          // console.log("inside if in getColleges");
          // setColleges(data.colleges);
          setCollegeOptions(data.colleges); // Set fetched colleges in local state
        } else {
          // console.log("error in else");
          console.log(data);
          toast.error("Failed to fetch colleges ");
        }
      } catch (error) {
        // console.log("error in catch");
        console.log(error);
        toast.error("Failed to fetch colleges abc");
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
    if (
      !signupForm.college ||
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password
    ) {
      toast.error("Please fill every field");
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
    try {
      const data = await PostApiCall(`${backendUrl}/api/auth/login`, loginForm);

      if (data.success) {
        console.log("Data", data);
        await setItem("token", data.data.token);
        toast.success("Login Successful");
        // Update context with user data
        setUser(data.data.user);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
        toast.error(error.response.data.message || "Login failed");
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
        <Loading></Loading>
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            {isSignup ? "SIGN UP" : "LOGIN"}
          </h1>
          {registrationSuccess ? (
            <div className="text-center">
              <svg
                className="w-20 h-20 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-4">
                Registration Successful!
              </h2>
              <p className="mb-6">
                We've sent a verification email to{" "}
                <strong>{registeredEmail}</strong>. Please check your inbox and
                verify your email address to continue.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or request a
                new verification email.
              </p>
              <button
                onClick={() => {
                  handleResendVerification(registeredEmail);
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Resend Verification Email
              </button>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsSignup(false);
                    setRegistrationSuccess(false);
                  }}
                  className="text-purple-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
            >
              {isSignup ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <select
                    name="college"
                    value={signupForm.college}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select College</option>
                    {collegeOptions.map((college) => (
                      <option key={college._id} value={college._id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="major"
                    value={signupForm.major}
                    onChange={handleSignupChange}
                    placeholder="Major"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                    type="text"
                    name="year"
                    value={signupForm.year}
                    onChange={handleSignupChange}
                    placeholder="Year of Graduation"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                    type="text"
                    name="linkedIn"
                    value={signupForm.linkedIn}
                    onChange={handleSignupChange}
                    placeholder="LinkedIn Profile URL (optional)"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </>
              ) : (
                <>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-auto px-8 py-3 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 transition-colors"
                >
                  {isSignup ? "SIGN UP" : "LOGIN"}
                </button>
              </div>
            </form>
          )}
          <p className="text-center text-gray-600 mt-6">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-purple-600 hover:underline"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Haven't signed up yet?{" "}
                <button
                  onClick={toggleForm}
                  className="text-purple-600 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Auth;
