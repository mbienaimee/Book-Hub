"use client";

import type React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Star, Eye, Edit, Trash2 } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import type { Book } from "../../types";

interface BookCardProps {
  book: Book;
  onDelete?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  const { user } = useAppSelector((state) => state.auth);
  const canEdit = user && book.addedBy._id === user.id;

  const formatDate = (dateString: string): number => {
    return new Date(dateString).getFullYear();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this book?")
    ) {
      onDelete(book._id);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder.svg?height=400&width=300";
  };

  return (
    <div className="card group hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
          <img
            src={book.coverImageUrl || "/placeholder.svg?height=400&width=300"}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        </div>

        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary-600/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {book.genre}
          </span>
        </div>

        {book.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-secondary-800">
              {book.rating}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-serif font-semibold text-lg text-primary-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {book.title}
          </h3>

          <p className="text-secondary-600 font-medium mb-2">
            by {book.author}
          </p>

          <p className="text-secondary-500 text-sm line-clamp-3 mb-3">
            {book.synopsis}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-secondary-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Published {formatDate(book.publicationDate)}</span>
          </div>

          <div className="flex items-center text-xs text-secondary-500">
            <User className="w-3 h-3 mr-1" />
            <span>
              Added by {book.addedBy.firstName} {book.addedBy.lastName}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/books/${book._id}`}
            className="flex-1 flex items-center justify-center space-x-2 btn-secondary text-sm py-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>

          {canEdit && (
            <div className="flex gap-2">
              <Link
                to={`/books/${book._id}/edit`}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                title="Edit Book"
              >
                <Edit className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete Book"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
