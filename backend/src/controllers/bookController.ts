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
    const uploadOptions = {
      folder: `book-library/${folder}`,
      resource_type: "auto" as const,
      transformation: [
        { width: 400, height: 600, crop: "fill", quality: "auto" },
      ],
    };

    // Handle different file input types
    if (file.path) {
      // File from multer disk storage
      cloudinary.uploader.upload(file.path, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    } else if (file.buffer) {
      // File from multer memory storage
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    } else {
      reject(new Error("Invalid file format"));
    }
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

    // Default cover image URL - using a simple placeholder
    let coverImageUrl = "/placeholder.svg?height=400&width=300";

    // Handle Cloudinary upload if image file is provided
    if (req.file) {
      try {
        console.log("File received:", {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          hasPath: !!req.file.path,
          hasBuffer: !!req.file.buffer,
        });

        const uploadResult = await uploadToCloudinary(req.file, "covers");
        console.log("Upload successful:", uploadResult);

        // Use the secure URL directly
        coverImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading cover image",
          error: uploadError,
        });
      }
    }

    // Create book data with the image URL
    const bookData = {
      ...req.body,
      coverImageUrl: coverImageUrl, // Store as simple string
      addedBy: req.user!._id,
    };

    console.log("Creating book with data:", bookData);

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
        // Note: If you want to delete old images, you'll need to store the public_id
        // For now, just upload the new image
        const uploadResult = await uploadToCloudinary(req.file, "covers");
        updateData.coverImageUrl = uploadResult.secure_url;
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

    // Note: If you want to delete images from Cloudinary,
    // you'll need to extract the public_id from the URL
    // For now, just delete the book record

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
