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

    // Optimistic UI update
    const currentUserVote = userVote;
    const currentScore = score;
    
    // Calculate optimistic values
    let optimisticScore = currentScore;
    let optimisticUserVote = type;

    if (currentUserVote === type) {
      // Removing vote
      optimisticScore = currentUserVote === 'UP' ? currentScore - 1 : currentScore + 1;
      optimisticUserVote = null;
    } else if (currentUserVote) {
      // Changing vote
      optimisticScore = currentUserVote === 'UP' ? currentScore - 2 : currentScore + 2;
    } else {
      // Adding new vote
      optimisticScore = type === 'UP' ? currentScore + 1 : currentScore - 1;
    }

    // Apply optimistic update
    setScore(optimisticScore);
    setUserVote(optimisticUserVote);
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
        // Update with actual server response
        setScore(data.score);
        setUserVote(data.userVote);
      } else {
        console.error('Vote error:', data.error);
        // Revert optimistic update on error
        setScore(currentScore);
        setUserVote(currentUserVote);
      }
    } catch (error) {
      console.error('Vote request failed:', error);
      // Revert optimistic update on error
      setScore(currentScore);
      setUserVote(currentUserVote);
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading, questionId, answerId, userVote, score]);

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
