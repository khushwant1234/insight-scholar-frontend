import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeWrapper from "../Components/fadeIn";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-indigo-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <button
        className="w-full p-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-inset"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-gray-800 text-lg">{question}</h3>
        <div
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-indigo-500"
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
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-indigo-50 text-gray-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HelpCenter = () => {
  const faqs = [
    {
      question: "How can I reset my password?",
      answer:
        "You can reset your password by clicking on 'Forgot Password' on the login page. You'll receive an email with instructions to create a new password. The reset link is valid for 15 minutes.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team by emailing support@insightscholar.com. We typically respond within 24 hours on business days.",
    },
    {
      question: "How do I join my college community?",
      answer:
        "To join your college community, sign up with your college email address. If your college isn't listed, you can request to add it by contacting our support team.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security very seriously. We use encryption for all sensitive data and never share your personal information with third parties without your consent.",
    },
    {
      question: "How can I compare different colleges?",
      answer:
        "Navigate to the College Comparison tool from the main menu. There you can select multiple institutions and view side-by-side comparisons of various metrics including academics, campus life, and career outcomes.",
    },
    {
      question: "Can I change my college affiliation after signing up?",
      answer:
        "For security and community integrity reasons, your college affiliation cannot be changed directly after signup. If you need to update your college information, please contact our support team at support@insightscholar.com with your request and verification of your new college email.",
    },
  ];

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="mt-2 text-gray-600">
              We're here to help you get the most out of InsightScholar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left sidebar */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
                  <h2 className="text-white font-semibold text-lg">
                    Quick Links
                  </h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/"
                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
                          />
                        </svg>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-indigo-500"
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
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/college-comparison"
                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Compare Colleges
                      </Link>
                    </li>
                  </ul>

                  <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-indigo-100 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-800">
                        Need more help?
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Our support team is available to assist you with any
                      questions.
                    </p>
                    <a
                      href="mailto:support@insightscholar.com"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Contact Support
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              {/* FAQs */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
                  <h2 className="text-white font-semibold text-lg flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  {faqs.map((faq, index) => (
                    <FAQ
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center text-gray-600 text-sm"
          >
            <p>
              © {new Date().getFullYear()} InsightScholar. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Cookies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </FadeWrapper>
  );
};

export default HelpCenter;
