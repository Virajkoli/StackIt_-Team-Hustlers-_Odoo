import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  
  return session;
}

export function isAdmin(session) {
  return session?.user?.role === "ADMIN";
}

export function createAdminResponse(error, status = 403) {
  return Response.json({ error }, { status });
}
