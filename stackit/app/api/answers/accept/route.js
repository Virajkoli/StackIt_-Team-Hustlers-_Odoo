import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { answerId, questionId } = await request.json();

    if (!answerId || !questionId) {
      return NextResponse.json(
        { error: "Answer ID and Question ID are required" },
        { status: 400 }
      );
    }

    // Check if the user is the author of the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true }
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the question author can accept answers" },
        { status: 403 }
      );
    }

    // Check if the answer exists and belongs to this question
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { questionId: true, isAccepted: true }
    });

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    if (answer.questionId !== questionId) {
      return NextResponse.json(
        { error: "Answer does not belong to this question" },
        { status: 400 }
      );
    }

    // If this answer is already accepted, unaccept it
    if (answer.isAccepted) {
      await prisma.answer.update({
        where: { id: answerId },
        data: { isAccepted: false }
      });

      return NextResponse.json({
        success: true,
        isAccepted: false,
        message: "Answer unaccepted successfully"
      });
    }

    // First, unaccept any currently accepted answer for this question
    await prisma.answer.updateMany({
      where: {
        questionId: questionId,
        isAccepted: true
      },
      data: { isAccepted: false }
    });

    // Then accept the new answer
    await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true }
    });

    return NextResponse.json({
      success: true,
      isAccepted: true,
      message: "Answer accepted successfully"
    });

  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
