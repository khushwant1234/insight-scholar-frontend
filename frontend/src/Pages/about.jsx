import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";
import { FaLinkedin } from "react-icons/fa";

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
    {
      name: "Srinjoy Palit",
      role: "Team Lead",
      // bio: "Former education consultant with 15+ years of experience transforming educational access.",
      image: "Srinjoy.jpeg",
      linkedin: "https://www.linkedin.com/in/srinjoypalit/",
    },
    {
      name: "Rajat Verma",
      role: "Chief Financial Officer",
      // bio: "Tech veteran with background building scalable platforms at leading EdTech companies.",
      image: "Rajat.jpeg",
      linkedin: "https://linkedin.com/in/",
    },
    {
      name: "Saumil Jain",
      role: "Chief Marketing Officer",
      image: "/Saumil.jpeg",
      linkedin: "https://linkedin.com/in/",
    },
    {
      name: "SS Nandan",
      role: "Chief Technology Officer",
      image: "/Nandan.jpeg",
      linkedin: "https://www.linkedin.com/in/ss-nandan/",
    },
  ];

  // const developers = [
  //   {
  //     name: "Khushwant Singh",
  //     role: "Developer",
  //     bio: "Full-stack engineer focused on creating platforms that scale.",
  //     image: "/khushwant.jpg",
  //     linkedin: "https://linkedin.com/in/singh-khushwant",
  //     github: "https://github.com/khushwant1234",
  //     email: "mailto:khushwantsingh638@gmail.com",
  //   },
  // ];

  return (
    <FadeWrapper>
      <div className="min-h-screen flex flex-col bg-[#f5f3ee]">
        <Navbar />

        {/* Hero Section with Background */}
        <div className="bg-gradient-to-r from-[#062f2e] to-[#062f2e]/80 text-white py-20">
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
                  <h2 className="text-3xl font-bold text-[#062f2e] mb-6 flex items-center">
                    <span className="w-12 h-1 bg-[#a08961] inline-block mr-4"></span>
                    Our Mission
                  </h2>
                  <p className="text-lg text-[#062f2e]/70 leading-relaxed mb-4">
                    We're on a mission to democratize access to quality
                    education by providing transparent, comprehensive
                    information and tools that empower students to make
                    confident decisions about their academic futures.
                  </p>
                  <p className="text-lg text-[#062f2e]/70 leading-relaxed">
                    Through innovative technology and expert guidance, we bridge
                    the gap between students and educational institutions,
                    creating pathways to success for everyone.
                  </p>
                </div>

                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-[#062f2e] mb-6 flex items-center">
                    <span className="w-12 h-1 bg-[#a08961] inline-block mr-4"></span>
                    Our Vision
                  </h2>
                  <p className="text-lg text-[#062f2e]/70 leading-relaxed mb-4">
                    We envision a world where every student, regardless of
                    background, has the information and support needed to access
                    educational opportunities that align with their unique goals
                    and potential.
                  </p>
                  <p className="text-lg text-[#062f2e]/70 leading-relaxed">
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
        <section className="py-16 bg-[#f5f3ee]">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#062f2e] mb-12">
                Our Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-[#a08961]/10"
                  >
                    <div className="text-4xl font-bold text-[#062f2e] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[#845c36] font-medium">
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
              <h2 className="text-3xl font-bold text-center text-[#062f2e] mb-10">
                Leadership Team
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreTeam.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#a08961]/10"
                  >
                    <div className="h-96 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        src={member.image}
                        alt={`${member.name}, ${member.role}`}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#062f2e]">
                        {member.name}
                      </h3>
                      <p className="text-[#845c36] font-medium mb-3">
                        {member.role}
                      </p>
                      <div className="flex space-x-3">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#a08961] hover:text-[#062f2e] transition-colors"
                        >
                          <FaLinkedin size={20} />
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
        <section className="py-16 bg-gradient-to-r from-[#062f2e] to-[#062f2e]/80 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Educational Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have found their perfect
              educational match with our platform.
            </p>
            {/* <button className="bg-white text-[#062f2e] font-semibold py-3 px-8 rounded-full hover:bg-[#a08961] hover:text-white transition-colors duration-300 shadow-md">
              Get Started Today
            </button> */}
          </div>
        </section>

        <Footer />
        {/* <Signature /> */}

        {/* Contact Information */}
      </div>
    </FadeWrapper>
  );
};

export default About;
