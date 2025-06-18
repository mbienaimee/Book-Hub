import express from "express";
import Book, { IBook } from "../models/Book";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Public route: Fetch books (no authentication required)
router.get("/", async (req, res) => {
  const { page = 1, limit = 12, search, genre, author, sort } = req.query;
  const query: any = {};
  if (search) {
    query.title = { $regex: search as string, $options: "i" };
  }
  if (genre) {
    query.genre = genre;
  }
  if (author) {
    query.author = author;
  }
  const sortOption: any = {};
  if (sort) {
    const [field, order] = (sort as string).split("-");
    sortOption[field === "date" ? "publicationDate" : field] =
      order === "asc" ? 1 : -1;
  }
  try {
    const books = await Book.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Book.countDocuments(query);
    res.json({ books, total });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Protected routes: Require authentication
router.post("/", authenticate, async (req, res) => {
  const { title, author, isbn, genre, publicationDate, rating } = req.body;
  if (
    !title ||
    !author ||
    !isbn ||
    !genre ||
    !publicationDate ||
    typeof rating !== "number" ||
    rating < 0 ||
    rating > 5
  ) {
    return res.status(400).json({ error: "Invalid book data" });
  }
  try {
    const book: IBook = new Book({
      title,
      author,
      isbn,
      genre,
      publicationDate,
      rating,
    });
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const book = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
