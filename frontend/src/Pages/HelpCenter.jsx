import React from "react";
import { Link } from "react-router-dom";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HelpCenter = () => {
  return (
    <FadeWrapper>
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-md">
          <div className="bg-blue-600 text-white text-center rounded-t-md py-6 px-4">
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="mt-2 text-blue-100">Here to answer your questions</p>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <h3 className="font-medium text-gray-800">
                    How can I reset my password?
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    You can reset your password by clicking on “Forgot Password”
                    on the login page.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <h3 className="font-medium text-gray-800">
                    How do I contact support?
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
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
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                If you need further assistance, please reach out to us:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <span className="font-medium">Email: </span>
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-500 underline"
                  >
                    support@example.com
                  </a>
                </li>
                <li>
                  <span className="font-medium">Phone: </span>
                  <a href="tel:+1234567890" className="text-blue-500 underline">
                    (123) 456-7890
                  </a>
                </li>
              </ul>
            </section>

            <div className="text-center pt-4">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FadeWrapper>
  );
};

export default HelpCenter;
