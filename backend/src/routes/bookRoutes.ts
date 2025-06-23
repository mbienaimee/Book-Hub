import { Router } from "express";
import { body } from "express-validator";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGenres,
} from "../controllers/bookController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../config/cloudinary";

const router = Router();

// Public routes
router.get("/test", (req, res) => {
  console.log("📋 Test route hit!");
  res.json({ message: "Book routes are working!" });
});

router.get("/", getBooks);
router.get("/genres", getGenres);
router.get("/:id", getBookById);

// Protected routes
router.post(
  "/",
  authenticateToken,
  upload.single("coverImage"),
  [
    body("title").notEmpty().trim().withMessage("Title is required"),
    body("author").notEmpty().trim().withMessage("Author is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
    body("publicationDate")
      .isISO8601()
      .withMessage("Valid publication date is required"),
    body("synopsis").notEmpty().trim().withMessage("Synopsis is required"),
    body("language").optional().trim(),
    body("pages")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Pages must be a positive number"),
    body("publisher").optional().trim(),
    body("isbn").optional().trim(),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5"),
  ],
  createBook
);

router.put(
  "/:id",
  authenticateToken,
  upload.single("coverImage"),
  [
    body("title")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Title cannot be empty"),
    body("author")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Author cannot be empty"),
    body("genre").optional().notEmpty().withMessage("Genre cannot be empty"),
    body("publicationDate")
      .optional()
      .isISO8601()
      .withMessage("Valid publication date is required"),
    body("synopsis")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Synopsis cannot be empty"),
    body("language").optional().trim(),
    body("pages")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Pages must be a positive number"),
    body("publisher").optional().trim(),
    body("isbn").optional().trim(),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5"),
  ],
  updateBook
);

router.delete("/:id", authenticateToken, deleteBook);

export default router;
