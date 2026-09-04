import { NextRequest, NextResponse } from "next/server";
import { calculateVarga } from "@node-jhora/core";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { authenticateRequest } from "@/lib/api-helpers";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { user, error, status } = await authenticateRequest(request);
    if (error) {
      return NextResponse.json<ApiResponse>({ success: false, error }, { status });
    }

    const chart = await prisma.chart.findFirst({
      where: { id: params.id, birthDetails: { userId: user!.id } },
      include: { birthDetails: true, reports: true },
    });

    if (!chart) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Chart not found" }, { status: 404 });
    }

    // Parse stringified JSON fields back to objects
    const safeParse = (value: any, fallback: any = {}) => {
      if (typeof value !== 'string') return value;
      try { return JSON.parse(value); } catch { return fallback; }
    };

    const planetaryPositions = safeParse(chart.planetaryPositions, {});
    const divisions = [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60];
    const ZODIAC_SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
    const vargas: Record<string, any[]> = {};

    divisions.forEach(div => {
      vargas[`D${div}`] = Object.entries(planetaryPositions).map(([name, data]: [string, any]) => {
        if (typeof (data?.longitude ?? data?.degree) !== 'number') return { name, ...data };
        const vp = calculateVarga((data.longitude ?? data.degree), div);
        return {
          name,
          ...data,
          sign: ZODIAC_SIGNS[vp.sign - 1] || "Mesha",
          degree: vp.degree,
        };
      });
    });

    const parsedChart = {
      ...chart,
      planetaryPositions,
      vargas,
      houses: safeParse(chart.houses, {}),
      aspects: safeParse(chart.aspects, []),
      yogas: safeParse(chart.yogas, []),
      doshas: safeParse(chart.doshas, []),
      shadbala: safeParse(chart.shadbala, {}),
      ashtakavarga: safeParse(chart.ashtakavarga, {}),
      vimshottariDasa: safeParse(chart.vimshottariDasa, []),
    };

    return NextResponse.json<ApiResponse>({ success: true, data: parsedChart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chart:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch chart" }, { status: 500 });
  }
}

