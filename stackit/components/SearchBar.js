"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
import { searchCache } from "@/lib/searchCache";

export default function SearchBar({ className = "" }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(async (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Check cache first
    const cacheKey = `search:${searchQuery.toLowerCase()}`;
    const cached = searchCache.get(cacheKey);
    if (cached) {
      setSuggestions(cached);
      setShowSuggestions(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/questions?search=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const questions = data.questions || [];

        // Cache the results
        searchCache.set(cacheKey, questions);

        setSuggestions(questions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      debouncedSearch(query);
    }, 250); // Reduced debounce time for faster response

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else if (query.trim()) {
          // Navigate to search results page
          window.location.href = `/?search=${encodeURIComponent(query)}`;
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = useCallback((question) => {
    setQuery("");
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    // Navigate to the question
    window.location.href = `/question/${question.id}`;
  }, []);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setHighlightedIndex(-1);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (query.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [query, suggestions.length]);

  // Memoize helper functions
  const stripHtml = useCallback((html) => {
    return html.replace(/<[^>]*>/g, "");
  }, []);

  const truncateText = useCallback(
    (text, maxLength = 100) => {
      const cleaned = stripHtml(text);
      return cleaned.length > maxLength
        ? cleaned.substring(0, maxLength) + "..."
        : cleaned;
    },
    [stripHtml]
  );

  // Memoize suggestion items to prevent unnecessary re-renders
  const suggestionItems = useMemo(() => {
    return suggestions.map((question, index) => (
      <div
        key={question.id}
        className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
          index === highlightedIndex ? "bg-blue-50" : ""
        }`}
        onClick={() => handleSuggestionClick(question)}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
              {question.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {truncateText(question.description)}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-xs text-gray-500">
                {question._count?.answers || 0} answers
              </span>
              <span className="text-xs text-gray-500">
                {question.votes?.filter((v) => v.type === "UP").length || 0}{" "}
                votes
              </span>
              {question.tags && question.tags.length > 0 && (
                <div className="flex space-x-1">
                  {question.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {question.tags.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{question.tags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  }, [suggestions, highlightedIndex, handleSuggestionClick, truncateText]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {showSuggestions &&
        (suggestions.length > 0 || query.trim().length >= 2) && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto mt-1"
          >
            {suggestions.length > 0 ? (
              <>
                {suggestionItems}
                {query.trim().length >= 2 && (
                  <Link
                    href={`/?search=${encodeURIComponent(query)}`}
                    className="block px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200 transition-colors"
                    onClick={() => {
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                  >
                    See all results for "{query}"
                  </Link>
                )}
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No questions found for "{query}"
                {query.trim().length >= 2 && (
                  <Link
                    href={`/?search=${encodeURIComponent(query)}`}
                    className="block mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => {
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                  >
                    Search all questions
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
