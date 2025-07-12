"use client";

import { useState, useEffect } from "react";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";

export default function QuestionsListClient({ initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [activeFilter, setActiveFilter] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  const filterQuestions = async (filter) => {
    setIsLoading(true);
    setActiveFilter(filter);
    
    try {
      let sortedQuestions = [...initialQuestions];
      
      switch (filter) {
        case "newest":
          sortedQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "active":
          // Sort by most recent activity (answers, votes)
          sortedQuestions.sort((a, b) => {
            const aLastActivity = Math.max(
              new Date(a.createdAt).getTime(),
              ...a.answers.map(answer => new Date(answer.createdAt || a.createdAt).getTime())
            );
            const bLastActivity = Math.max(
              new Date(b.createdAt).getTime(),
              ...b.answers.map(answer => new Date(answer.createdAt || b.createdAt).getTime())
            );
            return bLastActivity - aLastActivity;
          });
          break;
        case "unanswered":
          sortedQuestions = sortedQuestions.filter(q => q._count.answers === 0);
          break;
        default:
          break;
      }
      
      setQuestions(sortedQuestions);
    } catch (error) {
      console.error("Error filtering questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = (filter) => {
    const isActive = activeFilter === filter;
    return isActive
      ? "px-3 py-1.5 text-sm bg-orange-500 text-white border-r border-gray-300"
      : "px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-300 last:border-r-0";
  };

  return (
    <div className="flex-1 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Questions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {questions.length} question{questions.length !== 1 ? 's' : ''}
            {activeFilter === "unanswered" && questions.length !== initialQuestions.length && 
              ` (${initialQuestions.length} total)`
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button 
              onClick={() => filterQuestions("newest")}
              disabled={isLoading}
              className={getButtonStyles("newest")}
            >
              {isLoading && activeFilter === "newest" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                  Newest
                </div>
              ) : (
                "Newest"
              )}
            </button>
            <button 
              onClick={() => filterQuestions("active")}
              disabled={isLoading}
              className={getButtonStyles("active")}
            >
              {isLoading && activeFilter === "active" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                  Active
                </div>
              ) : (
                "Active"
              )}
            </button>
            <button 
              onClick={() => filterQuestions("unanswered")}
              disabled={isLoading}
              className={getButtonStyles("unanswered")}
            >
              {isLoading && activeFilter === "unanswered" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                  Unanswered
                </div>
              ) : (
                "Unanswered"
              )}
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
      {questions.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">🤔</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {activeFilter === "unanswered" ? "No unanswered questions" : "No questions yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeFilter === "unanswered" 
              ? "All questions have been answered! Great job, community!" 
              : "Be the first to ask a question and start the conversation!"
            }
          </p>
          {activeFilter === "unanswered" ? (
            <button
              onClick={() => filterQuestions("newest")}
              className="inline-block px-4 py-2 text-sm text-orange-600 bg-orange-100 hover:bg-orange-200 rounded font-medium"
            >
              View All Questions
            </button>
          ) : (
            <Link
              href="/ask"
              className="inline-block px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium"
            >
              Ask the First Question
            </Link>
          )}
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
  );
}
