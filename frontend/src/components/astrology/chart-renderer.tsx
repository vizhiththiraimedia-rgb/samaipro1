"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

const ZODIAC_SIGNS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrischika",
  "Dhanu", "Makara", "Kumbha", "Meena"
];

const SIGN_NUMBERS: Record<string, number> = {
  "Mesha": 1, "Vrishabha": 2, "Mithuna": 3, "Karka": 4,
  "Simha": 5, "Kanya": 6, "Tula": 7, "Vrischika": 8,
  "Dhanu": 9, "Makara": 10, "Kumbha": 11, "Meena": 12
};

const SINHALA_SIGNS: Record<string, string> = {
  "Mesha": "මේෂ", "Vrishabha": "වෘෂභ", "Mithuna": "මිථුන", "Karka": "කටක",
  "Simha": "සිංහ", "Kanya": "කන්‍යා", "Tula": "තුලා", "Vrischika": "වෘශ්චික",
  "Dhanu": "ධනු", "Makara": "මකර", "Kumbha": "කුම්භ", "Meena": "මීන"
};

const SIGN_ICONS: Record<string, string> = {
  "Mesha": "🐏",
  "Vrishabha": "🐂",
  "Mithuna": "👯",
  "Karka": "🦀",
  "Simha": "🦁",
  "Kanya": "👧",
  "Tula": "⚖️",
  "Vrischika": "🦂",
  "Dhanu": "🏹",
  "Makara": "🐐",
  "Kumbha": "🏺",
  "Meena": "🐟"
};

const PLANET_COLORS: Record<string, string> = {
  "Sun": "#ea580c",
  "Moon": "#2563eb",
  "Mars": "#dc2626",
  "Mercury": "#16a34a",
  "Jupiter": "#d97706",
  "Venus": "#db2777",
  "Saturn": "#4f46e5",
  "Rahu": "#0891b2",
  "Ketu": "#d97706",
  "Ascendant": "#9333ea",
  "Lagna": "#9333ea",
  "Asc": "#9333ea"
};

