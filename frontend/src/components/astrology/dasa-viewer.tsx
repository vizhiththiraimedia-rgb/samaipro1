"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronDown, Calendar, Clock } from "lucide-react";

// Types for Dasa structure
type DasaPeriod = {
  planet: string;
  start: string;
  end: string;
  subPeriods?: DasaPeriod[];
};

export function DasaViewer({ chartData }: { chartData: any }) {
  const { language } = useLanguage();
  const isSi = language === "si";

  // Mocking the top level Dasas
  const dasaLevels: DasaPeriod[] = chartData?.vimshottariDasa || [
    {
      planet: "Venus",
      start: "2015-05-10",
      end: "2035-05-10",
      subPeriods: [
        { planet: "Venus", start: "2015-05-10", end: "2018-09-09", subPeriods: [
            { planet: "Venus", start: "2015-05-10", end: "2016-01-09", subPeriods: [
                { planet: "Venus", start: "2015-05-10", end: "2015-06-01" },
                { planet: "Sun", start: "2015-06-01", end: "2015-06-25" }
            ]},
            { planet: "Sun", start: "2016-01-09", end: "2016-03-09" }
        ]},
        { planet: "Sun", start: "2018-09-09", end: "2019-09-09" },
        { planet: "Moon", start: "2019-09-09", end: "2021-05-10" },
        { planet: "Mars", start: "2021-05-10", end: "2022-07-10" },
        { planet: "Rahu", start: "2022-07-10", end: "2025-07-10" },
        { planet: "Jupiter", start: "2025-07-10", end: "2028-03-10" },
        { planet: "Saturn", start: "2028-03-10", end: "2031-05-10" },
        { planet: "Mercury", start: "2031-05-10", end: "2034-03-10" },
        { planet: "Ketu", start: "2034-03-10", end: "2035-05-10" },
      ],
    },
    {
      planet: "Sun",
      start: "2035-05-10",
      end: "2041-05-10",
      subPeriods: [],
    },
    {
      planet: "Moon",
      start: "2041-05-10",
      end: "2051-05-10",
      subPeriods: [],
    },
  ];

  const birthDate = chartData?.birthDetails?.date ? new Date(chartData.birthDetails.date) : new Date("2000-01-01");

  const getAge = (dateStr: string) => {
    const d = new Date(dateStr);
    let age = d.getFullYear() - birthDate.getFullYear();
    const m = d.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && d.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const DasaNode = ({ period, level, maxLevel = 4 }: { period: DasaPeriod, level: number, maxLevel?: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = period.subPeriods && period.subPeriods.length > 0 && level < maxLevel;
    
    // Formatting date
    const startDate = new Date(period.start).toLocaleDateString(isSi ? 'si-LK' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const endDate = new Date(period.end).toLocaleDateString(isSi ? 'si-LK' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    // Calculate Age for Maha Dasa (level 1)
    const ageAtStart = level === 1 ? getAge(period.start) : null;
    
    const levelColors = [
      "bg-indigo-50 border-indigo-200 text-indigo-900", // Level 1 (Maha)
      "bg-slate-50 border-slate-200 text-slate-800",     // Level 2 (Antar)
      "bg-white border-slate-100 text-slate-700",        // Level 3 (Vidasa)
      "bg-transparent border-transparent text-slate-600" // Level 4 (Sookshma)
    ];

    const colorClass = levelColors[level - 1] || levelColors[3];

    return (
      <div className="w-full">
        <div 
          onClick={() => hasChildren && setIsOpen(!isOpen)}
          className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${hasChildren ? 'cursor-pointer hover:brightness-95' : ''} ${colorClass}`}
          style={{ marginLeft: `${Math.max(0, (level - 1) * 12)}px` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              isOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />
            ) : (
              <span className="w-4 h-4 inline-block" />
            )}
            <div>
              <span className="font-bold text-sm md:text-base">{period.planet}</span>
              {level === 1 && ageAtStart !== null && (
                <span className="ml-2 text-xs font-semibold bg-white/60 px-2 py-0.5 rounded-full text-indigo-700">
                  {isSi ? `වයස: ${Math.max(0, ageAtStart)}` : `Age: ${Math.max(0, ageAtStart)}`}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs font-medium opacity-80">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {startDate}</span>
            <span className="hidden md:inline">-</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {endDate}</span>
          </div>
        </div>

        {isOpen && hasChildren && (
          <div className="mt-1 mb-3">
            {period.subPeriods!.map((sub, idx) => (
              <DasaNode key={idx} period={sub} level={level + 1} maxLevel={maxLevel} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="bg-indigo-50/50 p-4 border rounded-xl mb-4 flex justify-between items-center shadow-sm">
            <h3 className="font-bold text-indigo-900">
              {isSi ? "විංශෝත්තරී දසා (Vimshottari Dasa)" : "Vimshottari Dasa (4 Levels)"}
            </h3>
            <span className="text-[10px] sm:text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-center">
              {isSi ? "මහා, අන්තර්, විදසා, සූක්ෂ්ම" : "Maha ➔ Antar ➔ Vidasa ➔ Sookshma"}
            </span>
          </div>
          
          <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            {dasaLevels.map((dasa, idx) => (
              <DasaNode key={idx} period={dasa} level={1} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}