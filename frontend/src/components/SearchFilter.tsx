import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBooks } from "../store/bookSlice";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

interface SearchFilterProps {
  onFilterChange: (filters: {
    search: string;
    genre: string;
    author: string;
    sort: string;
  }) => void;
}

const SearchFilter = ({ onFilterChange }: SearchFilterProps) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { books } = useSelector((state: RootState) => state.books);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    author: "",
    sort: "rating-desc",
  });

  const genres = Array.from(new Set(books.map((b) => b.genre))).sort();
  const authors = Array.from(new Set(books.map((b) => b.author))).sort();

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchBooks({ page: 1, limit: 12, ...filters }));
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-lg mb-8 ${
        theme === LIGHT_THEME ? "bg-white" : "bg-gray-800"
      }`}
    >
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className={`px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <select
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className={`px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={filters.author}
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          className={`px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className={`px-4 py-2 border rounded-md ${
            theme === LIGHT_THEME
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="rating-desc">Rating: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="date-desc">Date: Newest First</option>
          <option value="date-asc">Date: Oldest First</option>
        </select>
      </form>
    </div>
  );
};

export default SearchFilter;
