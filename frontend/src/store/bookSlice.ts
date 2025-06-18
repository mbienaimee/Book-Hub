import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import axios from "../utils/axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationDate: string;
  rating: number;
}

interface BookState {
  books: Book[];
  total: number;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: BookState = {
  books: [],
  total: 0,
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (
    params: {
      page: number;
      limit: number;
      search?: string;
      genre?: string;
      author?: string;
      sort?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Explicitly ensure no auth header
      const response = await axios.get("/api/books", {
        params,
        headers: { Authorization: undefined }, // Prevent any auth header
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch books"
      );
    }
  }
);

export const addBook = createAsyncThunk(
  "books/addBook",
  async (
    book: {
      title: string;
      author: string;
      isbn: string;
      genre: string;
      publicationDate: string;
      rating: number;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const response = await axios.post("/api/books", book, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to add book");
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (
    { id, book }: { id: string; book: Partial<Book> },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const response = await axios.put(`/api/books/${id}`, book, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update book"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const response = await axios.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete book"
      );
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.books = action.payload.books;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default bookSlice.reducer;
