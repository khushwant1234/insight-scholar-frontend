import React from "react";
import { Link } from "react-router-dom";
import FadeWrapper from "../Components/fadeIn";

const HelpCenter = () => {
  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Help Center
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-4">
              <li className="border-b pb-4">
                <p className="font-medium text-gray-800">
                  How can I reset my password?
                </p>
                <p className="ml-4 text-gray-600">
                  You can reset your password by clicking on "Forgot Password"
                  on the login page.
                </p>
              </li>
              <li className="border-b pb-4">
                <p className="font-medium text-gray-800">
                  How do I contact support?
                </p>
                <p className="ml-4 text-gray-600">
                  You can contact support by visiting our Contact Us page or
                  emailing us at{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-500 underline"
                  >
                    support@example.com
                  </a>
                  .
                </p>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-2">
              If you need further assistance, please reach out to us:
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Email: </span>
              <a
                href="mailto:support@example.com"
                className="text-blue-500 underline"
              >
                support@example.com
              </a>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone: </span>
              <a href="tel:+1234567890" className="text-blue-500 underline">
                (123) 456-7890
              </a>
            </p>
          </section>

          <div className="text-center mt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </FadeWrapper>
  );
};

export default HelpCenter;
