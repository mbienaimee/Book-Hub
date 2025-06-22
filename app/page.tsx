"use client";

import { useState } from "react";
import { SearchBar } from "@/components/book/search-bar";
import { FilterSidebar } from "@/components/book/filter-sidebar";
import { BookCard } from "@/components/book/book-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration - updated to match backend structure
const mockBooks = [
  {
    _id: "1",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publicationDate: "1954-07-29",
    coverImageUrl: "/placeholder.svg?height=300&width=200",
    synopsis:
      "A hobbit's journey to destroy the One Ring and save Middle-earth.",
    language: "English",
    rating: 5,
    addedBy: {
      _id: "user1",
      username: "tolkien_fan",
      firstName: "John",
      lastName: "Doe",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    publicationDate: "1960-07-11",
    coverImageUrl: "/placeholder.svg?height=300&width=200",
    synopsis:
      "A story of racial injustice and childhood innocence in the American South.",
    language: "English",
    rating: 4,
    addedBy: {
      _id: "user2",
      username: "classic_reader",
      firstName: "Jane",
      lastName: "Smith",
    },
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    _id: "3",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    publicationDate: "1949-06-08",
    coverImageUrl: "/placeholder.svg?height=300&width=200",
    synopsis:
      "A dystopian social science fiction novel about totalitarian control.",
    language: "English",
    rating: 5,
    addedBy: {
      _id: "user1",
      username: "tolkien_fan",
      firstName: "John",
      lastName: "Doe",
    },
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
];

export default function HomePage() {
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(books.map((book) => book.genre)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Hub</h1>
            <p className="text-gray-600">
              Discover and manage your favorite books
            </p>
          </div>
          <Link href="/add-book">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Book
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}

            {filteredBooks.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No books found matching your criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
