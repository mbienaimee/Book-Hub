import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { booksAPI } from "../../services/api";
import toast from "react-hot-toast";
import type {
  BookState,
  Book,
  BookFormData,
  BookSearchParams,
  BooksResponse,
  BookResponse,
} from "../../types";

const initialState: BookState = {
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
  },
};

export const fetchBooks = createAsyncThunk<
  BooksResponse,
  BookSearchParams,
  { rejectValue: string }
>("books/fetchBooks", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await booksAPI.getBooks(params);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch books";
    return rejectWithValue(message);
  }
});

export const fetchBookById = createAsyncThunk<
  Book,
  string,
  { rejectValue: string }
>("books/fetchBookById", async (id, { rejectWithValue }) => {
  try {
    const response = await booksAPI.getBookById(id);
    const bookResponse: BookResponse = response.data;
    return bookResponse.book;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch book";
    return rejectWithValue(message);
  }
});

export const createBook = createAsyncThunk<
  Book,
  BookFormData,
  { rejectValue: string }
>("books/createBook", async (bookData, { rejectWithValue }) => {
  try {
    const response = await booksAPI.createBook(bookData);
    toast.success("Book added successfully!");
    return response.data.book;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to create book";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const updateBook = createAsyncThunk<
  Book,
  { id: string; bookData: BookFormData },
  { rejectValue: string }
>("books/updateBook", async ({ id, bookData }, { rejectWithValue }) => {
  try {
    const response = await booksAPI.updateBook(id, bookData);
    toast.success("Book updated successfully!");
    return response.data.book;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update book";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const deleteBook = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("books/deleteBook", async (id, { rejectWithValue }) => {
  try {
    await booksAPI.deleteBook(id);
    toast.success("Book deleted successfully!");
    return id;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete book";
    toast.error(message);
    return rejectWithValue(message);
  }
});

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchBooks.fulfilled,
        (state, action: PayloadAction<BooksResponse>) => {
          state.isLoading = false;
          state.books = action.payload.books;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch books";
      })
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchBookById.fulfilled,
        (state, action: PayloadAction<Book>) => {
          state.isLoading = false;
          state.currentBook = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch book";
      })
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.isLoading = false;
        state.books.unshift(action.payload);
        state.error = null;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create book";
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        const index = state.books.findIndex(
          (book) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook?._id === action.payload._id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
        if (state.currentBook?._id === action.payload) {
          state.currentBook = null;
        }
      });
  },
});

export const { clearCurrentBook, clearError } = bookSlice.actions;
export default bookSlice.reducer;
