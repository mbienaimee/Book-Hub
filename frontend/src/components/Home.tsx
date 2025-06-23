import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBooks } from "../store/bookSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import SearchFilter from "./SearchFilter";
import BookList from "./BookList";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { books, total, status, error } = useSelector(
    (state: RootState) => state.books
  );
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    author: "",
    sort: "rating-desc",
  });
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    dispatch(fetchBooks({ page, limit, ...filters }));
  }, [dispatch, page, filters]);

  const handleFilterChange = (newFilters: {
    search: string;
    genre: string;
    author: string;
    sort: string;
  }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
          Discover Books
        </h1>
        <SearchFilter onFilterChange={handleFilterChange} />
        {status === "loading" && (
          <p className="text-center text-gray-500">Loading books...</p>
        )}
        {status === "failed" && error && !error.includes("Unauthorized") && (
          <p className="text-red-500 text-center mb-4">
            Error loading books: {error}
          </p>
        )}
        {status === "idle" && books.length === 0 && !error && (
          <p className="text-center text-gray-500">No books found.</p>
        )}
        <BookList books={books} />
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || status === "loading"}
              className={`px-4 py-2 rounded-md ${
                theme === LIGHT_THEME
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-green-400 text-gray-800 hover:bg-green-500"
              } disabled:bg-gray-400`}
            >
              Previous
            </button>
            <span className="py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || status === "loading"}
              className={`px-4 py-2 rounded-md ${
                theme === LIGHT_THEME
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-green-400 text-gray-800 hover:bg-green-500"
              } disabled:bg-gray-400`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
