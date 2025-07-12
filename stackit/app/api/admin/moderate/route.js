import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin, createAdminResponse } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const answerId = searchParams.get("answerId");
    
    if (questionId) {
      // Delete question and all related data (cascade will handle relationships)
      await prisma.question.delete({
        where: { id: questionId }
      });
      
      return Response.json({ message: "Question deleted successfully" });
    }
    
    if (answerId) {
      // Delete answer
      await prisma.answer.delete({
        where: { id: answerId }
      });
      
      return Response.json({ message: "Answer deleted successfully" });
    }
    
    return createAdminResponse("No valid content ID provided", 400);
    
  } catch (error) {
    console.error("Admin delete error:", error);
    return createAdminResponse(error.message, error.message.includes("Admin") ? 403 : 500);
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    
    const { action, userId, questionId, answerId } = await request.json();
    
    switch (action) {
      case "ban_user":
        // In a real app, you might want to add a banned field to user model
        // For now, we'll delete the user
        await prisma.user.delete({
          where: { id: userId }
        });
        return Response.json({ message: "User banned successfully" });
        
      case "hide_question":
        // Add a hidden field to the question model if needed
        // For now, we'll delete it
        await prisma.question.delete({
          where: { id: questionId }
        });
        return Response.json({ message: "Question hidden successfully" });
        
      case "hide_answer":
        await prisma.answer.delete({
          where: { id: answerId }
        });
        return Response.json({ message: "Answer hidden successfully" });
        
      default:
        return createAdminResponse("Invalid action", 400);
    }
    
  } catch (error) {
    console.error("Admin action error:", error);
    return createAdminResponse(error.message, error.message.includes("Admin") ? 403 : 500);
  }
}

export async function GET(request) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "overview";
    
    switch (type) {
      case "overview":
        const stats = await prisma.$transaction([
          prisma.user.count(),
          prisma.question.count(),
          prisma.answer.count(),
          prisma.user.count({ where: { role: "ADMIN" } }),
          prisma.question.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              }
            }
          }),
          prisma.answer.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              }
            }
          })
        ]);
        
        return Response.json({
          totalUsers: stats[0],
          totalQuestions: stats[1],
          totalAnswers: stats[2],
          totalAdmins: stats[3],
          questionsToday: stats[4],
          answersToday: stats[5]
        });
        
      case "recent_questions":
        const recentQuestions = await prisma.question.findMany({
          include: {
            author: {
              select: { id: true, name: true, username: true, email: true }
            },
            _count: {
              select: { answers: true, votes: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 20
        });
        
        return Response.json(recentQuestions);
        
      case "recent_answers":
        const recentAnswers = await prisma.answer.findMany({
          include: {
            author: {
              select: { id: true, name: true, username: true, email: true }
            },
            question: {
              select: { id: true, title: true }
            },
            _count: {
              select: { votes: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 20
        });
        
        return Response.json(recentAnswers);
        
      case "users":
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
              select: { questions: true, answers: true, votes: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 50
        });
        
        return Response.json(users);
        
      default:
        return createAdminResponse("Invalid type parameter", 400);
    }
    
  } catch (error) {
    console.error("Admin get error:", error);
    return createAdminResponse(error.message, error.message.includes("Admin") ? 403 : 500);
  }
}
