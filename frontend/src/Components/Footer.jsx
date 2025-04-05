import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#D43134C4]/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#484848]">Company</h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/about"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-[#484848] hover:text-[#D43134C4]"
              ></Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#484848]">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/mentors"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Find a Mentor
              </Link>
              <Link
                to="/colleges"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                College Directory
              </Link>
              <Link
                to="/compare-colleges"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Compare-Colleges
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#484848]">Support</h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/help"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Help Center
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#484848]">Connect</h3>
            <div className="flex flex-col space-y-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[#D43134C4]/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#484848] text-sm">
              © 2024 Insight Scholar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
