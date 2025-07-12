"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { Check } from "lucide-react";
import VoteButtons from "@/components/VoteButtons";
import AdminActions from "@/components/AdminActions";
import { ButtonLoadingSpinner } from "@/components/LoadingSpinner";

export default function AnswerCard({
  answer,
  questionAuthorId,
  userId,
  questionId,
}) {
  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);
  const [isLoading, setIsLoading] = useState(false);

  const upvotes = answer.votes.filter((vote) => vote.type === "UP").length;
  const downvotes = answer.votes.filter((vote) => vote.type === "DOWN").length;
  const score = upvotes - downvotes;

  // Get user's vote on this answer
  const userVote = userId
    ? answer.votes.find((vote) => vote.userId === userId)?.type || null
    : null;

  // Check if current user is the question author
  const isQuestionAuthor = userId === questionAuthorId;

  const handleAcceptAnswer = async () => {
    if (!questionId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/answers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerId: answer.id,
          questionId: questionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAccepted(data.isAccepted);
        // Use router.refresh() instead of window.location.reload() for better performance
        // For now, we'll just update the local state
        // Other answers will be updated when the page is naturally refreshed
      } else {
        console.error("Error accepting answer:", data.error);
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg p-6 ${
        isAccepted ? "border-green-200 bg-green-50" : "border-gray-200"
      }`}
    >
      <div className="flex gap-6">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-2">
          <VoteButtons
            initialScore={score}
            initialUserVote={userVote}
            answerId={answer.id}
            size="default"
          />

          {/* Accept Answer Button (only for question author) */}
          {isQuestionAuthor && (
            <button
              onClick={handleAcceptAnswer}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                isAccepted
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={isAccepted ? "Unaccept this answer" : "Accept this answer"}
            >
              {isLoading ? (
                <ButtonLoadingSpinner />
              ) : (
                <Check className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Accepted indicator (for everyone) */}
          {isAccepted && !isQuestionAuthor && (
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div
            className="prose prose-black max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          {/* Bottom row with accepted status and author info */}
          <div className="flex justify-between items-end">
            {isAccepted && (
              <div className="flex items-center text-green-600 text-sm font-medium">
                <Check className="w-4 h-4 mr-1" />
                Accepted Answer
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3 text-sm ml-auto">
              <div className="text-gray-600 mb-1">
                answered {formatRelativeTime(answer.createdAt)}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {answer.author.name?.[0] ||
                    answer.author.username?.[0] ||
                    answer.author.email?.[0]}
                </div>
                <span className="font-medium text-gray-900">
                  {answer.author.name ||
                    answer.author.username ||
                    answer.author.email}
                </span>
              </div>
            </div>
          </div>
          
          {/* Admin Actions */}
          <AdminActions 
            contentType="answer" 
            contentId={answer.id}
          />
        </div>
      </div>
    </div>
  );
}
