import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";

interface BookListProps {
  books: {
    _id: string;
    title: string;
    author: string;
    genre: string;
    publicationDate: string;
    rating: number;
  }[];
}

const BookList = ({ books }: BookListProps) => {
  const { status, error } = useSelector((state: RootState) => state.books);
  const { theme } = useTheme();

  if (status === "loading") {
    return <p className="text-center">Loading books...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (books.length === 0) {
    return <p className="text-center">No books found.</p>;
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
        theme === LIGHT_THEME ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
