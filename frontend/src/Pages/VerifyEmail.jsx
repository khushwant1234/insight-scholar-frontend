import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GetApiCall, PostApiCall } from "../utils/apiCall";
import { toast } from "react-toastify";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const VerifyEmail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await GetApiCall(
          `${backendUrl}/api/auth/verify-email/${token}`
        );
        if (response.success) {
          setVerificationStatus("success");
          toast.success("Email verified successfully!");
        } else {
          setVerificationStatus("failed");
          toast.error(response.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("failed");
        toast.error("Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setResendLoading(true);
    try {
      const response = await PostApiCall(
        `${backendUrl}/api/auth/resend-verification`,
        { email }
      );
      if (response.success) {
        toast.success(response.message || "Verification email sent!");
      } else {
        toast.error(response.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("Failed to send verification email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <FadeWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          {verificationStatus === "verifying" ? (
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                Verifying Email...
              </h1>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="text-center">
              <svg
                className="w-20 h-20 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">
                Your email has been verified successfully. You can now log in to
                your account.
              </p>
              <Link
                to="/auth"
                className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors"
              >
                Log In
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="w-20 h-20 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">
                The verification link is invalid or has expired. Please request
                a new one.
              </p>
              <form
                className="space-y-4 mb-6"
                onSubmit={handleResendVerification}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </button>
              </form>
              <Link to="/auth" className="text-purple-600 hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </FadeWrapper>
  );
};

export default VerifyEmail;
