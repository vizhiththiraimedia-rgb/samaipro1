import { type NextRequest } from "next/server";

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : request.cookies.get("access_token")?.value;

  if (!token) {
    return { user: null, error: "Unauthorized", status: 401 };
  }

  try {
    const { verifyAccessToken } = await import("@/lib/auth");
    const payload = verifyAccessToken(token);
    if (!payload) {
      return { user: null, error: "Invalid token", status: 401 };
    }

    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return { user: null, error: "User not found or inactive", status: 401 };
    }

    return { user, error: null, status: 200 };
  } catch (error) {
    return { user: null, error: "Authentication failed", status: 401 };
  }
}

export function requireRole(userRole: string, allowedRoles: string[]) {
  if (!allowedRoles.includes(userRole)) {
    return { authorized: false, error: "Forbidden", status: 403 };
  }
  return { authorized: true, error: null, status: 200 };
}

export function createApiResponse<T>(success: boolean, data?: T, error?: string, pagination?: any) {
  return {
    success,
    ...(data !== undefined && { data }),
    ...(error && { error }),
    ...(pagination && { pagination }),
  };
}
