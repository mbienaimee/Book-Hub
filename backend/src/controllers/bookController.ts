import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
import Book from "../models/Book";
import type { AuthRequest } from "../middleware/auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to handle Cloudinary upload
const uploadToCloudinary = async (
  file: any,
  folder: string = "books"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path || file.buffer,
      {
        folder: `book-library/${folder}`,
        resource_type: "auto",
        transformation: [
          { width: 400, height: 600, crop: "fill", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const {
      search,
      genre,
      author,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { synopsis: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by genre
    if (genre && genre !== "all") {
      query.genre = genre;
    }

    // Filter by author
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const pageNum = Number.parseInt(page as string);
    const limitNum = Number.parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .populate("addedBy", "username firstName lastName")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBooks: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (error: any) {
    console.error("Get books error:", error);
    res.status(500).json({ message: "Server error while fetching books" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate(
      "addedBy",
      "username firstName lastName avatar"
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ book });
  } catch (error: any) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Server error while fetching book" });
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let coverImageData = {
      url: "/placeholder.svg?height=400&width=300",
      publicId: "",
      cloudinaryUrl: "",
      thumbnailUrl: "",
    };

    // Handle Cloudinary upload if image file is provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file, "covers");
        console.log(uploadResult);

        coverImageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          cloudinaryUrl: uploadResult.secure_url,
          thumbnailUrl: cloudinary.url(uploadResult.public_id, {
            width: 150,
            height: 200,
            crop: "fill",
            quality: "auto",
            secure: true,
          }),
        };
        console.log(coverImageData);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading cover image",
        });
      }
    }

    const bookData = {
      ...req.body,
      coverImageUrl: coverImageData.url,
      addedBy: req.user!._id,
    };

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id).populate(
      "addedBy",
      "username firstName lastName"
    );

    res.status(201).json({
      message: "Book created successfully",
      book: populatedBook,
    });
  } catch (error: any) {
    console.error("Create book error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `A book with this ${field} already exists`,
      });
    }

    res.status(500).json({ message: "Server error while creating book" });
    console.log(error);
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check authorization
    if (book.addedBy.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this book",
      });
    }

    let updateData = { ...req.body };

    // Handle new cover image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if ((book as any).coverImageUrl?.publicId) {
          await deleteFromCloudinary((book as any).coverImageUrl.publicId);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file, "covers");

        updateData.coverImageUrl = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          cloudinaryUrl: uploadResult.secure_url,
          thumbnailUrl: cloudinary.url(uploadResult.public_id, {
            width: 150,
            height: 200,
            crop: "fill",
            quality: "auto",
            secure: true,
          }),
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading cover image",
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("addedBy", "username firstName lastName");

    res.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error: any) {
    console.error("Update book error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `A book with this ${field} already exists`,
      });
    }

    res.status(500).json({ message: "Server error while updating book" });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check authorization
    if (book.addedBy.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this book",
      });
    }

    // Delete cover image from Cloudinary if exists
    if ((book as any).coverImageUrl?.publicId) {
      try {
        await deleteFromCloudinary((book as any).coverImageUrl.publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with book deletion even if image deletion fails
      }
    }

    await Book.findByIdAndDelete(id);

    res.json({ message: "Book deleted successfully" });
  } catch (error: any) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Server error while deleting book" });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Book.distinct("genre");
    res.json({ genres });
  } catch (error: any) {
    console.error("Get genres error:", error);
    res.status(500).json({ message: "Server error while fetching genres" });
  }
};
