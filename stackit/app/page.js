import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import QuestionsListClient from "@/components/QuestionsListClient";

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
          <QuestionsListClient initialQuestions={questions} />
        </div>
      </div>
    </div>
  );
 }
