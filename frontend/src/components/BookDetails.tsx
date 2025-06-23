import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBooks } from "../store/bookSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { books, status, error } = useSelector(
    (state: RootState) => state.books
  );
  const { theme } = useTheme();
  const book = books.find((b) => b._id === id);

  useEffect(() => {
    if (!book) {
      dispatch(fetchBooks({ page: 1, limit: 12 }));
    }
  }, [dispatch, book, id]);

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!book) {
    return <p className="text-center">Book not found.</p>;
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-indigo-500 hover:text-indigo-400"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
        <p className="text-lg mb-2">Author: {book.author}</p>
        <p className="text-lg mb-2">Genre: {book.genre}</p>
        <p className="text-lg mb-2">
          Published: {new Date(book.publicationDate).toLocaleDateString()}
        </p>
        <p className="text-lg mb-2">ISBN: {book.isbn}</p>
        <p className="text-lg font-bold">Rating: {book.rating}/5</p>
      </div>
    </div>
  );
};

export default BookDetails;
