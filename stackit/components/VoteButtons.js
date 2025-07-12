"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { useVoting } from "@/lib/useVoting";

export default function VoteButtons({ 
  initialScore, 
  initialUserVote, 
  questionId, 
  answerId, 
  size = "default" 
}) {
  const { score, userVote, isLoading, upvote, downvote, isAuthenticated } = useVoting(
    initialScore, 
    initialUserVote, 
    questionId, 
    answerId
  );

  const sizeClasses = {
    small: {
      button: "p-1.5 rounded-full",
      icon: "w-4 h-4",
      score: "text-sm font-semibold"
    },
    default: {
      button: "p-2 rounded-full",
      icon: "w-5 h-5",
      score: "text-lg font-semibold"
    },
    large: {
      button: "p-2 rounded-full",
      icon: "w-6 h-6",
      score: "text-lg font-semibold"
    }
  };

  const classes = sizeClasses[size];

  const getButtonClasses = (voteType) => {
    const baseClasses = `${classes.button} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`;
    
    if (userVote === voteType) {
      return voteType === 'UP' 
        ? `${baseClasses} bg-green-100 text-green-600 hover:bg-green-200`
        : `${baseClasses} bg-red-100 text-red-600 hover:bg-red-200`;
    }
    
    return `${baseClasses} hover:bg-gray-100 text-gray-600 hover:text-gray-800`;
  };

  const getScoreClasses = () => {
    if (score > 0) return `${classes.score} text-green-600`;
    if (score < 0) return `${classes.score} text-red-600`;
    return `${classes.score} text-gray-600`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button 
        onClick={upvote}
        disabled={isLoading}
        className={getButtonClasses('UP')}
        title={isAuthenticated ? "Vote up" : "Sign in to vote"}
      >
        <ArrowUp className={classes.icon} />
      </button>
      
      <span className={getScoreClasses()}>
        {score}
      </span>
      
      <button 
        onClick={downvote}
        disabled={isLoading}
        className={getButtonClasses('DOWN')}
        title={isAuthenticated ? "Vote down" : "Sign in to vote"}
      >
        <ArrowDown className={classes.icon} />
      </button>
    </div>
  );
}