export function ChartRenderer({ planets, compositePlanets, advancedPoints = {}, style = "kendare", className, onPlanetClick }: { planets: any[], compositePlanets?: any[], advancedPoints?: Record<string, { sign: number, signName: string }>, style?: "north" | "south" | "east" | "kendare", className?: string, onPlanetClick?: (planet: any) => void }) {
  const { language } = useLanguage();
  
  const getPlanetsInSign = (signName: string) => planets.filter(p => p.sign === signName);
  const getPointsInSign = (signName: string) => Object.entries(advancedPoints).filter(([k,v]) => v.signName === signName).map(([k,v]) => k);
  
  const lagnaPlanet = planets.find(p => p.name === "Ascendant" || p.name === "Asc" || p.name === "Lagna");
  const lagnaIndex = lagnaPlanet ? ZODIAC_SIGNS.indexOf(lagnaPlanet.sign) : 0;
  const lagnaSignName = lagnaPlanet?.sign || "Mesha";
  
  const moonPlanet = planets.find(p => p.name === "Moon");
  const moonSignName = moonPlanet?.sign || "Mesha";

  const getPlanetAbbreviation = (name: string): string => {
    if (language === "si") {
      if (name.includes("Sun")) return "ර";
      if (name.includes("Moon")) return "ච";
      if (name.includes("Mars")) return "කු";
      if (name.includes("Mercury")) return "බු";
      if (name.includes("Jupiter")) return "ගුරු";
      if (name.includes("Venus")) return "සි";
      if (name.includes("Saturn")) return "ශ";
      if (name.includes("Rahu")) return "රා";
      if (name.includes("Ketu")) return "කේ";
      return "ල";
    } else if (language === "ta") {
      if (name.includes("Sun")) return "சூ";
      if (name.includes("Moon")) return "சந்";
      if (name.includes("Mars")) return "செ";
      if (name.includes("Mercury")) return "பு";
      if (name.includes("Jupiter")) return "வி";
      if (name.includes("Venus")) return "வெ";
      if (name.includes("Saturn")) return "ச";
      if (name.includes("Rahu")) return "ராகு";
      if (name.includes("Ketu")) return "கேது";
      return "ல";
    } else {
      if (name.includes("Sun")) return "Su";
      if (name.includes("Moon")) return "Mo";
      if (name.includes("Mars")) return "Ma";
      if (name.includes("Mercury")) return "Me";
      if (name.includes("Jupiter")) return "Ju";
      if (name.includes("Venus")) return "Ve";
      if (name.includes("Saturn")) return "Sa";
      if (name.includes("Rahu")) return "Ra";
      if (name.includes("Ketu")) return "Ke";
      return "Asc";
    }
  };

  const SignBadge = ({ signNum, isLagna }: { signNum: number, isLagna: boolean }) => (
    <div className={cn("flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border z-20", isLagna ? "bg-green-600 text-white border-green-600" : "text-slate-400 border-slate-300 bg-white")}>
      {signNum}
    </div>
  );

  const Planets = ({ planets }: { planets: any[] }) => (
    <div className="flex flex-wrap gap-[3px] mt-1 z-10 max-w-[85px] justify-center text-center">
      {planets.map((p, i) => {
        const isLagna = p.name === "Ascendant" || p.name === "Asc" || p.name === "Lagna";
        const abbr = getPlanetAbbreviation(p.name);
        const degree = isLagna ? "" : Math.floor(p.posInSign || (p.degree % 30) || 0);
        const isRet = p.retrograde;
        const text = isRet ? `(+${abbr})` : abbr;
        return (
          <span key={i} onClick={(e) => { e.stopPropagation(); if (onPlanetClick) onPlanetClick(p); }} className="text-[12px] font-bold cursor-pointer hover:scale-110 transition-transform" style={{ color: PLANET_COLORS[p.name] || (isLagna ? "#9333ea" : "#4f46e5") }}>
            {text}{!isLagna && <sub className="text-[9px] ml-[1px]">{degree}</sub>}
          </span>
        );
      })}
    </div>
  );

  if (style === "kendare") {
    return (
      <div className={cn("w-full aspect-square max-w-[600px] bg-white border border-slate-400 rounded relative overflow-hidden font-body shadow-sm select-none mx-auto", className)}>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-slate-800">
          
          {/* Top-Left Box */}
          <div className="relative border border-slate-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="#cbd5e1" strokeWidth="1"/></svg>
            <div className="absolute top-2 right-2 flex flex-col items-end">
               <SignBadge signNum={12} isLagna={lagnaSignName === "Meena"} />
               <Planets planets={getPlanetsInSign("Meena")} />
            </div>
            <div className="absolute bottom-2 left-2 flex flex-col items-start">
               <SignBadge signNum={1} isLagna={lagnaSignName === "Mesha"} />
               <Planets planets={getPlanetsInSign("Mesha")} />
            </div>
          </div>

          {/* Top-Mid Box */}
          <div className="relative border border-slate-300 flex items-center justify-center p-2">
            <div className="absolute top-2 left-2">
               <SignBadge signNum={11} isLagna={lagnaSignName === "Kumbha"} />
            </div>
            <div className="mt-2"><Planets planets={getPlanetsInSign("Kumbha")} /></div>
          </div>

          {/* Top-Right Box */}
          <div className="relative border border-slate-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="100%" y1="0" x2="0" y2="100%" stroke="#cbd5e1" strokeWidth="1"/></svg>
            <div className="absolute top-2 left-2 flex flex-col items-start">
               <SignBadge signNum={10} isLagna={lagnaSignName === "Makara"} />
               <Planets planets={getPlanetsInSign("Makara")} />
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col items-end">
               <SignBadge signNum={9} isLagna={lagnaSignName === "Dhanu"} />
               <Planets planets={getPlanetsInSign("Dhanu")} />
            </div>
          </div>

          {/* Left-Mid Box */}
          <div className="relative border border-slate-300 flex items-center justify-center p-2">
            <div className="absolute top-2 left-2">
               <SignBadge signNum={2} isLagna={lagnaSignName === "Vrishabha"} />
            </div>
            <Planets planets={getPlanetsInSign("Vrishabha")} />
          </div>

          {/* Center Box */}
          <div className="relative border border-slate-300 flex flex-col items-center justify-center p-2 bg-slate-50/30">
            {moonPlanet && (
              <>
                <div className="text-sm font-bold text-slate-800">
                  {Math.floor(moonPlanet.posInSign || (moonPlanet.degree % 30) || 0)}° {Math.floor(((moonPlanet.posInSign || (moonPlanet.degree % 30) || 0) % 1) * 60)}&apos;
                </div>
                <div className="text-3xl mt-1 text-slate-700">{SIGN_ICONS[moonPlanet.sign] || '♏'}</div>
                <div className="mt-2 bg-[#0ea5e9] text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-sm">
                  {language === "si" ? SINHALA_SIGNS[moonPlanet.sign] : moonPlanet.sign}
                </div>
              </>
            )}
          </div>

          {/* Right-Mid Box */}
          <div className="relative border border-slate-300 flex items-center justify-center p-2">
            <div className="absolute top-2 right-2">
               <SignBadge signNum={8} isLagna={lagnaSignName === "Vrischika"} />
            </div>
            <Planets planets={getPlanetsInSign("Vrischika")} />
          </div>

          {/* Bottom-Left Box */}
          <div className="relative border border-slate-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="0" y1="100%" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1"/></svg>
            <div className="absolute top-2 left-2 flex flex-col items-start">
               <SignBadge signNum={3} isLagna={lagnaSignName === "Mithuna"} />
               <Planets planets={getPlanetsInSign("Mithuna")} />
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col items-end">
               <SignBadge signNum={4} isLagna={lagnaSignName === "Karka"} />
               <Planets planets={getPlanetsInSign("Karka")} />
            </div>
          </div>

          {/* Bottom-Mid Box */}
          <div className="relative border border-slate-300 flex items-center justify-center p-2">
            <div className="absolute top-2 left-2">
               <SignBadge signNum={5} isLagna={lagnaSignName === "Simha"} />
            </div>
            <Planets planets={getPlanetsInSign("Simha")} />
          </div>

          {/* Bottom-Right Box */}
          <div className="relative border border-slate-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="#cbd5e1" strokeWidth="1"/></svg>
            <div className="absolute bottom-2 left-2 flex flex-col items-start">
               <SignBadge signNum={6} isLagna={lagnaSignName === "Kanya"} />
               <Planets planets={getPlanetsInSign("Kanya")} />
            </div>
            <div className="absolute top-2 right-2 flex flex-col items-end">
               <SignBadge signNum={7} isLagna={lagnaSignName === "Tula"} />
               <Planets planets={getPlanetsInSign("Tula")} />
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  
// South Indian Chart
  if (style === "south") {
    const renderCell = (signName: string) => {
        const ps = getPlanetsInSign(signName);
        const compPs = compositePlanets ? compositePlanets.filter(p => p.sign === signName) : [];
        const pts = getPointsInSign(signName);
        const isLagna = signName === lagnaSignName;
        return (
          <div key={signName} className="border border-purple-500/20 p-2 relative flex flex-col hover:bg-purple-500/5 transition-colors group bg-white">
            <span className="text-[10px] text-muted-foreground absolute top-1 left-1 opacity-50">{SIGN_NUMBERS[signName]}</span>
            
            <div className="flex flex-col gap-1 mt-4">
              {/* Primary Planets */}
              <div className="flex flex-wrap gap-1">
                {ps.map((p, idx) => {
                  if (p.name === "Ascendant" || p.name === "Asc" || p.name === "Lagna") return null;
                  const color = PLANET_COLORS[p.name] || "#4f46e5";
                  return (
                    <span key={"p-$idx"} onClick={(e) => { e.stopPropagation(); if (onPlanetClick) onPlanetClick(p); }} className="text-xs font-black cursor-pointer hover:scale-125 transition-transform" style={{ color }}>
                      {getPlanetAbbreviation(p.name)}
                    </span>
                  );
                })}
              </div>
              
              {/* Composite Planets */}
              {compPs.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                  {compPs.map((p, idx) => {
                    if (p.name === "Ascendant" || p.name === "Asc" || p.name === "Lagna") return null;
                    return (
                      <span key={"c-$idx"} className="text-xs font-bold text-slate-500">
                        {getPlanetAbbreviation(p.name)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {pts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 text-[9px] font-bold text-emerald-600">
                {pts.map(pt => <span key={pt}>{pt}</span>)}
              </div>
            )}
            {isLagna && <div className="absolute top-1 right-1 font-bold text-xs bg-slate-100 border border-slate-300 rounded px-1 text-slate-700">{getPlanetAbbreviation("Ascendant")}</div>}
          </div>
        );
      };

    return (
      <div className={cn("w-full aspect-square max-w-[500px] bg-[#FDFBF7] dark:bg-card border-2 border-purple-500 rounded-sm relative overflow-hidden shadow-inner font-body", className)}>
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {renderCell("Meena")}
          {renderCell("Mesha")}
          {renderCell("Vrishabha")}
          {renderCell("Mithuna")}
          
          {renderCell("Kumbha")}
          <div className="col-span-2 row-span-2 flex flex-col items-center justify-center border border-purple-500/20 p-4">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-purple-900/40 dark:text-purple-100/20">RASI</h3>
          </div>
          {renderCell("Karka")}
          
          {renderCell("Makara")}
          {renderCell("Simha")}
          
          {renderCell("Dhanu")}
          {renderCell("Vrischika")}
          {renderCell("Tula")}
          {renderCell("Kanya")}
        </div>
      </div>
    );
  }

  // North Indian Chart
  if (style === "north") {
    // In North Indian chart, House 1 is always the top middle diamond.
    // The houses go counter-clockwise: 1, 2, 3, ... 12.
    // We map house numbers to signs.
    const houses = Array.from({length: 12}, (_, i) => {
      const houseNum = i + 1;
      const signIndex = (lagnaIndex + houseNum - 1) % 12;
      const signName = ZODIAC_SIGNS[signIndex];
      return { houseNum, signName, signNumber: SIGN_NUMBERS[signName], planets: getPlanetsInSign(signName) };
    });

    const renderHouse = (index: number, x: string, y: string) => {
        const h = houses[index];
        const isLagna = index === 0;
        const pts = getPointsInSign(h.signName);
        return (
          <div key={index} className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: x, top: y, width: '25%', height: '25%' }}>
            <span className="text-[10px] text-muted-foreground absolute top-0">{h.signNumber}</span>
            {isLagna && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none mt-2">
                <span className="text-3xl">{SIGN_ICONS[h.signName]}</span>
                <span className="text-[9px] mt-1 font-bold">{SINHALA_SIGNS[h.signName]}</span>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-x-1 text-[11px] font-bold text-purple-900 dark:text-purple-300 mt-2 z-10">
              {h.planets.map(p => {
                const color = PLANET_COLORS[p.name] || "#4f46e5";
                return (
                  <span key={p.name} onClick={(e) => { e.stopPropagation(); if (onPlanetClick) onPlanetClick(p); }} className="cursor-pointer hover:scale-125 transition-transform" style={{ color }}>{getPlanetAbbreviation(p.name)}</span>
                );
              })}
            </div>
            {pts.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 z-10">
                {pts.map(pt => <span key={pt}>{pt}</span>)}
              </div>
            )}
          </div>
        );
      };

    return (
      <div className={cn("w-full aspect-square max-w-[500px] bg-[#FDFBF7] dark:bg-card border-2 border-purple-800 relative overflow-hidden mx-auto", className)}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 stroke-purple-800 stroke-[0.5] fill-none">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
          <polygon points="50,0 100,50 50,100 0,50" />
        </svg>
        {/* Placements for 12 houses */}
        {renderHouse(0, "50%", "25%")}   {/* H1 */}
        {renderHouse(1, "25%", "15%")}   {/* H2 */}
        {renderHouse(2, "15%", "25%")}   {/* H3 */}
        {renderHouse(3, "25%", "50%")}   {/* H4 */}
        {renderHouse(4, "15%", "75%")}   {/* H5 */}
        {renderHouse(5, "25%", "85%")}   {/* H6 */}
        {renderHouse(6, "50%", "75%")}   {/* H7 */}
        {renderHouse(7, "75%", "85%")}   {/* H8 */}
        {renderHouse(8, "85%", "75%")}   {/* H9 */}
        {renderHouse(9, "75%", "50%")}   {/* H10 */}
        {renderHouse(10, "85%", "25%")}  {/* H11 */}
        {renderHouse(11, "75%", "15%")}  {/* H12 */}
      </div>
    );
  }

  // East Indian Chart
  if (style === "east") {
    // East Indian chart uses fixed zodiac positions.
    const renderEastHouse = (signName: string, x: string, y: string, borderStyles: React.CSSProperties) => {
      const ps = getPlanetsInSign(signName);
      return (
        <div key={signName} className="absolute flex flex-col items-center justify-center p-1" style={{ left: x, top: y, width: '33.33%', height: '33.33%', ...borderStyles }}>
           <span className="text-[10px] text-muted-foreground absolute top-1 left-1 opacity-50">{SIGN_NUMBERS[signName]}</span>
           <div className="flex flex-wrap justify-center gap-1 mt-2 text-[10px] font-bold text-purple-900 dark:text-purple-300">
             {ps.map(p => {
               const color = PLANET_COLORS[p.name] || "#4f46e5";
               return (
                 <span key={p.name} onClick={(e) => { e.stopPropagation(); if (onPlanetClick) onPlanetClick(p); }} className="cursor-pointer hover:scale-125 transition-transform" style={{ color }}>{getPlanetAbbreviation(p.name)}</span>
               );
             })}
           </div>
        </div>
      );
    }

    return (
      <div className={cn("w-full aspect-square max-w-[500px] bg-[#FDFBF7] dark:bg-card border-2 border-purple-800 relative overflow-hidden mx-auto", className)}>
         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 stroke-purple-800 stroke-[0.5] fill-none">
            {/* 3x3 Grid lines */}
            <line x1="33.33" y1="0" x2="33.33" y2="100" />
            <line x1="66.66" y1="0" x2="66.66" y2="100" />
            <line x1="0" y1="33.33" x2="100" y2="33.33" />
            <line x1="0" y1="66.66" x2="100" y2="66.66" />
            
            {/* Diagonals in corner boxes */}
            <line x1="0" y1="33.33" x2="33.33" y2="0" />
            <line x1="66.66" y1="0" x2="100" y2="33.33" />
            <line x1="0" y1="66.66" x2="33.33" y2="100" />
            <line x1="66.66" y1="100" x2="100" y2="66.66" />
        </svg>
        
        {renderEastHouse("Mesha", "33.33%", "0%", {})}
        {renderEastHouse("Vrishabha", "66.66%", "0%", { height: "16.66%", width: "33.33%", paddingTop: "0" })}
        {renderEastHouse("Mithuna", "83.33%", "16.66%", { height: "33.33%", width: "16.66%" })}
        {renderEastHouse("Karka", "66.66%", "33.33%", {})}
        {renderEastHouse("Simha", "83.33%", "66.66%", { height: "33.33%", width: "16.66%" })}
        {renderEastHouse("Kanya", "66.66%", "83.33%", { height: "16.66%", width: "33.33%" })}
        {renderEastHouse("Tula", "33.33%", "66.66%", {})}
        {renderEastHouse("Vrischika", "0%", "83.33%", { height: "16.66%", width: "33.33%" })}
        {renderEastHouse("Dhanu", "0%", "66.66%", { height: "33.33%", width: "16.66%" })}
        {renderEastHouse("Makara", "0%", "33.33%", {})}
        {renderEastHouse("Kumbha", "0%", "16.66%", { height: "33.33%", width: "16.66%" })}
        {renderEastHouse("Meena", "0%", "0%", { height: "16.66%", width: "33.33%" })}
      </div>
    );
  }

  
  return null;
}




