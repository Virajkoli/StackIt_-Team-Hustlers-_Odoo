import { requireAdmin, createAdminResponse } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    await requireAdmin();
    
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return createAdminResponse("User ID and role are required", 400);
    }
    
    if (!["USER", "ADMIN"].includes(role)) {
      return createAdminResponse("Invalid role. Must be USER or ADMIN", 400);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true
      }
    });
    
    return Response.json({
      message: `User role updated to ${role} successfully`,
      user: updatedUser
    });
    
  } catch (error) {
    console.error("Admin role update error:", error);
    return createAdminResponse(error.message, error.message.includes("Admin") ? 403 : 500);
  }
}
