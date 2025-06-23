import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

const Contact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        {submitted && (
          <p className="text-green-500 text-center mb-4">
            Message sent! (Mock response)
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md ${
              theme === LIGHT_THEME
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-600 bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-md ${
              theme === LIGHT_THEME
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-600 bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-md ${
              theme === LIGHT_THEME
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-600 bg-gray-700 text-white"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none`}
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              theme === LIGHT_THEME
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-400 hover:bg-green-500 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-primary`}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
