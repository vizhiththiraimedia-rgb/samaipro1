import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, BirthDetails } from "@/types";
import { calculateChart } from "@/services/astrology";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    const body = await request.json();
    const { fullName, gender, dateOfBirth, birthTime, birthPlace, latitude, longitude, timezone, country, ayanamsa, chartSystem } = body;

    const chartData = await calculateChart({
      dateOfBirth: new Date(dateOfBirth),
      birthTime,
      latitude,
      longitude,
      timezone,
      ayanamsa: ayanamsa.toUpperCase() as any,
      chartSystem: chartSystem.toUpperCase().replace("_", "_") as any,
    });

    let targetUserId = user?.id;

    if (!targetUserId) {
      let guestUser = await prisma.user.findUnique({ where: { email: "guest@methjothisa.com" } });
      if (!guestUser) {
        guestUser = await prisma.user.create({ 
          data: { email: "guest@methjothisa.com", name: "Guest User", password: "" } 
        });
      }
      targetUserId = guestUser.id;
    }

    const birthDetails = await prisma.birthDetails.create({
      data: {
        userId: targetUserId,
        fullName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        birthTime,
        birthPlace,
        latitude,
        longitude,
        timezone,
        country,
        utcOffset: new Date(dateOfBirth).getTimezoneOffset() / -60,
        ayanamsa: ayanamsa.toUpperCase() as any,
      chartSystem: chartSystem.toUpperCase() as any,
      },
    });

    const chart = await prisma.chart.create({
      data: {
        birthDetailsId: birthDetails.id,
        chartType: "RASI",
        planetaryPositions: JSON.stringify(chartData.planetaryPositions || {}),
        houses: JSON.stringify(chartData.houses || {}),
        aspects: JSON.stringify(chartData.aspects || []),
        yogas: JSON.stringify(chartData.yogas || []),
        doshas: JSON.stringify(chartData.doshas || []),
        shadbala: JSON.stringify(chartData.shadbala || {}),
        ashtakavarga: JSON.stringify(chartData.ashtakavarga || {}),
        vimshottariDasa: JSON.stringify(chartData.vimshottariDasa || []),
        nakshatra: chartData.nakshatra || "Unknown",
        pada: chartData.pada || 1,
        lagna: chartData.lagna || "Unknown",
        moonSign: chartData.moonSign || "Unknown",
        sunSign: chartData.sunSign || "Unknown",
        ascendant: chartData.ascendant || "Unknown",
        metadata: JSON.stringify({ panchang: chartData.panchang }),
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: chart }, { status: 201 });
  } catch (error) {
    console.error("Chart generation error:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to generate chart" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
