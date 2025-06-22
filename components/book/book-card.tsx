import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: Date | string;
  coverImageUrl: string;
  synopsis: string;
  addedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  // Mock current user - in real app this would come from auth state
  const currentUserId = "user1";
  const canEdit = book.addedBy?._id === currentUserId;

  const formatDate = (dateString: string | Date): number => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.getFullYear();
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
        <Image
          src={book.coverImageUrl || "/placeholder.svg"}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-xs text-gray-500">
            Published: {formatDate(book.publicationDate)}
          </p>
          <p className="text-sm text-gray-700 line-clamp-3">{book.synopsis}</p>
          {book.addedBy && (
            <p className="text-xs text-gray-500">
              Added by {book.addedBy.firstName} {book.addedBy.lastName}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/books/${book._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </Link>

        {canEdit && (
          <>
            <Link href={`/books/${book._id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
