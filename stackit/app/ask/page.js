"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Editor from "@/components/Editor";
import Link from "next/link";

export default function AskQuestion() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-gray-300 rounded p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Please sign in to ask a question
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to ask questions on StackIt
            </p>
            <Link
              href="/login"
              className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    if (tags.length === 0) {
      setError("Please add at least one tag");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description,
          tags,
        }),
      });

      if (response.ok) {
        const question = await response.json();
        router.push(`/question/${question.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create question");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Ask a Question</h1>
          <p className="text-gray-600 mt-2">
            Get help from the community by asking a clear, detailed question.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Be specific and imagine you're asking a question to another person
              </p>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How do I fix this React hook error?"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Include all the information someone would need to answer your question
              </p>
              <div className="border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                <Editor
                  content={description}
                  onChange={setDescription}
                  placeholder="Provide details about your question. Include what you've tried and what you expect to happen."
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-2">
                Tags <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add up to 5 tags to describe what your question is about
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. react javascript nextjs"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={tags.length >= 5}
                />
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Press Enter or comma to add a tag. Max 5 tags.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400 px-4 py-2 rounded font-medium text-sm flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  "Post Question"
                )}
              </button>
              
              <Link
                href="/"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded font-medium text-sm"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
