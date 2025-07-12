import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import { ArrowUp, ArrowDown, Check, MessageCircle } from "lucide-react";
import AnswerCard from "@/components/AnswerCard";
import Link from "next/link";

async function getQuestion(id) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        tags: true,
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
              },
            },
            votes: {
              select: {
                type: true,
                userId: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: [
            { isAccepted: "desc" },
            { createdAt: "asc" },
          ],
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        _count: {
          select: {
            answers: true,
            votes: true,
          },
        },
      },
    });

    return question;
  } catch (error) {
    console.error("Failed to fetch question:", error);
    return null;
  }
}

export default async function QuestionPage({ params }) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  const upvotes = question.votes.filter(vote => vote.type === 'UP').length;
  const downvotes = question.votes.filter(vote => vote.type === 'DOWN').length;
  const score = upvotes - downvotes;
  const hasAcceptedAnswer = question.answers.some(answer => answer.isAccepted);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Questions
          </Link>
          <span>/</span>
          <span className="text-gray-900">Question</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {question.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>Asked {formatRelativeTime(question.createdAt)}</span>
          <span>{question._count.answers} answers</span>
          <span>{question._count.votes} votes</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex gap-6">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800">
              <ArrowUp className="w-6 h-6" />
            </button>
            <span className={`text-lg font-semibold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {score}
            </span>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800">
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div 
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            {/* Tags */}
            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Author Info */}
            <div className="flex justify-end">
              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <div className="text-gray-600 mb-1">asked {formatRelativeTime(question.createdAt)}</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {question.author.name?.[0] || question.author.username?.[0] || question.author.email?.[0]}
                  </div>
                  <span className="font-medium text-gray-900">
                    {question.author.name || question.author.username || question.author.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {question._count.answers} {question._count.answers === 1 ? 'Answer' : 'Answers'}
          </h2>
          {hasAcceptedAnswer && (
            <div className="flex items-center text-green-600 text-sm">
              <Check className="w-4 h-4 mr-1" />
              Has accepted answer
            </div>
          )}
        </div>

        {question.answers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No answers yet. Be the first to answer!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {question.answers.map((answer) => (
              <AnswerCard 
                key={answer.id} 
                answer={answer} 
                questionAuthorId={question.authorId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Answer
        </h3>
        <p className="text-gray-600 mb-4">
          Please sign in to post an answer.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium inline-block"
        >
          Sign In to Answer
        </Link>
      </div>
    </div>
  );
}
