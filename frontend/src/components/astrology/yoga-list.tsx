"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Sparkles, X } from "lucide-react";
const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors z-10 bg-white shadow-sm border border-slate-100">
          <X className="w-5 h-5 text-slate-400" />
        </button>
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const DialogTitle = ({ children, className }: any) => <h2 className={className}>{children}</h2>;
const DialogDescription = ({ children, className }: any) => <p className={className}>{children}</p>;

type ParticipatingPlanet = {
  name: string;
  strength: number; // percentage
  status: string; // e.g. "Exalted", "Own House", "Combust"
};

type YogaDef = {
  name: string;
  translationSi: string;
  type: string; // Auspicious or Inauspicious
  description: string;
  descriptionSi: string;
  participatingPlanets: ParticipatingPlanet[];
};

export function YogaList({ chartData }: { chartData: any }) {
  const { language } = useLanguage();
  const isSi = language === "si";

  const [selectedYoga, setSelectedYoga] = useState<YogaDef | null>(null);

  // Mocking the Yogas data
  const yogas: YogaDef[] = chartData?.yogasDetailed || [
    {
      name: "Gajakesari Yoga",
      translationSi: "ගජකේශරී යෝගය",
      type: "Auspicious",
      description: "Jupiter is in a Kendra (1, 4, 7, 10) from the Moon.",
      descriptionSi: "ගුරු ග්‍රහයා සඳුගෙන් කේන්ද්‍රස්ථානයක (1, 4, 7, 10) පිහිටීම.",
      participatingPlanets: [
        { name: "Jupiter", strength: 85, status: "Exalted" },
        { name: "Moon", strength: 70, status: "Friendly" }
      ]
    },
    {
      name: "Ruchaka Yoga",
      translationSi: "රුචක යෝගය",
      type: "Auspicious",
      description: "Mars is in its own sign or exalted, and in a Kendra from Ascendant.",
      descriptionSi: "කුජ ස්වක්ෂේත්‍රව හෝ උච්චව කේන්ද්‍රස්ථානයක පිහිටීම.",
      participatingPlanets: [
        { name: "Mars", strength: 95, status: "Own House" }
      ]
    },
    {
      name: "Kemadruma Yoga",
      translationSi: "කේමද්‍රැම යෝගය",
      type: "Inauspicious",
      description: "No planets (except Sun) in the 2nd and 12th houses from the Moon.",
      descriptionSi: "සඳුගෙන් දෙපස (2 සහ 12) ග්‍රහයින් නොමැති වීම.",
      participatingPlanets: [
        { name: "Moon", strength: 40, status: "Weak" }
      ]
    }
  ];

  const getPlanetColor = (name: string) => {
    const colors: Record<string, string> = {
      Sun: "bg-orange-500", Moon: "bg-blue-500", Mars: "bg-red-500",
      Mercury: "bg-emerald-500", Jupiter: "bg-amber-500", Venus: "bg-pink-500",
      Saturn: "bg-slate-800", Rahu: "bg-cyan-600", Ketu: "bg-amber-700"
    };
    return colors[name] || "bg-indigo-500";
  };

  const translatePlanet = (name: string) => {
    if (!isSi) return name;
    const trans: Record<string, string> = {
      Sun: "රවි", Moon: "සඳු", Mars: "කුජ", Mercury: "බුධ",
      Jupiter: "ගුරු", Venus: "සිකුරු", Saturn: "ශනි", Rahu: "රාහු", Ketu: "කේතු"
    };
    return trans[name] || name;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {yogas.map((yoga, idx) => (
          <Card key={idx} className="border border-slate-100 hover:shadow-md transition-shadow overflow-hidden group">
            <div className={`p-4 flex justify-between items-start ${yoga.type === 'Auspicious' ? 'bg-emerald-50/30' : 'bg-rose-50/30'}`}>
              <div className="flex gap-3">
                <div className={`p-2 rounded-full mt-1 ${yoga.type === 'Auspicious' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {isSi ? yoga.translationSi : yoga.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {isSi ? yoga.descriptionSi : yoga.description}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedYoga(yoga)}
                className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors shrink-0 shadow-sm"
                title="View Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedYoga} onOpenChange={(open: boolean) => !open && setSelectedYoga(null)}>
        <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-white rounded-2xl">
          {selectedYoga && (
            <>
              <div className={`p-6 ${selectedYoga.type === 'Auspicious' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${selectedYoga.type === 'Auspicious' ? 'text-emerald-600' : 'text-rose-600'}`} />
                  {isSi ? selectedYoga.translationSi : selectedYoga.name}
                </DialogTitle>
                <DialogDescription className="text-slate-600 mt-3 text-sm md:text-base">
                  {isSi ? selectedYoga.descriptionSi : selectedYoga.description}
                </DialogDescription>
              </div>
              
              <div className="p-6">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {isSi ? "සහභාගී වන ග්‍රහයින්ගේ ශක්තිය" : "Participating Planets Strength"}
                </h5>
                <div className="space-y-4">
                  {selectedYoga.participatingPlanets.map((p, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getPlanetColor(p.name)}`} />
                          {translatePlanet(p.name)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{p.status}</span>
                          <span className="text-slate-800">{p.strength}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPlanetColor(p.name)}`} 
                          style={{ width: `${p.strength}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}