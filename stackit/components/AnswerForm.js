"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";

export default function AnswerForm({ questionId }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Please provide an answer");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          content,
        }),
      });

      if (response.ok) {
        setContent("");
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to post answer");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <div className="border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
          <Editor
            content={content}
            onChange={setContent}
            placeholder="Write your answer here. Be clear and helpful."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400 px-4 py-2 rounded font-medium text-sm flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting...
            </>
          ) : (
            "Post Your Answer"
          )}
        </button>
      </div>
    </form>
  );
}
