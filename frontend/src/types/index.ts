export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  coverImageUrl: string;
  synopsis: string;
  pages?: number;
  language: string;
  rating: number;
  addedBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface BookState {
  books: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  coverImageUrl?: string;
  coverImage?: File;
  synopsis: string;
  pages?: number;
  language: string;
  rating?: number;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface BooksResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BookResponse {
  book: Book;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface BookSearchParams {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}
