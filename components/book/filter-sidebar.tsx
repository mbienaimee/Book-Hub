"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export function FilterSidebar({
  genres,
  selectedGenre,
  onGenreChange,
}: FilterSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-3">Genre</h3>
          <div className="space-y-2">
            <Button
              variant={selectedGenre === "" ? "default" : "outline"}
              size="sm"
              onClick={() => onGenreChange("")}
              className="w-full justify-start"
            >
              All Genres
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => onGenreChange(genre)}
                className="w-full justify-start"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
