import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import QuestionCard from "@/components/QuestionCard";

async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true,
            email: true,
          },
        },
        tags: true,
        answers: {
          select: {
            id: true,
            isAccepted: true,
          },
        },
        votes: {
          select: {
            type: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return questions;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

export default async function Home() {
  const questions = await getQuestions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block w-64 p-4">
            <div className="bg-white rounded border border-gray-300 p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
              <nav className="space-y-1">
                <Link href="/" className="flex items-center px-2 py-1 text-sm text-orange-600 bg-orange-50 rounded">
                  <span>Questions</span>
                  <span className="ml-auto text-xs text-gray-500">{questions.length}</span>
                </Link>
                <Link href="/tags" className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  Tags
                </Link>
                <Link href="/users" className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  Users
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Tags</h3>
              <div className="space-y-1">
                {["javascript", "react", "nextjs", "css", "html"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="block px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  All Questions
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {questions.length} questions
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 border-r border-gray-300">
                    Newest
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    Active
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    Unanswered
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
                  No questions yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Be the first to ask a question and start the conversation!
                </p>
                <Link
                  href="/ask"
                  className="inline-block px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium"
                >
                  Ask the First Question
                </Link>
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
        </div>
      </div>
    </div>
  );
}
