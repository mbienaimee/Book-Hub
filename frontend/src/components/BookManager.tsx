import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchBooks, deleteBook } from "../store/bookSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import BookForm from "./BookForm";
import { Navigate } from "react-router-dom";

const BookManager: React.FC = () => {
  const { books, status, error } = useSelector(
    (state: RootState) => state.books
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  // Redirect non-admins or unauthenticated users to login
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  // Fetch books on mount
  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Calculate rating statistics
  const positiveCount = books.filter((book) => book.rating > 3).length;
  const negativeSum = books.reduce((sum, book) => {
    return book.rating < 0 ? sum + book.rating : sum;
  }, 0);

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Manage Books</h2>
        <p className="text-center text-sm mb-4">
          Books with rating &gt; 3: {positiveCount}, Sum of negative ratings:{" "}
          {negativeSum}
        </p>
        {status === "loading" && (
          <p className="text-center text-gray-500">Loading books...</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center">Error: {error}</p>
        )}
        <BookForm />
        <ul className="mt-8 space-y-4">
          {books.map((book) => (
            <li
              key={book._id}
              className={`flex justify-between items-center p-4 rounded-md shadow-md ${
                theme === LIGHT_THEME ? "bg-white" : "bg-gray-800"
              }`}
            >
              <div>
                <span className="font-semibold">{book.title}</span> by{" "}
                {book.author} (Genre: {book.genre}, Rating: {book.rating})
              </div>
              <button
                onClick={() => dispatch(deleteBook(book._id))}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 hover:shadow-md transition-shadow"
                disabled={status === "loading"}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookManager;
