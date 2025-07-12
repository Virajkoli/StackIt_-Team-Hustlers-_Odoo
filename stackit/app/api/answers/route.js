import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { content, questionId } = await request.json();

    if (!content || !questionId) {
      return NextResponse.json(
        { error: "Content and questionId are required" },
        { status: 400 }
      );
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        author: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    // Create notification for question author (if not the same user)
    if (question.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: question.authorId,
          type: "QUESTION_ANSWERED",
          message: `${session.user.name || session.user.email} answered your question "${question.title}"`,
        },
      });
    }

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}
