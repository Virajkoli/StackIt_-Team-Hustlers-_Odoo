import { formatRelativeTime } from "@/lib/utils";
import { ArrowUp, ArrowDown, Check } from "lucide-react";

export default function AnswerCard({ answer, questionAuthorId }) {
  const upvotes = answer.votes.filter(vote => vote.type === 'UP').length;
  const downvotes = answer.votes.filter(vote => vote.type === 'DOWN').length;
  const score = upvotes - downvotes;

  return (
    <div className={`bg-white border rounded-lg p-6 ${answer.isAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex gap-6">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800">
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-lg font-semibold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {score}
          </span>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800">
            <ArrowDown className="w-5 h-5" />
          </button>
          
          {answer.isAccepted && (
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          {/* Author Info */}
          <div className="flex justify-between items-end">
            {answer.isAccepted && (
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
                  {answer.author.name?.[0] || answer.author.username?.[0] || answer.author.email?.[0]}
                </div>
                <span className="font-medium text-gray-900">
                  {answer.author.name || answer.author.username || answer.author.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
