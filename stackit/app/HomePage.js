"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";

async function getQuestions(sortBy = "newest", searchQuery = "") {
  try {
    let url = `/api/questions?sort=${sortBy}`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    return data.questions || data; // Handle both response formats
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

export default function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sortParam = searchParams.get("sort") || "newest";
    const searchParam = searchParams.get("search") || "";
    setActiveFilter(sortParam);
    setSearchQuery(searchParam);
    fetchQuestions(sortParam, searchParam);
  }, [searchParams]);

  const fetchQuestions = async (sortBy, search = "") => {
    setLoading(true);
    try {
      const fetchedQuestions = await getQuestions(sortBy, search);
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    const url = new URL(window.location);
    url.searchParams.set("sort", filter);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    }
    router.push(url.pathname + url.search);
  };

  const getFilterButtonClass = (filter) => {
    const baseClass = "px-3 py-1.5 text-sm";
    if (filter === activeFilter) {
      return `${baseClass} bg-orange-500 text-white`;
    }
    return `${baseClass} text-gray-600 hover:bg-gray-50`;
  };

  const getFilterTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    switch (activeFilter) {
      case "active":
        return "Active Questions";
      case "unanswered":
        return "Unanswered Questions";
      default:
        return "All Questions";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block w-64 p-4">
            <div className="bg-white rounded border border-gray-300 p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center px-2 py-1 text-sm text-orange-600 bg-orange-50 rounded"
                >
                  <span>Questions</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {questions.length}
                  </span>
                </Link>
                <Link
                  href="/tags"
                  className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  Tags
                </Link>
                <Link
                  href="/users"
                  className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  Users
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Tags</h3>
              <div className="space-y-1">
                {["javascript", "react", "nextjs", "css", "html"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="block px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getFilterTitle()}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {loading ? "Loading..." : `${questions.length} questions`}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => handleFilterChange("newest")}
                    className={`${getFilterButtonClass(
                      "newest"
                    )} border-r border-gray-300`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => handleFilterChange("active")}
                    className={`${getFilterButtonClass(
                      "active"
                    )} border-r border-gray-300`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleFilterChange("unanswered")}
                    className={getFilterButtonClass("unanswered")}
                  >
                    Unanswered
                  </button>
                </div>
                <Link
                  href="/ask"
                  className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium"
                >
                  Ask Question
                </Link>
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="bg-white border border-gray-300 rounded p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white border border-gray-300 rounded p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">🤔</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : activeFilter === "unanswered"
                    ? "No unanswered questions"
                    : activeFilter === "active"
                    ? "No active questions"
                    : "No questions yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all questions."
                    : activeFilter === "unanswered"
                    ? "All questions have been answered!"
                    : activeFilter === "active"
                    ? "No recent activity on questions."
                    : "Be the first to ask a question and start the conversation!"}
                </p>
                <div className="space-x-2">
                  {searchQuery && (
                    <Link
                      href="/"
                      className="inline-block px-4 py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                    >
                      View All Questions
                    </Link>
                  )}
                  <Link
                    href="/ask"
                    className="inline-block px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium"
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isLast={index === questions.length - 1}
                  />
                ))}
              </div>
            )}

            {/* Pagination placeholder */}
            {questions.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-1">
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded bg-orange-500 text-white">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
