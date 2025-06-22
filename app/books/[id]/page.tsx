"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock book data - in real app this would come from Redux store or API
const mockBook = {
  _id: "1",
  title: "The Lord of the Rings",
  author: "J.R.R. Tolkien",
  genre: "Fantasy",
  publicationDate: "1954-07-29",
  coverImageUrl: "/placeholder.svg?height=400&width=300",
  synopsis:
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort. This is the story of how a Baggins had an adventure, and found himself doing and saying things altogether unexpected.",
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
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(mockBook);
  const [isLoading, setIsLoading] = useState(false);

  // Mock current user
  const currentUserId = "user1";
  const canEdit = book.addedBy?._id === currentUserId;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this book?")) {
      setIsLoading(true);
      try {
        // In real app: await dispatch(deleteBook(book.id))
        console.log("Deleting book:", book._id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/");
      } catch (error) {
        console.error("Error deleting book:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] relative mb-4">
                  <Image
                    src={book.coverImageUrl || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {canEdit && (
                  <div className="flex gap-2">
                    <Link href={`/books/${book._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {book.genre}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {book.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      by {book.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      Published: {formatDate(book.publicationDate)}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
