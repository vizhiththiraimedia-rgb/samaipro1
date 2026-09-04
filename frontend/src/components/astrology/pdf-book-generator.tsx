import React from "react";
import { ChartRenderer } from "./chart-renderer";
import { useLanguage } from "@/components/providers/language-provider";

export function PDFBookGenerator({ chartData, language }: { chartData: any, language: string }) {
  if (!chartData) return null;

  const planets = Object.keys(chartData.planetaryPositions || {}).map(name => ({
    name,
    ...chartData.planetaryPositions[name]
  }));

  const formattedDob = chartData.birthDetails?.dateOfBirth 
    ? new Date(chartData.birthDetails.dateOfBirth).toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "";

  return (
    <div id="pdf-book-container" className="fixed top-0 left-[-9999px] w-[800px] bg-white opacity-0 pointer-events-none z-[-1] flex flex-col">
      
      {/* PAGE 1: Cover & Birth Details */}
      <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col justify-center border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✨</div>
          <h1 className="text-5xl font-bold text-purple-900 mb-4">{language === 'si' ? 'සම්පූර්ණ ජ්‍යෝතිෂ්‍ය වාර්තාව' : 'Complete Astrological Report'}</h1>
          <p className="text-xl text-slate-500">{language === 'si' ? 'ඔබේ ජීවිතයේ විශ්වීය සටහන' : 'Your Cosmic Blueprint'}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6">{language === 'si' ? 'උපත් තොරතුරු' : 'Birth Details'}</h2>
          
          <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'නම' : 'Name'}</div>
              <div className="text-2xl font-bold text-slate-900">{chartData.birthDetails?.fullName || "Guest User"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'ස්ත්‍රී/පුරුෂ භාවය' : 'Gender'}</div>
              <div className="text-xl text-slate-800 capitalize">{chartData.birthDetails?.gender || "Male"}</div>
            </div>
            
            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'උපන් දිනය' : 'Date of Birth'}</div>
              <div className="text-xl text-slate-800">{formattedDob}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'උපන් වේලාව' : 'Time of Birth'}</div>
              <div className="text-xl text-slate-800">{chartData.birthDetails?.birthTime || "12:00 AM"}</div>
            </div>

            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'උපන් ස්ථානය' : 'Place of Birth'}</div>
              <div className="text-xl text-slate-800">{chartData.birthDetails?.birthPlace || "Colombo"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">{language === 'si' ? 'ඛණ්ඩාංක' : 'Coordinates'}</div>
              <div className="text-xl text-slate-800">{chartData.birthDetails?.latitude}, {chartData.birthDetails?.longitude}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
            <div className="text-purple-600 font-bold mb-2">{language === 'si' ? 'ලග්නය' : 'Lagna'}</div>
            <div className="text-2xl font-black text-purple-900">{chartData.lagna}</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="text-blue-600 font-bold mb-2">{language === 'si' ? 'රාශිය' : 'Moon Sign'}</div>
            <div className="text-2xl font-black text-blue-900">{chartData.moonSign}</div>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center">
            <div className="text-amber-600 font-bold mb-2">{language === 'si' ? 'නැකත' : 'Nakshatra'}</div>
            <div className="text-2xl font-black text-amber-900">{chartData.nakshatra} (P{chartData.pada})</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: Chart (Kendare) */}
      <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-bold text-slate-800 mb-2 border-b pb-4">{language === 'si' ? 'ලග්න කේන්ද්‍රය (D1)' : 'Birth Chart (D1)'}</h2>
        <p className="text-slate-500 mb-8">{language === 'si' ? 'ඔබ උපන් මොහොතේ ග්‍රහ පිහිටීම්' : 'Planetary positions at the time of your birth'}</p>
        
        <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 rounded-2xl border">
          <div className="w-[600px] h-[600px] scale-[1.1]">
            {planets && (
              <ChartRenderer 
                planets={planets} 
                style="kendare" 
              />
            )}
          </div>
        </div>
      </div>

      {/* PAGE 3: Planetary Placements */}
      <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-bold text-slate-800 mb-2 border-b pb-4">{language === 'si' ? 'ග්‍රහ පිහිටීම්' : 'Planetary Positions'}</h2>
        <p className="text-slate-500 mb-8">{language === 'si' ? 'ඔබගේ කේන්ද්‍රයේ ග්‍රහයන් පිහිටා ඇති රාශි සහ අංශක' : 'Detailed breakdown of planetary positions'}</p>
        
        <div className="bg-slate-50 rounded-xl overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-900 text-white">
                <th className="p-4 font-bold">{language === 'si' ? 'ග්‍රහයා' : 'Planet'}</th>
                <th className="p-4 font-bold">{language === 'si' ? 'රාශිය' : 'Sign'}</th>
                <th className="p-4 font-bold">{language === 'si' ? 'අංශක' : 'Degree'}</th>
                <th className="p-4 font-bold">{language === 'si' ? 'භාවය' : 'House'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {planets?.map((p: any, i: number) => (
                <tr key={i} className="bg-white">
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">🪐</span>
                    {p.name}
                  </td>
                  <td className="p-4 text-slate-600">{p.sign}</td>
                  <td className="p-4 text-slate-600 font-mono">
                    {Math.floor(p.degree)}° {Math.floor((p.degree % 1) * 60)}'
                  </td>
                  <td className="p-4 text-slate-800 font-bold">{p.house}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE 4: Vimshottari Dasha */}
      {chartData.vimshottariDasa && chartData.vimshottariDasa.length > 0 && (
        <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
          <h2 className="text-3xl font-bold text-slate-800 mb-2 border-b pb-4">{language === 'si' ? 'විංශෝත්තරී දශා කාල' : 'Vimshottari Dasha Timeline'}</h2>
          <p className="text-slate-500 mb-8">{language === 'si' ? 'ඔබේ ජීවිතයේ ප්‍රධාන ග්‍රහ කාලයන්' : 'Major planetary periods in your life'}</p>
          
          <div className="bg-slate-50 rounded-xl overflow-hidden border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-900 text-white">
                  <th className="p-4 font-bold">{language === 'si' ? 'දශාව (මහ දශා)' : 'Mahadasha (Planet)'}</th>
                  <th className="p-4 font-bold text-right">{language === 'si' ? 'ආරම්භය - අවසානය' : 'Timeline (Start - End)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {chartData.vimshottariDasa.map((dasha: any, i: number) => (
                  <tr key={i} className="bg-white">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      {dasha.lord} {dasha.isBalance ? '(Balance)' : ''}
                    </td>
                    <td className="p-4 text-slate-600 text-right font-mono text-sm">
                      {dasha.startDate} to {dasha.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
            <strong>{language === 'si' ? 'සටහන:' : 'Note:'}</strong> {language === 'si' ? 'මෙම වාර්තාව පරිගණක ගත පද්ධතියක් මගින් සකස් කර ඇත.' : 'This report is computationally generated.'}
          </div>
        </div>
      )}

      {/* PAGE 5: Yogas & Doshas */}
      {((chartData.yogas && chartData.yogas.length > 0) || (chartData.doshas && chartData.doshas.length > 0)) && (
        <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
          <h2 className="text-3xl font-bold text-slate-800 mb-2 border-b pb-4">{language === 'si' ? 'යෝග සහ දෝෂ' : 'Yogas & Doshas'}</h2>
          <p className="text-slate-500 mb-8">{language === 'si' ? 'ඔබගේ කේන්දරයේ ඇති විශේෂ ග්‍රහ යෝග' : 'Special planetary combinations in your chart'}</p>
          
          {chartData.yogas && chartData.yogas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">{language === 'si' ? 'සුභ යෝග' : 'Auspicious Yogas'}</h3>
              <div className="space-y-4">
                {chartData.yogas.map((yoga: any, i: number) => (
                  <div key={i} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-1">{yoga.name}</h4>
                    <p className="text-sm text-slate-700 mb-2 font-medium">{yoga.description}</p>
                    <p className="text-sm text-slate-600 italic">{yoga.effects}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chartData.doshas && chartData.doshas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-800 mb-4">{language === 'si' ? 'දෝෂ' : 'Doshas'}</h3>
              <div className="space-y-4">
                {chartData.doshas.map((dosha: any, i: number) => (
                  <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-900 mb-1">{dosha.name}</h4>
                    <p className="text-sm text-slate-700 mb-2 font-medium">{dosha.description}</p>
                    <p className="text-sm text-slate-600 italic">{dosha.effects}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE 6: Life Area Analysis */}
      {chartData.lifeAreas && chartData.lifeAreas.length > 0 && (
        <div className="pdf-page w-[800px] h-[1131px] bg-white p-12 flex flex-col border-b shadow-sm" style={{ boxSizing: 'border-box' }}>
          <h2 className="text-3xl font-bold text-slate-800 mb-2 border-b pb-4">{language === 'si' ? 'ජීවිතයේ ප්‍රධාන අංශ' : 'Life Area Analysis'}</h2>
          <p className="text-slate-500 mb-8">{language === 'si' ? 'ග්‍රහ පිහිටීම් අනුව ඔබේ ජීවිතයේ විවිධ අංශ වල ශක්තිය' : 'Strength of different life areas based on your chart'}</p>
          
          <div className="space-y-6">
            {chartData.lifeAreas.map((area: any, i: number) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{area.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-indigo-600">{area.score}</span>
                    <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${area.score >= 70 ? 'bg-green-500' : area.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${area.score}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto p-6 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800 text-sm">
            <strong>{language === 'si' ? 'විශ්ලේෂණය ගැන:' : 'About this analysis:'}</strong> {language === 'si' ? 'මෙම ලකුණු ලබා දී ඇත්තේ අදාළ භාවයන්හි සහ කාරක ග්‍රහයන්ගේ ශක්තිය මත පදනම්වය. මෙය සාමාන්‍ය මාර්ගෝපදේශයක් පමණි.' : 'These scores are calculated based on the dignity of significators and house occupants. This serves as a general astrological guide.'}
          </div>
        </div>
      )}

    </div>
  );
}
