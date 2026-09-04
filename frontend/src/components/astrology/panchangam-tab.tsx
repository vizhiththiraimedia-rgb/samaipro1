"use client";

import React from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PanchangamTab({ chartData }: { chartData: any }) {
  const { language } = useLanguage();
  const isSi = language === "si";

  const panchangam = chartData?.panchangam || {
    tithi: "Shukla Paksha Dwitiya",
    vara: "Monday (Chandra)",
    nakshatra: chartData?.nakshatra || "Ashwini",
    yoga: "Vishkambha",
    karana: "Bava",
    paksha: "Shukla",
  };

  const avakhada = chartData?.avakhada || {
    varna: "Kshatriya",
    vashya: "Chatushpada",
    yoni: "Ashwa",
    gana: "Deva",
    nadi: "Adya",
    tatva: "Agni",
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Five Limbs of Panchangam */}
        <Card className="border-indigo-100 shadow-sm overflow-hidden">
          <div className="bg-indigo-50/50 p-4 border-b border-indigo-100">
            <h3 className="font-bold text-indigo-900">
              {isSi ? "පංචාංගය (ප්‍රධාන අංග 5)" : "Five Limbs of Panchangam"}
            </h3>
          </div>
          <CardContent className="p-4">
            <Row label={isSi ? "තිථිය" : "Tithi (Lunar Day)"} value={panchangam.tithi} />
            <Row label={isSi ? "වාරය" : "Vara (Weekday)"} value={panchangam.vara} />
            <Row label={isSi ? "නකත" : "Nakshatra (Star)"} value={panchangam.nakshatra} />
            <Row label={isSi ? "යෝගය" : "Yoga"} value={panchangam.yoga} />
            <Row label={isSi ? "කරණය" : "Karana"} value={panchangam.karana} />
            <Row label={isSi ? "පක්ෂය" : "Paksha (Phase)"} value={panchangam.paksha} />
          </CardContent>
        </Card>

        {/* Avakhada Chakra */}
        <Card className="border-emerald-100 shadow-sm overflow-hidden">
          <div className="bg-emerald-50/50 p-4 border-b border-emerald-100">
            <h3 className="font-bold text-emerald-900">
              {isSi ? "අවඛඩ චක්‍රය" : "Avakhada Chakra"}
            </h3>
          </div>
          <CardContent className="p-4">
            <Row label={isSi ? "වර්ණ" : "Varna (Caste)"} value={avakhada.varna} />
            <Row label={isSi ? "වශ්‍ය" : "Vashya (Control)"} value={avakhada.vashya} />
            <Row label={isSi ? "යෝනි" : "Yoni (Species)"} value={avakhada.yoni} />
            <Row label={isSi ? "ගණ" : "Gana (Temperament)"} value={avakhada.gana} />
            <Row label={isSi ? "නාඩි" : "Nadi (Pulse)"} value={avakhada.nadi} />
            <Row label={isSi ? "තත්ත්ව" : "Tatva (Element)"} value={avakhada.tatva} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}