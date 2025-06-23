import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { signup } from "../store/authSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(signup(formData)).finally(() => {
      if (!error) {
        navigate("/login");
      }
    });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div
        className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl ${
          theme === LIGHT_THEME ? "bg-white" : "bg-gray-800"
        }`}
      >
        <h2 className="text-center text-3xl font-bold">Admin Signup</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                  theme === LIGHT_THEME
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                  theme === LIGHT_THEME
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              theme === LIGHT_THEME
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-400 hover:bg-green-500 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-primary`}
          >
            {status === "loading" ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-500 hover:text-indigo-400 font-semibold"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
