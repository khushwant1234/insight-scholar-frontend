import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const About = () => {
  // Company stats - replace with actual numbers
  const stats = [
    // { value: "50,000+", label: "Students Helped" },
    // { value: "1,000+", label: "Partner Colleges" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support" },
  ];

  // Team members with more detailed info
  const coreTeam = [
    // {
    //   name: "Alexandra Chen",
    //   role: "Chief Executive Officer",
    //   bio: "Former education consultant with 15+ years of experience transforming educational access.",
    //   image: "https://via.placeholder.com/300",
    //   linkedin: "https://linkedin.com/in/",
    //   twitter: "https://twitter.com/",
    //   email: "mailto:alexandra@example.com",
    // },
    // {
    //   name: "Michael Patel",
    //   role: "Chief Technology Officer",
    //   bio: "Tech veteran with background building scalable platforms at leading EdTech companies.",
    //   image: "https://via.placeholder.com/300",
    //   linkedin: "https://linkedin.com/in/",
    //   twitter: "https://twitter.com/",
    //   email: "mailto:michael@example.com",
    // },
    // {
    //   name: "Sarah Johnson",
    //   role: "Head of Finance",
    //   bio: "Financial strategist specializing in educational sector investments and sustainable growth.",
    //   image: "https://via.placeholder.com/300",
    //   linkedin: "https://linkedin.com/in/",
    //   twitter: "https://twitter.com/",
    //   email: "mailto:sarah@example.com",
    // },
    // {
    //   name: "David Wilson",
    //   role: "Business Development Lead",
    //   bio: "Partnership specialist with a passion for connecting institutions with the right students.",
    //   image: "https://via.placeholder.com/300",
    //   linkedin: "https://linkedin.com/in/",
    //   twitter: "https://twitter.com/",
    //   email: "mailto:david@example.com",
    // },
  ];

  const developers = [
    {
      name: "Khushwant Singh",
      role: "Developer",
      bio: "Full-stack engineer focused on creating platforms that scale.",
      image: "/khushwant.jpg",
      linkedin: "https://linkedin.com/in/singh-khushwant",
      github: "https://github.com/khushwant1234",
      email: "mailto:khushwantsingh638@gmail.com",
    },
  ];

  return (
    <FadeWrapper>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        {/* Hero Section with Background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Transforming Educational Journeys
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Connecting ambitious minds with world-class educational
                opportunities through innovation, expertise, and personalized
                guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-12 h-1 bg-blue-600 inline-block mr-4"></span>
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    We're on a mission to democratize access to quality
                    education by providing transparent, comprehensive
                    information and tools that empower students to make
                    confident decisions about their academic futures.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Through innovative technology and expert guidance, we bridge
                    the gap between students and educational institutions,
                    creating pathways to success for everyone.
                  </p>
                </div>

                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-12 h-1 bg-blue-600 inline-block mr-4"></span>
                    Our Vision
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    We envision a world where every student, regardless of
                    background, has the information and support needed to access
                    educational opportunities that align with their unique goals
                    and potential.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    By 2030, we aim to have helped over 1 million students
                    worldwide find their ideal educational paths, contributing
                    to a more educated, connected, and empowered global
                    community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Our Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                Our experienced leadership team brings decades of combined
                experience in education, technology, and business to drive our
                mission forward.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreTeam.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        src={member.image}
                        alt={`${member.name}, ${member.role}`}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                      <div className="flex space-x-3">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaLinkedin size={20} />
                        </a>
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <FaTwitter size={20} />
                        </a>
                        <a
                          href={member.email}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaEnvelope size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Development Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                The Creators
              </h2>
              <div className="max-w-md mx-auto">
                {developers.map((dev, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={dev.image}
                        alt={`${dev.name}, ${dev.role}`}
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {dev.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {dev.role}
                      </p>
                      <p className="text-gray-600 mb-4">{dev.bio}</p>
                      <div className="flex space-x-3">
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaLinkedin size={20} />
                        </a>
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-800 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.11-.775.42-1.305.763-1.605-2.665-.3-5.467-1.333-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.19.694.8.576C20.565 21.796 24 17.296 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>{" "}
                        </a>
                        <a
                          href={dev.email}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaEnvelope size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Educational Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have found their perfect
              educational match with our platform.
            </p>
            {/* <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-md">
              Get Started Today
            </button> */}
          </div>
        </section>

        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default About;
