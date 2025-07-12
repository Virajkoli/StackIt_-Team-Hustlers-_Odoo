import Link from "next/link";
import FastLink from "@/components/FastLink";
import { formatRelativeTime } from "@/lib/utils";
import { ArrowUp, ArrowDown, MessageCircle, Check } from "lucide-react";

export default function QuestionCard({ question, isLast }) {
  const upvotes = question.votes.filter(vote => vote.type === 'UP').length;
  const downvotes = question.votes.filter(vote => vote.type === 'DOWN').length;
  const score = upvotes - downvotes;
  const answerCount = question._count.answers;
  const hasAcceptedAnswer = question.answers.some(answer => answer.isAccepted);

  return (
    <div className={`bg-white border-l border-r border-t ${isLast ? 'border-b' : ''} border-gray-300 p-4 hover:bg-gray-50 transition-colors`}>
      <div className="flex gap-6">
        {/* Stats Section */}
        <div className="flex space-x-4 text-sm text-gray-600 min-w-[120px]">
          <div className="text-center">
            <div className={`font-semibold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500">votes</div>
          </div>
          
          <div className="text-center">
            <div className={`font-semibold ${hasAcceptedAnswer ? 'text-green-600 bg-green-100 px-2 py-1 rounded' : answerCount > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
              {answerCount}
            </div>
            <div className="text-xs text-gray-500">answers</div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-gray-600">{question.views || 0}</div>
            <div className="text-xs text-gray-500">views</div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1">
          <div className="mb-2">
            <FastLink href={`/question/${question.id}`}>
              <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer mb-2">
                {question.title}
              </h3>
            </FastLink>
            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
              {question.description.replace(/<[^>]*>/g, '').substring(0, 200)}
              {question.description.length > 200 && '...'}
            </p>
          </div>

          {/* Bottom row with tags and author info */}
          <div className="flex items-center justify-between">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {question.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.name}`}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded"
                >
                  {tag.name}
                </Link>
              ))}
              {question.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{question.tags.length - 3} more</span>
              )}
            </div>

            {/* Author and Date */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>asked</span>
              <span className="font-medium text-gray-700">
                {formatRelativeTime(question.createdAt)}
              </span>
              <span>by</span>
              <Link 
                href={`/users/${question.author.id}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {question.author.name || question.author.username || question.author.email.split('@')[0]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
