import React from "react";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`py-8 px-6 mt-12 ${
        theme === LIGHT_THEME
          ? "bg-gradient-to-t from-blue-600 to-indigo-700 text-white"
          : "bg-gradient-to-t from-gray-800 to-gray-900 text-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-4">Book Hub</h3>
          <p className="text-sm">
            Discover and manage your favorite books with ease.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className="hover:text-yellow-300 transition">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-yellow-300 transition">
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="hover:text-yellow-300 transition"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-sm">Email: support@bookhub.com</p>
          <p className="text-sm">Phone: +1-800-BOOK-HUB</p>
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        © {new Date().getFullYear()} Book Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
