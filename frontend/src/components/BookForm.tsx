import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addBook } from "../store/bookSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

const BookForm = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.books);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationDate: "",
    rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.author ||
      !formData.isbn ||
      !formData.genre ||
      !formData.publicationDate ||
      formData.rating < 0 ||
      formData.rating > 5
    ) {
      return;
    }
    await dispatch(addBook(formData)).finally(() => {
      if (!error) {
        setFormData({
          title: "",
          author: "",
          isbn: "",
          genre: "",
          publicationDate: "",
          rating: 0,
        });
      }
    });
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-lg ${
        theme === LIGHT_THEME ? "bg-white" : "bg-gray-800"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">Add a Book</h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <input
          type="text"
          placeholder="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <input
          type="date"
          value={formData.publicationDate}
          onChange={(e) =>
            setFormData({ ...formData, publicationDate: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: Number(e.target.value) })
          }
          min="0"
          max="5"
          className={`w-full px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
            theme === LIGHT_THEME
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-400 hover:bg-green-500 text-gray-800"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-primary`}
        >
          {status === "loading" ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
