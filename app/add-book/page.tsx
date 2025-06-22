"use client";

import { useState } from "react";
import { BookForm } from "../../components/book/book-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (bookData: any) => {
    setIsLoading(true);

    // Simulate API call
    try {
      console.log("Adding book:", bookData);
      // In real app: await dispatch(addBook(bookData))

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/");
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="text-gray-600 mt-2">
            Share a great book with the community
          </p>
        </div>

        <BookForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Add Book"
        />
      </div>
    </div>
  );
}
