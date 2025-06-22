import type { Request } from "express";
import type { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status?: "active" | "inactive";
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  publicationDate: Date;
  coverImageUrl: string;
  synopsis: string;
  isbn?: string;
  pages?: number;
  language: string;
  publisher?: string;
  rating: number;
  addedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface BookCreateData {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  synopsis: string;
  coverImageUrl?: string;
  isbn?: string;
  pages?: number;
  language?: string;
  publisher?: string;
  rating?: number;
}

export interface BookUpdateData extends Partial<BookCreateData> {}

export interface BookQuery {
  search?: string;
  genre?: string;
  author?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface BooksResponse {
  books: IBook[];
  pagination: PaginationResult;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: ValidationError[];
}

import type mongoose from "mongoose";
