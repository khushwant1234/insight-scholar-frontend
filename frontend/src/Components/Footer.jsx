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
                to="/careers"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Contact
              </Link>
              <Link
                to="/blog"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Blog
              </Link>
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
                to="/scholarships"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Scholarships
              </Link>
              <Link
                to="/resources"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Study Materials
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
              <Link to="/faq" className="text-[#484848] hover:text-[#D43134C4]">
                FAQ
              </Link>
              <Link
                to="/terms"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-[#484848] hover:text-[#D43134C4]"
              >
                Privacy Policy
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
              © 2024 Your Company. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/terms"
                className="text-sm text-[#484848] hover:text-[#D43134C4]"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-[#484848] hover:text-[#D43134C4]"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-[#484848] hover:text-[#D43134C4]"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
