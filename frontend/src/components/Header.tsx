import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header
      className={`sticky top-0 z-50 py-4 ${
        theme === LIGHT_THEME
          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
          : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200"
      }`}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-2xl font-bold hover:text-yellow-300 transition"
        >
          Book Hub
        </NavLink>
        <button
          className="md:hidden text-2xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
        <ul
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:space-x-6 items-center absolute md:static top-16 left-0 w-full md:w-auto p-4 md:p-0 ${
            theme === LIGHT_THEME ? "bg-blue-600" : "bg-gray-800"
          } md:bg-transparent`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 text-sm ${
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                } transition`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block py-2 text-sm ${
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                } transition`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block py-2 text-sm ${
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                } transition`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
          </li>
          {isAuthenticated && user?.role === "admin" && (
            <li>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `block py-2 text-sm ${
                    isActive ? "text-yellow-300" : "hover:text-yellow-300"
                  } transition`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Books
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <button
                onClick={() => {
                  dispatch(logout());
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm hover:text-yellow-300 transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block py-2 text-sm ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    } transition`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `block py-2 text-sm ${
                      isActive ? "text-yellow-300" : "hover:text-yellow-300"
                    } transition`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </NavLink>
              </li>
            </>
          )}
          <li>
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 ${
                theme === LIGHT_THEME
                  ? "bg-white text-blue-600"
                  : "bg-gray-700 text-green-400"
              }`}
            >
              {theme === LIGHT_THEME ? "Dark" : "Light"} Mode
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
