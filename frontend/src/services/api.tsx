import axios, { type AxiosResponse } from "axios";
import type {
  LoginCredentials,
  RegisterData,
  BookFormData,
  BookSearchParams,
  AuthResponse,
  BooksResponse,
  BookResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", credentials),
  register: (userData: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", userData),
};

// Books API
export const booksAPI = {
  getBooks: (params: BookSearchParams): Promise<AxiosResponse<BooksResponse>> =>
    api.get("/books", { params }),
  getBookById: (id: string): Promise<AxiosResponse<BookResponse>> =>
    api.get(`/books/${id}`),
  createBook: (
    bookData: BookFormData
  ): Promise<AxiosResponse<{ book: any; message: string }>> => {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      const value = bookData[key as keyof BookFormData];
      if (key === "coverImageUrl" && value instanceof File) {
        formData.append("coverImageUrl", value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return api.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateBook: (
    id: string,
    bookData: BookFormData
  ): Promise<AxiosResponse<{ book: any; message: string }>> => {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      const value = bookData[key as keyof BookFormData];
      if (key === "coverImageUrl" && value instanceof File) {
        formData.append("coverImageUrl", value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return api.put(`/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteBook: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/books/${id}`),
  getGenres: (): Promise<AxiosResponse<{ genres: string[] }>> =>
    api.get("/books/genres"),
};

export default api;
