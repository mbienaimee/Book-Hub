import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Export the types that other modules need
export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
  token?: string;
}

interface AuthError extends Error {
  name: string;
  message: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      res.status(401).json({
        message: "Access token required",
        error: "MISSING_TOKEN",
      });
      return;
    }

    // Verify JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      res.status(500).json({
        message: "Server configuration error",
      });
      return;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: process.env.JWT_ISSUER || "your-app-name",
      audience: process.env.JWT_AUDIENCE || "your-app-users",
    }) as JWTPayload;

    // Validate payload structure
    if (!decoded.userId || typeof decoded.userId !== "string") {
      res.status(401).json({
        message: "Invalid token payload",
        error: "INVALID_PAYLOAD",
      });
      return;
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId)
      .select("-password -__v")
      .lean(); // Use lean() for better performance when you don't need mongoose document methods

    if (!user) {
      res.status(401).json({
        message: "User not found",
        error: "USER_NOT_FOUND",
      });
      return;
    }

    // Check if user account is active (optional - depends on your user model)
    if (user.status && user.status !== "active") {
      res.status(403).json({
        message: "Account is not active",
        error: "ACCOUNT_INACTIVE",
      });
      return;
    }

    // Check if user is not deleted (soft delete check)
    if (user.deletedAt) {
      res.status(401).json({
        message: "User account no longer exists",
        error: "USER_DELETED",
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id.toString();
    req.token = token;

    next();
  } catch (error: any) {
    console.error("Authentication error:", error);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token has expired",
        error: "TOKEN_EXPIRED",
      });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        message: "Invalid token",
        error: "INVALID_TOKEN",
      });
      return;
    }

    if (error.name === "NotBeforeError") {
      res.status(401).json({
        message: "Token not active yet",
        error: "TOKEN_NOT_ACTIVE",
      });
      return;
    }

    // Handle database errors
    if (error.name === "CastError") {
      res.status(401).json({
        message: "Invalid user ID in token",
        error: "INVALID_USER_ID",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      message: "Authentication service error",
      error: "AUTH_SERVICE_ERROR",
    });
  }
};

// Optional middleware for endpoints that work with or without authentication
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret, {
        issuer: process.env.JWT_ISSUER || "your-app-name",
        audience: process.env.JWT_AUDIENCE || "your-app-users",
      }) as JWTPayload;

      if (decoded.userId && typeof decoded.userId === "string") {
        const user = await User.findById(decoded.userId)
          .select("-password -__v")
          .lean();

        if (
          user &&
          (!user.status || user.status === "active") &&
          !user.deletedAt
        ) {
          req.user = user;
          req.userId = user._id.toString();
          req.token = token;
        }
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
      console.warn("Optional auth failed:", error);
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
};

// Middleware to check for specific roles
export const requireRole = (roles: string | string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
          error: "AUTH_REQUIRED",
        });
        return;
      }

      const userRoles = Array.isArray(req.user.roles)
        ? req.user.roles
        : [req.user.role];
      const requiredRoles = Array.isArray(roles) ? roles : [roles];

      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        res.status(403).json({
          message: "Insufficient permissions",
          error: "INSUFFICIENT_PERMISSIONS",
          required: requiredRoles,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({
        message: "Authorization service error",
        error: "AUTH_SERVICE_ERROR",
      });
    }
  };
};

// Middleware to check if user owns the resource
export const requireOwnership = (resourceIdParam: string = "id") => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
          error: "AUTH_REQUIRED",
        });
        return;
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user._id.toString();

      if (resourceId !== userId) {
        // Check if user has admin role (optional)
        const userRoles = Array.isArray(req.user.roles)
          ? req.user.roles
          : [req.user.role];
        const isAdmin =
          userRoles.includes("admin") || userRoles.includes("superadmin");

        if (!isAdmin) {
          res.status(403).json({
            message: "Access denied - you can only access your own resources",
            error: "OWNERSHIP_REQUIRED",
          });
          return;
        }
      }

      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      res.status(500).json({
        message: "Authorization service error",
        error: "AUTH_SERVICE_ERROR",
      });
    }
  };
};

// Rate limiting middleware for authentication endpoints
export const authRateLimit = (
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const clientId = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of attempts.entries()) {
      if (now > value.resetTime) {
        attempts.delete(key);
      }
    }

    const clientAttempts = attempts.get(clientId);

    if (!clientAttempts) {
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (now > clientAttempts.resetTime) {
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (clientAttempts.count >= maxAttempts) {
      res.status(429).json({
        message: "Too many authentication attempts. Please try again later.",
        error: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil((clientAttempts.resetTime - now) / 1000),
      });
      return;
    }

    clientAttempts.count++;
    next();
  };
};
