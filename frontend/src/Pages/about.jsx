import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeWrapper from "../Components/fadeIn";

const About = () => {
  return (
    <FadeWrapper>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-10">
          {/* Business/Platform Description */}
          <section className="mb-12">
            <h1 className="text-4xl font-bold text-center mb-4">
              About Our Platform
            </h1>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              Our platform is designed to empower students, professionals, and
              institutions by providing a comprehensive space to explore and
              connect with leading colleges. Discover our unique features,
              curated content, and expert guidance that help you make informed
              decisions about your academic and career journey.
            </p>
          </section>

          {/* Core Team Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Our Core Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  src="https://via.placeholder.com/150"
                  alt="CEO Photo"
                />
                <h3 className="text-xl font-semibold">CEO</h3>
                <p className="mt-2 text-gray-600">[CEO Name]</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  src="https://via.placeholder.com/150"
                  alt="Tech Lead Photo"
                />
                <h3 className="text-xl font-semibold">Tech Lead</h3>
                <p className="mt-2 text-gray-600">[Tech Lead Name]</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  src="https://via.placeholder.com/150"
                  alt="Finance Lead Photo"
                />
                <h3 className="text-xl font-semibold">Finance Lead</h3>
                <p className="mt-2 text-gray-600">[Finance Lead Name]</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  src="https://via.placeholder.com/150"
                  alt="Business Lead Photo"
                />
                <h3 className="text-xl font-semibold">Business Lead</h3>
                <p className="mt-2 text-gray-600">[Business Lead Name]</p>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Developer
            </h2>
            <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto text-center">
              <img
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                src="https://via.placeholder.com/150"
                alt="Developer Photo"
              />
              <h3 className="text-xl font-semibold">Developer</h3>
              <p className="mt-2 text-gray-600">[Developer Name]</p>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default About;
