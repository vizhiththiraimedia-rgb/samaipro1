"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

export function GrahaDetails({ chartData }: { chartData: any }) {
  const { language } = useLanguage();
  const isSi = language === "si";

  const planets = Object.entries(chartData?.planetaryPositions || {})
    .map(([key, val]: any) => ({ name: val?.name || key, ...val }))
    .filter((p: any) => p.name !== "Ascendant" && p.name !== "Lagna");
  
  const getPlanetColor = (name: string) => {
    const colors: Record<string, string> = {
      Sun: "text-orange-600 bg-orange-100", Moon: "text-blue-600 bg-blue-100", Mars: "text-red-600 bg-red-100",
      Mercury: "text-emerald-600 bg-emerald-100", Jupiter: "text-amber-600 bg-amber-100", Venus: "text-pink-600 bg-pink-100",
      Saturn: "text-slate-800 bg-slate-200", Rahu: "text-cyan-800 bg-cyan-100", Ketu: "text-amber-900 bg-amber-200"
    };
    return colors[name] || "text-indigo-600 bg-indigo-100";
  };

  const getPlanetBarColor = (name: string) => {
    const colors: Record<string, string> = {
      Sun: "bg-orange-500", Moon: "bg-blue-500", Mars: "bg-red-500",
      Mercury: "bg-emerald-500", Jupiter: "bg-amber-500", Venus: "bg-pink-500",
      Saturn: "bg-slate-700", Rahu: "bg-cyan-600", Ketu: "bg-amber-700"
    };
    return colors[name] || "bg-indigo-500";
  };

  const translatePlanet = (name: string) => {
    if (!isSi) return name;
    const trans: Record<string, string> = {
      Sun: "රවි (Sun)", Moon: "සඳු (Moon)", Mars: "කුජ (Mars)", Mercury: "බුධ (Mercury)",
      Jupiter: "ගුරු (Jupiter)", Venus: "සිකුරු (Venus)", Saturn: "ශනි (Saturn)", Rahu: "රාහු (Rahu)", Ketu: "කේතු (Ketu)"
    };
    return trans[name] || name;
  };

  const getMockAspects = (planetName: string) => {
    if (planetName === "Moon") return [{ name: "Jupiter", type: "Trine" }];
    if (planetName === "Mars") return [{ name: "Saturn", type: "Opposition" }];
    return [];
  };

  const getMockStrength = (planetName: string) => {
    const st: Record<string, number> = { Sun: 85, Moon: 70, Mars: 90, Mercury: 60, Jupiter: 95, Venus: 80, Saturn: 50, Rahu: 45, Ketu: 55 };
    return st[planetName] || 50;
  };

  const GrahaRow = ({ p }: { p: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const pName = p?.name || "?";
    
    const strength = chartData?.shadbala?.[pName] || getMockStrength(pName);
    const aspects = getMockAspects(pName);

    return (
      <Card className="border border-slate-200 shadow-sm overflow-hidden transition-all duration-200">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={"w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg " + getPlanetColor(pName)}>
              {pName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base md:text-lg">
                {translatePlanet(pName)}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {p.sign || "Unknown"} • {Math.floor((p.degree || 0) % 30)}° {Math.floor((((p.degree || 0) % 30) % 1) * 60)}' {p.retrograde ? "(R)" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {isSi ? "ශක්තිය" : "Strength"}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={"h-full " + getPlanetBarColor(pName)} style={{ width: strength + "%" }} />
                </div>
                <span className="text-xs font-bold text-slate-700">{strength}%</span>
              </div>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>

        {isOpen && (
          <div className="bg-slate-50 p-4 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isSi ? "කාරකත්ව (Significations)" : "Significations"}
                </h5>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {pName === "Sun" && <li>Soul, Father, Career, Authority</li>}
                  {pName === "Moon" && <li>Mind, Mother, Emotions, Wealth</li>}
                  {pName === "Mars" && <li>Courage, Siblings, Real Estate, Enemies</li>}
                  {["Sun", "Moon", "Mars"].indexOf(pName) === -1 && <li>General significations for {pName}</li>}
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {isSi ? "ලැබෙන දෘෂ්ටි (Aspects Received)" : "Aspects Received"}
                </h5>
                {aspects.length > 0 ? (
                  <div className="space-y-2">
                    {aspects.map((asp, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded text-sm">
                        <span className="font-semibold text-slate-700">{translatePlanet(asp.name)}</span>
                        <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{asp.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2">
                    {isSi ? "වෙනත් ග්‍රහයන්ගෙන් ප්‍රධාන දෘෂ්ටි නොමැත." : "No major aspects from other planets."}
                  </p>
                )}
              </div>

            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="w-full space-y-3">
      {planets.map((p: any, idx: number) => (
        <GrahaRow key={idx} p={p} />
      ))}
    </div>
  );
}
