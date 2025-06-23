"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowLeft, Upload, X, BookOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBookById,
  updateBook,
  clearCurrentBook,
} from "../store/slices/bookSlice";
import type { BookFormData } from "../types";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const genres = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Self-Help",
  "Dystopian",
  "Adventure",
  "Horror",
  "Poetry",
  "Drama",
];

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentBook, isLoading } = useAppSelector((state) => state.books);
  const { user } = useAppSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookFormData>();

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }

    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBook) {
      // Check if user owns this book
      if (!user || currentBook.addedBy._id !== user.id) {
        navigate("/");
        return;
      }

      // Format the date for the input field
      const formattedDate = new Date(currentBook.publicationDate)
        .toISOString()
        .split("T")[0];

      reset({
        title: currentBook.title,
        author: currentBook.author,
        genre: currentBook.genre,
        publicationDate: formattedDate,
        synopsis: currentBook.synopsis,
        pages: currentBook.pages,
        language: currentBook.language,
        rating: currentBook.rating,
      });

      setImagePreview(currentBook.coverImageUrl);
    }
  }, [currentBook, reset, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setSelectedImage(null);
    setImagePreview(currentBook?.coverImageUrl || "");
  };

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    if (!currentBook || !id) return;

    setIsSubmitting(true);
    try {
      const formData: BookFormData = {
        ...data,
        pages: data.pages ? Number(data.pages) : undefined,
        rating: data.rating ? Number(data.rating) : 0,
      };

      if (selectedImage) {
        formData.coverImage = selectedImage;
      }

      await dispatch(updateBook({ id, bookData: formData })).unwrap();
      navigate(`/books/${id}`);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-secondary-600 mb-2">
            Book Not Found
          </h2>
          <p className="text-secondary-500 mb-6">
            The book you're trying to edit doesn't exist or has been removed.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/books/${id}`)}
            className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Book Details</span>
          </button>
          <h1 className="text-3xl font-serif font-bold text-primary-800">
            Edit Book
          </h1>
          <p className="text-secondary-600 mt-2">
            Update the details of "{currentBook.title}"
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-4">
                Book Cover
              </label>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Book cover preview"
                        className="w-32 h-48 object-cover rounded-lg border border-secondary-200"
                      />
                      {selectedImage && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-48 border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center bg-secondary-50">
                      <Upload className="w-8 h-8 text-secondary-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="text-xs text-secondary-500 mt-2">
                    Upload a new book cover image (JPG, PNG, WebP). Leave empty
                    to keep current image.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  className={`input-field ${
                    errors.title ? "border-red-300" : ""
                  }`}
                  placeholder="Enter book title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("author", { required: "Author is required" })}
                  type="text"
                  className={`input-field ${
                    errors.author ? "border-red-300" : ""
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.author.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("genre", { required: "Genre is required" })}
                  className={`input-field ${
                    errors.genre ? "border-red-300" : ""
                  }`}
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.genre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Publication Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("publicationDate", {
                    required: "Publication date is required",
                  })}
                  type="date"
                  className={`input-field ${
                    errors.publicationDate ? "border-red-300" : ""
                  }`}
                />
                {errors.publicationDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.publicationDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Language
                </label>
                <input
                  {...register("language")}
                  type="text"
                  className="input-field"
                  placeholder="e.g., English"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Pages
                </label>
                <input
                  {...register("pages", {
                    min: { value: 1, message: "Pages must be at least 1" },
                    max: { value: 10000, message: "Pages cannot exceed 10000" },
                  })}
                  type="number"
                  className={`input-field ${
                    errors.pages ? "border-red-300" : ""
                  }`}
                  placeholder="Number of pages"
                />
                {errors.pages && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pages.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Rating
                </label>
                <select
                  {...register("rating", {
                    min: { value: 0, message: "Rating cannot be less than 0" },
                    max: { value: 5, message: "Rating cannot exceed 5" },
                  })}
                  className="input-field"
                >
                  <option value="0">No Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Synopsis <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("synopsis", {
                  required: "Synopsis is required",
                  maxLength: {
                    value: 2000,
                    message: "Synopsis cannot exceed 2000 characters",
                  },
                })}
                rows={6}
                className={`input-field resize-none ${
                  errors.synopsis ? "border-red-300" : ""
                }`}
                placeholder="Write a brief description of the book..."
              />
              {errors.synopsis && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.synopsis.message}
                </p>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                {watch("synopsis")?.length || 0}/2000 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/books/${id}`)}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner
                      size="small"
                      className="border-white border-t-transparent"
                    />
                    <span>Updating Book...</span>
                  </>
                ) : (
                  <span>Update Book</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
