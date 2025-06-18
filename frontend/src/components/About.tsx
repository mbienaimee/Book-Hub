import React from "react";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

const About = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">About Book Hub</h2>
        <p className="text-lg mb-6">
          Book Hub is a platform for book lovers to discover and manage their
          favorite titles. Built with React and TypeScript, it offers a seamless
          and responsive experience for browsing books by genre, author, or
          publication date.
        </p>
        <p className="text-lg">
          Our mission is to make book discovery intuitive and enjoyable, with
          features like search, filtering, and sorting, all backed by a robust
          backend API.
        </p>
      </div>
    </div>
  );
};

export default About;
