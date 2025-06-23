"use client";

import type React from "react";
import { Filter, X } from "lucide-react";

interface FilterSidebarProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  isOpen,
  onClose,
}) => {
  const sortOptions = [
    { value: "createdAt", label: "Recently Added" },
    { value: "title", label: "Title A-Z" },
    { value: "author", label: "Author A-Z" },
    { value: "publicationDate", label: "Publication Date" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-64 bg-white/95 backdrop-blur-sm 
        border-r border-secondary-200 z-50 lg:z-auto transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        overflow-y-auto
      `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary-600" />
              <h3 className="font-serif font-semibold text-primary-800">
                Filters
              </h3>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-secondary-500 hover:text-secondary-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="mb-8">
            <h4 className="font-medium text-secondary-800 mb-3">Sort By</h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                    ${
                      sortBy === option.value
                        ? "bg-primary-100 text-primary-800 font-medium"
                        : "text-secondary-600 hover:bg-secondary-50"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <h4 className="font-medium text-secondary-800 mb-3">Genre</h4>
            <div className="space-y-2">
              <button
                onClick={() => onGenreChange("")}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                  ${
                    selectedGenre === ""
                      ? "bg-primary-100 text-primary-800 font-medium"
                      : "text-secondary-600 hover:bg-secondary-50"
                  }
                `}
              >
                All Genres
              </button>

              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => onGenreChange(genre)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                    ${
                      selectedGenre === genre
                        ? "bg-primary-100 text-primary-800 font-medium"
                        : "text-secondary-600 hover:bg-secondary-50"
                    }
                  `}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedGenre || sortBy !== "createdAt") && (
            <div className="mt-8 pt-6 border-t border-secondary-200">
              <button
                onClick={() => {
                  onGenreChange("");
                  onSortChange("createdAt");
                }}
                className="w-full btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
