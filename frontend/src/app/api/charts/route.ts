import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, createApiResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const { user, error, status } = await authenticateRequest(request);
  if (error) {
    return NextResponse.json(createApiResponse(false, null, error), { status });
  }

  return NextResponse.json(createApiResponse(true, { charts: [] }));
}

export async function POST(request: NextRequest) {
  const { user, error, status } = await authenticateRequest(request);
  if (error) {
    return NextResponse.json(createApiResponse(false, null, error), { status });
  }

  return NextResponse.json(createApiResponse(true, { message: "Chart creation initiated" }), { status: 201 });
}

export const dynamic = 'force-dynamic';
