import mongoose, { Schema } from "mongoose";
import type { IBook } from "../types/index";

const BookSchema: Schema<IBook> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: [
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
      ],
    },
    publicationDate: {
      type: Date,
      required: [true, "Publication date is required"],
    },
    coverImageUrl: {
      type: String,
      required: [true, "Cover image URL is required"],
      default: "/placeholder.svg?height=400&width=300",
    },
    synopsis: {
      type: String,
      required: [true, "Synopsis is required"],
      maxlength: [2000, "Synopsis cannot exceed 2000 characters"],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
        "Please enter a valid ISBN",
      ],
    },
    pages: {
      type: Number,
      min: [1, "Pages must be at least 1"],
      max: [10000, "Pages cannot exceed 10000"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      default: "English",
    },
    publisher: {
      type: String,
      maxlength: [100, "Publisher name cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
BookSchema.index({ title: "text", author: "text", synopsis: "text" });
BookSchema.index({ genre: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ publicationDate: -1 });
BookSchema.index({ rating: -1 });

export default mongoose.model<IBook>("Book", BookSchema);
