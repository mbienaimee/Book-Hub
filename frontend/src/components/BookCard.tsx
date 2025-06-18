import React from "react";
import { useTheme } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/theme";
import { Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  rating: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { theme } = useTheme();

  return (
    <Link
      to={`/book/${book._id}`}
      className={`p-4 rounded-lg shadow-md card-hover ${
        theme === LIGHT_THEME ? "bg-white" : "bg-gray-800"
      }`}
    >
      <h3 className="text-lg font-semibold truncate">{book.title}</h3>
      <p className="text-sm text-gray-500">by {book.author}</p>
      <p className="text-sm">Genre: {book.genre}</p>
      <p className="text-sm">
        Published: {new Date(book.publicationDate).toLocaleDateString()}
      </p>
      <p className="text-sm font-bold">Rating: {book.rating}/5</p>
    </Link>
  );
};

export default BookCard;
