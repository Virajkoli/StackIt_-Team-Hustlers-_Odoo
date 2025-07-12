"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useVoting(initialScore, initialUserVote, questionId, answerId) {
  const { data: session } = useSession();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const vote = useCallback(async (type) => {
    if (!session) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...(questionId ? { questionId } : { answerId })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setScore(data.score);
        setUserVote(data.userVote);
      } else {
        console.error('Vote error:', data.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Vote request failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading, questionId, answerId]);

  const upvote = useCallback(() => vote('UP'), [vote]);
  const downvote = useCallback(() => vote('DOWN'), [vote]);

  return {
    score,
    userVote,
    isLoading,
    upvote,
    downvote,
    isAuthenticated: !!session
  };
}
