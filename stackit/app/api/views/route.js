import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true }
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Increment view count
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        views: true
      }
    });

    return NextResponse.json({
      success: true,
      views: updatedQuestion.views
    });

  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
