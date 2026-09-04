"use client";

import React from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Sun, Moon, Compass, MapPin } from "lucide-react";

export function InfoTab({ chartData }: { chartData: any }) {
  const { language } = useLanguage();
  const isSi = language === "si";

  const info = chartData?.advancedInfo || {
    sunrise: "06:12 AM",
    sunset: "18:24 PM",
    ayanamsha: '24° 12\' 33" (Lahiri)',
    horaLagna: "Simha (Leo)",
    ghatiLagna: "Kanya (Virgo)",
    varnadaLagna: "Tula (Libra)",
    sreeLagna: "Makara (Capricorn)",
    pranapadaLagna: "Mesha (Aries)",
    drekkana22: "Meena (Pisces) - 3rd Drekkana",
    navamsha64: "Kumbha (Aquarius) - 4th Navamsha",
    badhaka: "Vrischika (Scorpio)",
  };

  const AstroCard = ({ icon: Icon, title, value, subValue }: { icon: any, title: string, value: string, subValue?: string }) => (
    <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
      </div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-bold text-indigo-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AstroCard icon={Sun} title={isSi ? "සූර්ය උදාව" : "Sunrise"} value={info.sunrise} />
        <AstroCard icon={Moon} title={isSi ? "සූර්ය අස්තය" : "Sunset"} value={info.sunset} />
        <AstroCard icon={Compass} title={isSi ? "අයනාංශය" : "Ayanamsha"} value={info.ayanamsha} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-purple-100 shadow-sm overflow-hidden">
          <div className="bg-purple-50/50 p-4 border-b border-purple-100">
            <h3 className="font-bold text-purple-900">
              {isSi ? "විශේෂ ලග්න (Special Lagnas)" : "Special Lagnas"}
            </h3>
          </div>
          <CardContent className="p-4 bg-white">
            <Row label={isSi ? "හෝරා ලග්නය (HL)" : "Hora Lagna (HL)"} value={info.horaLagna} />
            <Row label={isSi ? "ඝටිකා ලග්නය (GL)" : "Ghati Lagna (GL)"} value={info.ghatiLagna} />
            <Row label={isSi ? "වර්ණද ලග්නය (VL)" : "Varnada Lagna (VL)"} value={info.varnadaLagna} />
            <Row label={isSi ? "ශ්‍රී ලග්නය (SL)" : "Sree Lagna (SL)"} value={info.sreeLagna} />
            <Row label={isSi ? "ප්‍රාණපද ලග්නය (PP)" : "Pranapada Lagna (PP)"} value={info.pranapadaLagna} />
          </CardContent>
        </Card>

        <Card className="border-rose-100 shadow-sm overflow-hidden">
          <div className="bg-rose-50/50 p-4 border-b border-rose-100">
            <h3 className="font-bold text-rose-900">
              {isSi ? "සංවේදී ස්ථාන (Sensitive Points)" : "Sensitive Points"}
            </h3>
          </div>
          <CardContent className="p-4 bg-white">
            <Row label={isSi ? "22 වන ද්‍රේෂ්කාණය" : "22nd Drekkana (Khara)"} value={info.drekkana22} />
            <Row label={isSi ? "64 වන නවාංශකය" : "64th Navamsha"} value={info.navamsha64} />
            <Row label={isSi ? "බාධක ස්ථානය" : "Badhaka Sthana"} value={info.badhaka} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}