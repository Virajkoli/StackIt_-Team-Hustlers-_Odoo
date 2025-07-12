import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    const skip = (page - 1) * limit;

    let where = {};
    let orderBy = {};
    
    if (tag) {
      where.tags = {
        some: {
          name: {
            contains: tag,
            mode: "insensitive",
          },
        },
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Configure sorting and filtering based on the sort parameter
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
        
      case "active":
        // Questions with recent activity (answers, votes, or updates)
        orderBy = [
          { updatedAt: "desc" },
          { createdAt: "desc" }
        ];
        break;
        
      case "unanswered":
        // Questions with no answers
        where = {
          ...where,
          answers: {
            none: {}
          }
        };
        orderBy = { createdAt: "desc" };
        break;
        
      default:
        orderBy = { createdAt: "desc" };
    }

    const includeOptions = {
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
        select: {
          id: true,
          isAccepted: true,
          createdAt: true,
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
          votes: true,
        },
      },
    };

    // For active questions, we need a more complex query to include questions with recent answers
    if (sort === "active") {
      const questions = await prisma.question.findMany({
        where,
        include: includeOptions,
        orderBy: [
          { updatedAt: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      });

      // Calculate activity score for each question
      const questionsWithActivity = questions.map(question => {
        const latestAnswerDate = question.answers.length > 0 
          ? new Date(Math.max(...question.answers.map(a => new Date(a.createdAt))))
          : null;
        
        const questionDate = new Date(question.createdAt);
        const updateDate = new Date(question.updatedAt);
        
        // Use the most recent date among question creation, update, and latest answer
        const activityDate = latestAnswerDate && latestAnswerDate > updateDate 
          ? latestAnswerDate 
          : updateDate > questionDate 
          ? updateDate 
          : questionDate;

        return {
          ...question,
          lastActivity: activityDate
        };
      });

      // Sort by activity date
      questionsWithActivity.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

      const total = await prisma.question.count({ where });

      return NextResponse.json({
        questions: questionsWithActivity,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Standard query for newest and unanswered
    const questions = await prisma.question.findMany({
      where,
      include: includeOptions,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.question.count({ where });

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { title, description, tags } = await request.json();

    if (!title || !description || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: "Title, description, and at least one tag are required" },
        { status: 400 }
      );
    }

    // Create or find tags
    const tagObjects = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: {},
          create: { name: tagName.toLowerCase() },
        });
        return tag;
      })
    );

    const question = await prisma.question.create({
      data: {
        title,
        description,
        authorId: session.user.id,
        tags: {
          connect: tagObjects.map(tag => ({ id: tag.id })),
        },
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
        tags: true,
        _count: {
          select: {
            answers: true,
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
