import { Router } from "express";
import { body } from "express-validator";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Register route
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("username")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("firstName").notEmpty().trim().withMessage("First name is required"),
    body("lastName").notEmpty().trim().withMessage("Last name is required"),
  ],
  register
);

// Login route
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// Get profile route
router.get("/profile", authenticateToken, getProfile);

export default router;
