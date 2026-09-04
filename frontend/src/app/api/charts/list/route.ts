import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { authenticateRequest } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { user, error, status } = await authenticateRequest(request);
    if (error) {
      return NextResponse.json<ApiResponse>({ success: false, error }, { status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where = { birthDetails: { userId: user!.id } };
    const [charts, total] = await Promise.all([
      prisma.chart.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { birthDetails: { select: { fullName: true, dateOfBirth: true } } },
      }),
      prisma.chart.count({ where }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: charts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching charts:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch charts" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
