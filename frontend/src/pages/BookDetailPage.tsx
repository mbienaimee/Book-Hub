"use client";

import type React from "react";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Star,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBookById,
  deleteBook,
  clearCurrentBook,
} from "../store/slices/bookSlice";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentBook, isLoading, error } = useAppSelector(
    (state) => state.books
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }

    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id]);

  const handleDelete = async (): Promise<void> => {
    if (
      currentBook &&
      window.confirm("Are you sure you want to delete this book?")
    ) {
      try {
        await dispatch(deleteBook(currentBook._id)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canEdit = user && currentBook && currentBook.addedBy._id === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !currentBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-secondary-600 mb-2">
            Book Not Found
          </h2>
          <p className="text-secondary-500 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <div className="aspect-[3/4] relative mb-6 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg overflow-hidden">
                <img
                  src={
                    currentBook.coverImageUrl ||
                    "/placeholder.svg?height=600&width=400"
                  }
                  alt={currentBook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=600&width=400";
                  }}
                />
                {currentBook.rating > 0 && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-secondary-800">
                      {currentBook.rating}
                    </span>
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="flex gap-3">
                  <Link
                    to={`/books/${currentBook._id}/edit`}
                    className="flex-1 btn-secondary text-center"
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    Edit Book
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                    {currentBook.genre}
                  </span>
                  {currentBook.language && (
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm font-medium rounded-full">
                      {currentBook.language}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-serif font-bold text-primary-800 mb-3">
                  {currentBook.title}
                </h1>
                <p className="text-xl text-secondary-600 mb-4">
                  by {currentBook.author}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Published {formatDate(currentBook.publicationDate)}
                    </span>
                  </div>

                  {currentBook.pages && (
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{currentBook.pages} pages</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>
                      Added by {currentBook.addedBy.firstName}{" "}
                      {currentBook.addedBy.lastName}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
                  Synopsis
                </h2>
                <div className="prose prose-secondary max-w-none">
                  <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                    {currentBook.synopsis}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary-200">
                <p className="text-sm text-secondary-500">
                  Added on {formatDate(currentBook.createdAt)}
                  {currentBook.updatedAt !== currentBook.createdAt && (
                    <span>
                      {" "}
                      • Last updated {formatDate(currentBook.updatedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
