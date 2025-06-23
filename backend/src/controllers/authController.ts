import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";
import type { AuthRequest } from "../middleware/auth";
import type { Document, Types } from "mongoose";

interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

// Extended user interface to include optional fields
interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  status?: string;
  lastLoginAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

interface AuthResponse {
  message: string;
  token: string;
  user: UserResponse;
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
    issuer: process.env.JWT_ISSUER || "your-app-name",
    audience: process.env.JWT_AUDIENCE || "your-app-users",
  });
};

const formatUserResponse = (user: IUserDocument): UserResponse => {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar || undefined,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { email, password, username, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      const isEmailTaken =
        existingUser.email.toLowerCase() === email.toLowerCase();
      res.status(409).json({
        message: isEmailTaken
          ? "Email already registered"
          : "Username already taken",
        field: isEmailTaken ? "email" : "username",
      });
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      username: username.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    const savedUser = (await user.save()) as IUserDocument;
    const token = generateToken(savedUser._id.toString());

    const response: AuthResponse = {
      message: "User registered successfully",
      token,
      user: formatUserResponse(savedUser),
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle specific MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(409).json({
        message: `${field} already exists`,
        field,
      });
      return;
    }

    res.status(500).json({
      message: "Internal server error during registration",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email (case insensitive)
    const user = (await User.findOne({
      email: email.toLowerCase(),
    }).select("+password")) as IUserDocument | null; // Ensure password is included if it's excluded by default

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Check if user account is active (if you have user status)
    if (user.status && user.status !== "active") {
      res.status(403).json({
        message: "Account is not active",
      });
      return;
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Update last login timestamp (optional)
    if (user.lastLoginAt !== undefined) {
      user.lastLoginAt = new Date();
      await user.save();
    }

    const token = generateToken(user._id.toString());

    const response: AuthResponse = {
      message: "Login successful",
      token,
      user: formatUserResponse(user),
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error during login",
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    // Optionally fetch fresh user data from database
    const currentUser = (await User.findById(user._id)) as IUserDocument | null;
    if (!currentUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: formatUserResponse(currentUser),
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { firstName, lastName, avatar } = req.body;

    const updatedUser = (await User.findByIdAndUpdate(
      user._id,
      {
        ...(firstName && { firstName: firstName.trim() }),
        ...(lastName && { lastName: lastName.trim() }),
        ...(avatar && { avatar }),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )) as IUserDocument | null;

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const currentUser = (await User.findById(user._id).select(
      "+password"
    )) as IUserDocument | null;
    if (!currentUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isValidPassword = await currentUser.comparePassword(currentPassword);
    if (!isValidPassword) {
      res.status(400).json({
        message: "Current password is incorrect",
      });
      return;
    }

    // Update password
    currentUser.password = newPassword;
    await currentUser.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // If you're implementing token blacklisting, add the token to blacklist here
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // await TokenBlacklist.create({ token });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
