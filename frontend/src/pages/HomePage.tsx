"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBooks, deleteBook } from "../store/slices/bookSlice";
import BookCard from "../components/Books/BookCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, isLoading, pagination } = useAppSelector(
    (state) => state.books
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const params = {
      search: searchQuery,
      genre: selectedGenre,
      page: 1,
      limit: 12,
    };
    dispatch(fetchBooks(params));
  }, [dispatch, searchQuery, selectedGenre]);

  useEffect(() => {
    const uniqueGenres = Array.from(
      new Set(books.map((book) => book.genre))
    ).sort();
    setGenres(uniqueGenres);
  }, [books]);

  const handleDeleteBook = (bookId: string): void => {
    dispatch(deleteBook(bookId));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (genre: string): void => {
    setSelectedGenre(genre);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-primary-800 mb-6">
              Best Books
              <span className="block text-3xl lg:text-5xl text-secondary-600 mt-2">
                of the Month
              </span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-8">
              Discover extraordinary stories, connect with fellow readers, and
              build your personal digital library.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search books by title, author, or synopsis..."
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              <button
                onClick={() => handleGenreChange("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedGenre === ""
                    ? "bg-primary-600 text-white"
                    : "bg-white/80 text-secondary-700 hover:bg-primary-50"
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedGenre === genre
                      ? "bg-primary-600 text-white"
                      : "bg-white/80 text-secondary-700 hover:bg-primary-50"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary-800 mb-2">
              Literary Collection
            </h2>
            <p className="text-secondary-600">
              {pagination.totalBooks} books found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedGenre && ` in ${selectedGenre}`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-secondary-600 mb-2">
                No books found
              </h3>
              <p className="text-secondary-500 mb-6">
                {searchQuery || selectedGenre
                  ? "Try adjusting your search or filters"
                  : "Be the first to add a book to our collection!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
