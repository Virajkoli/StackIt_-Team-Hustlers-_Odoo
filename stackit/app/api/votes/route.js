import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, answerId, type } = await request.json();

    // Validate input
    if (!type || !['UP', 'DOWN'].includes(type)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    if (!questionId && !answerId) {
      return NextResponse.json({ error: "Either questionId or answerId is required" }, { status: 400 });
    }

    if (questionId && answerId) {
      return NextResponse.json({ error: "Cannot vote on both question and answer simultaneously" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if content exists
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { authorId: true }
      });
      
      if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }
    }

    if (answerId) {
      const answer = await prisma.answer.findUnique({
        where: { id: answerId },
        select: { authorId: true }
      });
      
      if (!answer) {
        return NextResponse.json({ error: "Answer not found" }, { status: 404 });
      }
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        ...(questionId ? { questionId } : { answerId })
      }
    });

    let result;

    if (existingVote) {
      if (existingVote.type === type) {
        // Same vote type - remove the vote (toggle off)
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        result = { action: 'removed', type };
      } else {
        // Different vote type - update the vote
        result = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type }
        });
        result = { action: 'updated', type, vote: result };
      }
    } else {
      // No existing vote - create new vote
      result = await prisma.vote.create({
        data: {
          userId,
          type,
          ...(questionId ? { questionId } : { answerId })
        }
      });
      result = { action: 'created', type, vote: result };
    }

    // Get updated vote counts
    let voteData;
    if (questionId) {
      voteData = await prisma.vote.groupBy({
        by: ['type'],
        where: { questionId },
        _count: { type: true }
      });
    } else {
      voteData = await prisma.vote.groupBy({
        by: ['type'],
        where: { answerId },
        _count: { type: true }
      });
    }

    const upvotes = voteData.find(v => v.type === 'UP')?._count?.type || 0;
    const downvotes = voteData.find(v => v.type === 'DOWN')?._count?.type || 0;
    const score = upvotes - downvotes;

    // Get user's current vote
    const userVote = await prisma.vote.findFirst({
      where: {
        userId,
        ...(questionId ? { questionId } : { answerId })
      },
      select: { type: true }
    });

    return NextResponse.json({
      success: true,
      result,
      score,
      upvotes,
      downvotes,
      userVote: userVote?.type || null
    });

  } catch (error) {
    console.error("Error handling vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const answerId = searchParams.get('answerId');

    if (!questionId && !answerId) {
      return NextResponse.json({ error: "Either questionId or answerId is required" }, { status: 400 });
    }

    // Get vote counts
    let voteData;
    if (questionId) {
      voteData = await prisma.vote.groupBy({
        by: ['type'],
        where: { questionId },
        _count: { type: true }
      });
    } else {
      voteData = await prisma.vote.groupBy({
        by: ['type'],
        where: { answerId },
        _count: { type: true }
      });
    }

    const upvotes = voteData.find(v => v.type === 'UP')?._count?.type || 0;
    const downvotes = voteData.find(v => v.type === 'DOWN')?._count?.type || 0;
    const score = upvotes - downvotes;

    // Get user's vote if authenticated
    let userVote = null;
    if (session?.user?.id) {
      const vote = await prisma.vote.findFirst({
        where: {
          userId: session.user.id,
          ...(questionId ? { questionId } : { answerId })
        },
        select: { type: true }
      });
      userVote = vote?.type || null;
    }

    return NextResponse.json({
      score,
      upvotes,
      downvotes,
      userVote
    });

  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
