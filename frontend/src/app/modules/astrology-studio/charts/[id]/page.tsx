"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Moon, Sun, Sparkles, Loader2, User, Star, Clock, Compass } from "lucide-react";
import { ChartRenderer } from "@/components/astrology/chart-renderer";
import { PanchangamTab } from "@/components/astrology/panchangam-tab";
import { InfoTab } from "@/components/astrology/info-tab";
import { DasaViewer } from "@/components/astrology/dasa-viewer";
import { YogaList } from "@/components/astrology/yoga-list";
import { GrahaDetails } from "@/components/astrology/graha-details";
import { PDFBookGenerator } from "@/components/astrology/pdf-book-generator";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const SIGN_KEY_MAP: Record<string, string> = {
  "mesha": "aries",
  "vrishabha": "taurus",
  "mithuna": "gemini",
  "karka": "cancer",
  "simha": "leo",
  "kanya": "virgo",
  "tula": "libra",
  "vrischika": "scorpio",
  "dhanu": "sagittarius",
  "makara": "capricorn",
  "kumbha": "aquarius",
  "meena": "pisces"
};

export default function ChartPage() {
  const params = useParams();
  const id = params.id as string;
  const { t, language } = useLanguage();
  
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east' | 'kendare'>('kendare');
  const [activeVarga1, setActiveVarga1] = useState<string>('D1');
  const [activeVarga2, setActiveVarga2] = useState<string>('D9');
  const [activeVarga3, setActiveVarga3] = useState<string>('Composite_D1_Transit');
  const [activeDeepDive, setActiveDeepDive] = useState<any>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pages = document.querySelectorAll('.pdf-page');
      if (!pages || pages.length === 0) return;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 800,
          height: 1131
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(`MethJothisa_Horoscope_${chartData?.birthDetails?.fullName?.replace(/\s+/g, '_') || 'chart'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };


  useEffect(() => {
    async function fetchChart() {
      try {
        const res = await fetch(`/api/charts/${id}`);
        const data = await res.json();
        setChartData(data.data);
      } catch (err) {
        console.error("Failed to fetch chart", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChart();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950/5"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>;
  if (!chartData) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Failed to load chart</div>;

  const openLagnaDeepDive = () => {
    setActiveDeepDive({
      title: `${t("zodiac." + (SIGN_KEY_MAP[chartData.lagna?.toLowerCase()] || chartData.lagna?.toLowerCase())) || chartData.lagna} (Lagna / Ascendant)`,
      badge: "Self & Life Destiny (Tanu Bhava)",
      icon: "",
      overview: language === 'si' 
        ? `ලග්නය යනු ඔබ උපන් මොහොතේ නගෙනහිර ක්ෂිතිජයෙන් උදවෙමින් පවති රියයි. එය ඔබගේ මූලික අනන්යතවය, රීරික ක්තිය, බහිර පෙනුම සහ ඔබ ලකය දකින ආකරය තීරණය කරයි.`
        : `Lagna is the rising sign on the eastern horizon at the exact moment of birth. It defines your core identity, physical vitality, outward persona, and the foundational lens through which you experience the universe.`,
      psychology: language === 'si'
        ? `මෙම ලග්නයෙන් උපන් අය විේෂ චින්තන රටවකින් සහ සහජ නයකත්ව ලක්ෂණ වලින් යුක්ත වේ. අරමුණක් කර යමේ සහජ හකියවක් මොවුන්ට ඇත.`
        : `Individuals born with this Ascendant are characterized by distinct cognitive pathways, natural instinct, and sharp perceptual faculties. You possess an innate drive to build purpose-driven milestones.`,
      astrologicalImpact: language === 'si'
        ? `පළමු භාවය (කේන්ද්‍ර සහ ත්රිකණස්ථනයක් ලෙස) ඔබගේ කේන්ද්‍රයේ ප්රධන ආරක්ෂකය ලෙස ක්රිය කරයි. ධනය (2), ධෛර්යය (3), දේපල (4), බුද්ධිය (5) සහ රකියව (10) යන සියල්ල ලග්නය මත පදනම්ව තීරණය වේ.`
        : `As the 1st House (Kendra & Trikona simultaneously), your Ascendant acts as the prime guardian of your chart. Placements from Lagna establish all 12 life dimensions: wealth (2nd), courage (3rd), property (4th), intelligence (5th), and career (10th).`,
      remedies: language === 'si'
        ? `ඔබේ ලග්නධිපති ග්‍රහය ක්තිමත් කිරීම සඳහ උදෑසන භවන කිරීම සහ අදළ ග්‍රහයට ගළපෙන මණික් පලඳීම සුදුසුය.`
        : `Strengthen your Lagna Lord through conscious morning meditation, and aligning decisions with your natural elemental energy.`
    });
  };

  const openRasiDeepDive = () => {
    setActiveDeepDive({
      title: `${t("zodiac." + (SIGN_KEY_MAP[chartData.moonSign?.toLowerCase()] || chartData.moonSign?.toLowerCase())) || chartData.moonSign} (Moon Sign / Rasi)`,
      badge: "Mind & Emotional Subconscious (Chandra)",
      icon: "🌙",
      overview: language === 'si'
        ? `චන්ද්‍ර රාශිය (ජන්ම රිය) මගින් ඔබගේ යටි සිත, චිත්තවේගීය සමතුලිතතවය, සහජ ප්රතික්රිය සහ මතකය පලනය කරයි. වෛදික ජ්යතිෂයට අනුව මනස සෞඛ්ය සම්පන්න වීමට ලග්නය මෙන්ම චන්ද්‍ර රාශියද ඉත වදගත් වේ.`
        : `Moon Sign (Janma Rasi) governs your subconscious mind, emotional equilibrium, instinctual reactions, memory retention, and how you internalize experiences. In Vedic astrology, the Moon is as crucial as the Ascendant for psychological health.`,
      psychology: language === 'si'
        ? `මෙම රියේ චන්ද්‍රය පිහිටීම නිස ඔබ ගඹුරු සංවේදී බවකින් සහ ඉහළ නිර්මණීලී පරිකල්පනයකින් යුක්ත වේ. පවුලේ අයට සහ හිතවතුන්ට දඩි රකවරණයක් ලබ දෙයි.`
        : `With the Moon placed here, your mind operates with acute intuitive receptivity. You possess deep empathetic sensitivity, high creative imagination, and a strong protective instinct toward family, allies, and creative projects.`,
      astrologicalImpact: language === 'si'
        ? `ඔබගේ විංත්තරී මහ දවන් සහ ගෝචර ගමන් සඳහ පදනම වන්නේ චන්ද්‍ර රාශියයි. ගුරු සහ නි ග්‍රහයන් චන්ද්‍රය මතින් ගමන් කිරීමේදී වෘත්තීය සහ ජීවිතයේ විල පෙරළි සිදුවේ.`
        : `Your Moon sign is the foundation for all Vimshottari Mahadasha timing and Gocharam (transit) impacts. Favorable transits of Jupiter and Saturn over your Moon create major career surges and emotional breakthroughs.`,
      remedies: language === 'si'
        ? `සඳුද දිනවල 'ඕම් නමඃ ිවය' හ 'ඕම් චන්ද්‍රය නමඃ' ගයන කිරීම, රිදී ආභරණ පලඳීම සහ ජලය පනය කිරීමෙන් චන්ද්‍ර බලය වර්ධනය කරගත හක.`
        : `Honor Moon energy with silver ornaments, drinking water from silver vessels, maintaining emotional hydration, and reciting 'Om Namah Shivaya' or 'Om Chandraya Namaha' on Mondays.`
    });
  };

  const openNakshatraDeepDive = () => {
    setActiveDeepDive({
      title: `${chartData.nakshatra} (Birth Star / Nakshatra)`,
      badge: `Pada ${chartData.pada} · Karmic Blueprint`,
      icon: "✨",
      overview: language === 'si'
        ? `${chartData.nakshatra} යනු ඔබ උපන් මොහොතේ චන්ද්‍රය ගමන් කළ නකතයි. මෙයින් ඔබගේ කර්ම ක්තිය, සුවිේෂී දක්ෂත, සහජ ගතිගුණ සහ අධ්යත්මික සම්බන්ධතවය පෙන්නුම් කරයි.`
        : `${chartData.nakshatra} is the lunar mansion presiding at your birth. It reveals your soul's karmic blueprint, unique talents, temperament, and spiritual alignment.`,
      psychology: language === 'si'
        ? `මෙම නකතේ බලපෑමෙන් ඔබ ස්වභවිකවම පෂණය කිරීමේ හකියව, නොපසුබට උත්සහය සහ ගඹුරු බුද්ධියක් ප්රදර්නය කරයි. ${chartData.pada} වන පදය ඔබගේ මනසික විනය තහවුරු කරයි.`
        : `You naturally radiate nurturing power, perseverance, intellectual depth, and unwavering loyalty. Pada ${chartData.pada} anchors your mental discipline and ethical focus.`,
      astrologicalImpact: language === 'si'
        ? `මෙම නකතට අධිපති ග්‍රහයගෙන් ඔබගේ ජීවිතයේ පළමු විංත්තරී දව ආරම්භ විය. එය ඔබගේ ජීවිතයේ හරවුම් ලක්ෂ්යයන්හිදී බුද්ධිමය ආරක්ෂව සහ අධ්යත්මික උසස්වීම ලබ දෙයි.`
        : `The planetary ruler of this star initiated your life's first Vimshottari Dasha period. It grants continuous wisdom, intellectual protection, and spiritual elevation throughout life transitions.`,
      remedies: language === 'si'
        ? `සෑම මසකම චන්ද්‍රය ${chartData.nakshatra} නකත මතින් ගමන් කරන දිනවල ආගමික වතවත්වල නිරත වීම සහ ආහර දනමන පිරිනමීම ඉත සුබදයකය.`
        : `Connect with divine energy during monthly Moon transits over ${chartData.nakshatra}. Support charitable endeavors aligned with food nourishment and educational patronage.`
    });
  };

  const openDashaDeepDive = () => {
    setActiveDeepDive({
      title: `Vimshottari Dasha Timeline`,
      badge: "Karmic Timing Engine",
      icon: "",
      overview: language === 'si'
        ? `විංත්තරී ද ක්රමය යනු මිනිස් ආයුෂ වසර 120ක් ලෙස සලක ජීවිතයේ සිදුවීම් පලනය කරන ග්‍රහ කලසටහනයි. එක් එක් මහ දවන් මගින් ජීවිතයට අදළ විේෂ අවස්ථවන් සහ පරිවර්තනයන් ඇති කරයි.`
        : `The Vimshottari Dasha system is the 120-year cycle of planetary periods that controls the unfolding of life events. Each Mahadasha activates specific houses, bringing tailored opportunities, career shifts, and personal evolution.`,
      psychology: language === 'si'
        ? `එක් දවකින් තවත් දවකට මරු වීමේදී දඩි මනවිද්යත්මක වෙනස්කම් සිදුවේ. ග්‍රහයගේ ස්වභවය අනුව ඔබගේ අරමුණු, වටිනකම් සහ සබඳත වෙනස් වීමට ලක්වේ.`
        : `Transitions between Dasha periods mark profound psychological transformations. As you shift from one planetary ruler to another, your ambitions, values, relationships, and energetic focus evolve accordingly.`,
      astrologicalImpact: language === 'si'
        ? `ඔබගේ උපත සිදුවී ඇත්තේ ${chartData.vimshottariDasa?.[0]?.formatted?.split(':')[0]?.trim() || 'මෙම දවෙන්'} වන අතර, තවත් ${chartData.vimshottariDasa?.[0]?.formatted?.split(':')[1]?.trim() || 'යම් කලයක්'} ඉතිරිව ඇත. මෙය ඔබගේ අධ්යපනය, විවහය සහ ධනය ඉපයීමේ කලරේඛව තීරණය කරයි.`
        : `Your birth opened with ${chartData.vimshottariDasa?.[0]?.formatted?.split(':')[0]?.trim() || 'this Dasha'}, with a balance of ${chartData.vimshottariDasa?.[0]?.formatted?.split(':')[1]?.trim() || 'remaining years'}. This sets the chronological roadmap for your education, marriage, wealth creation, and spiritual awakening.`,
      remedies: language === 'si'
        ? `දනට පවතින මහ දධිපති ග්‍රහයට අදළ මන්ත්ර ගයන කිරීම සහ එම ග්‍රහය නියජනය කරන යහපත් ක්රියවන්හි නිරත වීම සුදුසුය.`
        : `During any active Mahadasha, chant the dedicated planetary mantra and perform service aligned with that planet's archetypal energy.`
    });
  };

  const handlePlanetClick = (p: any) => {
    setActiveDeepDive({
      title: `${p.name} in ${t("zodiac." + (SIGN_KEY_MAP[p.sign?.toLowerCase()] || p.sign?.toLowerCase())) || p.sign}`,
      badge: `House ${p.house} Placement`,
      icon: "",
      overview: language === 'si'
        ? `${p.name} ග්‍රහය ඔබගේ කේන්ද්‍රයේ සුවිේෂී වි්වීය ක්තියක් නියජනය කරයි. එය ${t("zodiac." + (SIGN_KEY_MAP[p.sign?.toLowerCase()] || p.sign?.toLowerCase())) || p.sign} රියේ අංක ${p.degree.toFixed(2)} ක පිහිට ඇත.`
        : `${p.name} represents specific cosmic energy in your blueprint. In this chart, it is positioned in ${t("zodiac." + (SIGN_KEY_MAP[p.sign?.toLowerCase()] || p.sign?.toLowerCase())) || p.sign} at ${p.degree.toFixed(2)}°.`,
      psychology: language === 'si'
        ? `${p.house} වන්න හරහ ඔබගේ අවධනය සහ හකියවන් මෙහෙයවනු ලබයි. මෙම පිහිටීම මගින් අදළ භවය නියජනය කරන ජීවිතයේ අංයන් කෙරෙහි ඔබගේ ප්රවේය ගඹුරින් බලපයි.`
        : `Channels focused energy and distinct capabilities into the matters of House ${p.house}. This placement deeply influences your approach to the life themes governed by this house.`,
      astrologicalImpact: language === 'si'
        ? `ප්රධන ග්‍රහයෙකු ලෙස මෙම ග්‍රහයගේ දෘෂ්ටිය ප්රතිවිරුද්ධ සහ ත්රිකණ ස්ථන වෙත යොමු වීමෙන් එම අංයන් වඩත් සක්රීය වේ. ${p.house} වන්නේ ක්රියකරීත්වය හරහ ඔබගේ දෛවය හඩගස්වයි.`
        : `Radiates planetary aspects (Drishti) across opposing and trinal houses, bringing energetic momentum to those areas. As a key planet, its energy interacts with the ${p.house}th house to shape personal destiny.`,
      remedies: language === 'si'
        ? `${p.name} ග්‍රහයට අදළ මන්ත්ර ගයන කිරීම, උදෑසන භවන කිරීම සහ එම ග්‍රහයගේ යහපත් ගතිගුණ ජීවිතයට එකතු කරගනීමෙන් අපල සමනය වේ.`
        : `Honor ${p.name} with focused morning contemplation, dedicated mantra repetition, and conscious expression of its positive traits.`
    });
  };

  const planets = Object.keys(chartData.planetaryPositions || {}).map(name => ({
    name,
    ...chartData.planetaryPositions[name]
  }));

  const renderTabTrigger = (val: string, label: string) => (
    <TabsTrigger value={val} className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold text-sm md:text-base">
      {label}
    </TabsTrigger>
  );

  const formattedDob = chartData.birthDetails?.dateOfBirth 
    ? new Date(chartData.birthDetails.dateOfBirth).toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "";

  return (
    <div className="container mx-auto py-4 md:py-8 px-3 sm:px-4 max-w-[1350px] overflow-x-hidden">
      {/* Page Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-purple-950 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            {language === 'si' ? "ලග්න සහ රාශි කේන්ද්‍ර විස්තරය" : "Astrology Studio & Birth Chart"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'si' ? "ලග්න කේන්ද්‍රය, රාශි සටහන් සහ උපන් ග්‍රහ පිහිටීම් පිළිබඳ සම්පූර්ණ විස්තරය." : "Vedic Kendare, planetary coordinates, and birth status dashboard."}
          </p>
        </div>
        <Button 
          onClick={handleDownloadPdf} 
          disabled={isGeneratingPdf} 
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md flex items-center shrink-0"
        >
          {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {language === 'si' ? "PDF ලෙස බාගන්න" : "Download PDF Book"}
        </Button>
      </div>

      <div id="pdf-content-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start bg-white p-4 rounded-xl">
        {/* Left Column: Birth Details Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-purple-100">
            <CardHeader className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{language === 'si' ? "උපත් තොරතුරු" : "Birth Information"}</CardTitle>
                  <CardDescription className="text-purple-200/80 text-xs">{language === 'si' ? "කේන්ද්‍රය සකසූ උපත් දත්ත" : "Calculated parameters"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-slate-800">
              <div>
                <span className="text-xs text-muted-foreground block">{language === 'si' ? "සම්පූර්ණ නම" : "Full Name"}</span>
                <span className="font-bold text-base">{chartData.birthDetails?.fullName || "Guest User"}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">{language === 'si' ? "ස්ත්රී / පුරුෂ භවය" : "Gender"}</span>
                  <span className="font-semibold text-sm capitalize">{chartData.birthDetails?.gender || "Male"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{language === 'si' ? "දිනය" : "Date of Birth"}</span>
                  <span className="font-semibold text-sm">{formattedDob}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">{language === 'si' ? "වේලව" : "Birth Time"}</span>
                  <span className="font-semibold text-sm">{chartData.birthDetails?.birthTime || "12:00 AM"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{language === 'si' ? "උපත් ස්ථානය" : "Place of Birth"}</span>
                  <span className="font-semibold text-sm truncate block">{chartData.birthDetails?.birthPlace || "Colombo"}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Latitude</span>
                  <span className="font-semibold text-sm">{chartData.birthDetails?.latitude || "6.9271"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Longitude</span>
                  <span className="font-semibold text-sm">{chartData.birthDetails?.longitude || "79.8612"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: 4 Cards and Tabs Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top 4 Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Lagna Card */}
            <div onClick={openLagnaDeepDive} className="bg-purple-50/50 border border-purple-200/60 rounded-xl p-4 text-center shadow-sm cursor-pointer hover:ring-2 hover:ring-purple-400 hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">{language === 'si' ? "ලග්නය" : "Lagna (Ascendant)"}</span>
              <span className="text-lg font-black text-purple-900 block mt-1">{t("zodiac." + (SIGN_KEY_MAP[chartData.lagna?.toLowerCase()] || chartData.lagna?.toLowerCase())) || chartData.lagna}</span>
              <span className="text-[10px] text-purple-600 font-semibold">{language === 'si' ? "පළමු භාවය" : "1st House"}</span>
            </div>

            {/* Rasi Card */}
            <div onClick={openRasiDeepDive} className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl p-4 text-center shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">{language === 'si' ? "රාශිය (සඳු)" : "Rasi (Moon Sign)"}</span>
              <span className="text-lg font-black text-indigo-900 block mt-1">{t("zodiac." + (SIGN_KEY_MAP[chartData.moonSign?.toLowerCase()] || chartData.moonSign?.toLowerCase())) || chartData.moonSign}</span>
              <span className="text-[10px] text-indigo-600 font-semibold">{language === 'si' ? "චන්ද්‍ර රාශිය" : "Moon Sign"}</span>
            </div>

            {/* Nakshatra Card */}
            <div onClick={openNakshatraDeepDive} className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 text-center shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-400 hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">{language === 'si' ? "ජන්ම නැකත" : "Birth Star"}</span>
              <span className="text-base font-black text-emerald-900 block mt-1 truncate">{chartData.nakshatra}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{language === 'si' ? `${chartData.pada} වන පදය` : `Pada ${chartData.pada}`}</span>
            </div>

            {/* Dasha Balance Card */}
            <div onClick={openDashaDeepDive} className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 text-center shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-400 hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">{language === 'si' ? "දශාව" : "Dasha Balance"}</span>
              <span className="text-[13px] font-black text-amber-900 block mt-1 truncate">{chartData.vimshottariDasa?.[0]?.formatted?.split(':')[1]?.trim() || "Saturn Dasa"}</span>
              <span className="text-[10px] text-amber-600 font-semibold">{chartData.vimshottariDasa?.[0]?.formatted?.split(':')[0]?.trim() || "Birth Dasha"}</span>
            </div>
          </div>

          {/* Interactive Chart & Details Tabs */}
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 bg-slate-100 p-1.5 rounded-xl mb-6">
              {renderTabTrigger("chart", language === 'si' ? "කේන්ද්‍ර සටහන" : "Rasi Chart")}
              {renderTabTrigger("planets", language === 'si' ? "ග්‍රහ පිහිටීම්" : "Planetary Positions")}
              {renderTabTrigger("vargas", language === 'si' ? "නවංකය (D9)" : "Varga Charts")}
              {renderTabTrigger("ashtakavarga", language === 'si' ? "අෂ්ටකවර්ග" : "Ashtakavarga")}
              {renderTabTrigger("transit", language === 'si' ? "ගෝචර ගමන" : "Live Transit")}
              {renderTabTrigger("premium", language === 'si' ? "ප්‍රිමියම් විශ්ලේෂණය" : "Premium Karma & Remedies")}
            </TabsList>

            <TabsContent value="chart" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                  <div>
                    <CardTitle className="text-xl text-slate-800">{language === 'si' ? "උපත් ලග්න කේන්ද්‍රය (D1)" : "Rasi Chart (D1)"}</CardTitle>
                    <CardDescription>{language === 'si' ? "ලග්නය පදනම් කරගත් කේන්ද්‍ර සටහන" : "Lagna-based astronomical chart layout"}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  {/* Style Toggle Bar */}
                    <div className="flex flex-wrap gap-2 mb-6 bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <Button variant={chartStyle === 'kendare' ? "cosmic" : "ghost"} size="sm" onClick={() => setChartStyle('kendare')} className="font-semibold text-xs">dY'Z {language === 'si' ? "Traditional Kendare" : "Traditional Kendare"}</Button>
                      <Button variant={chartStyle === 'south' ? "cosmic" : "ghost"} size="sm" onClick={() => setChartStyle('south')} className="font-semibold text-xs">{language === 'si' ? "South Indian Grid" : "South Indian Grid"}</Button>
                      <Button variant={chartStyle === 'north' ? "cosmic" : "ghost"} size="sm" onClick={() => setChartStyle('north')} className="font-semibold text-xs">{language === 'si' ? "North Indian Grid" : "North Indian Grid"}</Button>
                    </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                        {/* Chart 1 */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 mb-4 w-full">
                            <label className="text-xs font-semibold text-indigo-800 px-2 whitespace-nowrap">Chart 1:</label>
                            <select className="text-sm bg-white border border-indigo-200 rounded px-2 py-1 outline-none text-indigo-900 font-medium cursor-pointer w-full" value={activeVarga1} onChange={(e) => setActiveVarga1(e.target.value)}>
                              <option value="D1">D-1 Rasi (Lagna)</option>
                              <option value="D2">D-2 Hora</option><option value="D3">D-3 Drekkana</option><option value="D4">D-4 Chaturthamsha</option><option value="D6">D-6 Shashthamsha</option><option value="D7">D-7 Saptamsha</option><option value="D8">D-8 Ashtamsha</option><option value="D9">D-9 Navamsha</option><option value="D10">D-10 Dashamsha</option><option value="D11">D-11 Rudramsha</option><option value="D12">D-12 Dvadashamsha</option><option value="D16">D-16 Shodashamsha</option><option value="D20">D-20 Vimshamsha</option><option value="D24">D-24 Chaturvimshamsha</option><option value="D27">D-27 Bhamsha</option><option value="D30">D-30 Trimshamsha</option><option value="D40">D-40 Khavedamsha</option><option value="D45">D-45 Akshavedamsha</option><option value="D60">D-60 Shashtyamsha</option><option value="D81">D-81 Navanavamsha</option><option value="Transit">Live Transit</option>
                            </select>
                          </div>
                          <ChartRenderer planets={activeVarga1 === 'Transit' ? chartData.transit?.planets : chartData?.vargas?.[activeVarga1] || planets} advancedPoints={activeVarga1 === 'D1' ? chartData?.advancedPoints : {}} style={chartStyle} onPlanetClick={handlePlanetClick} />
                        </div>

                        {/* Chart 2 */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 mb-4 w-full">
                            <label className="text-xs font-semibold text-indigo-800 px-2 whitespace-nowrap">Chart 2:</label>
                            <select className="text-sm bg-white border border-indigo-200 rounded px-2 py-1 outline-none text-indigo-900 font-medium cursor-pointer w-full" value={activeVarga2} onChange={(e) => setActiveVarga2(e.target.value)}>
                              <option value="D1">D-1 Rasi (Lagna)</option>
                              <option value="D2">D-2 Hora</option><option value="D3">D-3 Drekkana</option><option value="D4">D-4 Chaturthamsha</option><option value="D6">D-6 Shashthamsha</option><option value="D7">D-7 Saptamsha</option><option value="D8">D-8 Ashtamsha</option><option value="D9">D-9 Navamsha</option><option value="D10">D-10 Dashamsha</option><option value="D11">D-11 Rudramsha</option><option value="D12">D-12 Dvadashamsha</option><option value="D16">D-16 Shodashamsha</option><option value="D20">D-20 Vimshamsha</option><option value="D24">D-24 Chaturvimshamsha</option><option value="D27">D-27 Bhamsha</option><option value="D30">D-30 Trimshamsha</option><option value="D40">D-40 Khavedamsha</option><option value="D45">D-45 Akshavedamsha</option><option value="D60">D-60 Shashtyamsha</option><option value="D81">D-81 Navanavamsha</option><option value="Transit">Live Transit</option>
                            </select>
                          </div>
                          <ChartRenderer planets={activeVarga2 === 'Transit' ? chartData.transit?.planets : chartData?.vargas?.[activeVarga2] || planets} advancedPoints={activeVarga2 === 'D1' ? chartData?.advancedPoints : {}} style={chartStyle} onPlanetClick={handlePlanetClick} />
                        </div>

                        {/* Chart 3 */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 mb-4 w-full">
                            <label className="text-xs font-semibold text-indigo-800 px-2 whitespace-nowrap">Chart 3:</label>
                            <select className="text-sm bg-white border border-indigo-200 rounded px-2 py-1 outline-none text-indigo-900 font-medium cursor-pointer w-full" value={activeVarga3} onChange={(e) => setActiveVarga3(e.target.value)}>
                              <optgroup label="Single Charts">
                                <option value="D1">D-1 Rasi (Lagna)</option>
                                <option value="D9">D-9 Navamsha</option>
                                <option value="Transit">Live Transit</option>
                              </optgroup>
                              <optgroup label="Composite Charts">
                                <option value="Composite_D1_Transit">Lagna + Transit</option>
                                <option value="Composite_D1_D9">Lagna + Navamsha</option>
                                <option value="Composite_D4_Transit">D4 + Transit</option>
                              </optgroup>
                            </select>
                          </div>
                          <ChartRenderer 
                            planets={activeVarga3 === 'Transit' ? chartData.transit?.planets : chartData?.vargas?.[activeVarga3.replace('Composite_', '').split('_')[0]] || planets} 
                            compositePlanets={activeVarga3.startsWith('Composite_') ? (activeVarga3.split('_')[2] === 'Transit' ? chartData.transit?.planets : chartData?.vargas?.[activeVarga3.split('_')[2]]) : undefined}
                            advancedPoints={activeVarga3 === 'D1' ? chartData?.advancedPoints : {}} 
                            style={chartStyle} 
                            onPlanetClick={handlePlanetClick} 
                          />
                        </div>
                      </div>
                </CardContent>
              </Card>
                        </TabsContent>

            {/* NEW TABS PLACEHOLDERS */}
            <TabsContent value="panchangam" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "පංචාංගය" : "Panchangam Details"}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <PanchangamTab chartData={chartData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "තොරතුරු" : "Advanced Information"}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <InfoTab chartData={chartData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dasa" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "දසා" : "Vimshottari Dasa"}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-2 md:p-6">
                  <DasaViewer chartData={chartData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="yogas" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "යෝග" : "Astrological Yogas"}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-2 md:p-6 bg-slate-50">
                  <YogaList chartData={chartData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planets" className="space-y-6">
              <GrahaDetails chartData={chartData} />
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "ග්‍රහයන්ගේ පිහිටීම සහ පදයන්" : "Planetary Positions & Coordinates"}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto rounded-lg border border-slate-100">
                    <table className="w-full text-center border-collapse text-sm">
                      <thead>
                        <tr className="bg-purple-50 text-purple-950 font-bold">
                          <th className="p-3 border">{language === 'si' ? "ග්‍රහය" : "Planet"}</th>
                          <th className="p-3 border">{language === 'si' ? "රිය" : "Sign"}</th>
                          <th className="p-3 border">{language === 'si' ? "ස්ථනය (අංක)" : "Degree"}</th>
                          <th className="p-3 border">{language === 'si' ? "භවය" : "House"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planets.map(p => {
                          const isLagna = p.name === "Ascendant" || p.name === "Asc" || p.name === "Lagna";
                          return (
                            <tr key={p.name} className="hover:bg-slate-50/50">
                              <td className="p-3 border font-black text-slate-800">{isLagna ? (language === 'si' ? "ලග්නය (Ascendant)" : p.name) : p.name}</td>
                              <td className="p-3 border font-semibold text-slate-600">{t("zodiac." + (SIGN_KEY_MAP[p.sign?.toLowerCase()] || p.sign?.toLowerCase())) || p.sign}</td>
                              <td className="p-3 border font-mono text-slate-600">{p.degree.toFixed(2)}°</td>
                              <td className="p-3 border font-bold text-purple-700">{p.house}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vargas" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "නවංක කේන්ද්‍රය (D9)" : "Navamsha D9 Chart"}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  <ChartRenderer planets={chartData.vargas?.D9 || planets} style={chartStyle} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ashtakavarga" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">Ashtakavarga Bindus (SAV)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {Object.entries(chartData.ashtakavarga?.sav || {
                      "Mesha": 28, "Vrishabha": 30, "Mithuna": 26, "Karka": 32,
                      "Simha": 24, "Kanya": 28, "Tula": 31, "Vrischika": 29,
                      "Dhanu": 33, "Makara": 27, "Kumbha": 25, "Meena": 29
                    }).map(([sign, bindus]: [string, any]) => {
                      const numBindus = Number(bindus);
                      const isHigh = numBindus >= 30;
                      const isLow = numBindus < 25;
                      const colorClass = isHigh ? "text-emerald-600 bg-emerald-50 border-emerald-200" : (isLow ? "text-rose-600 bg-rose-50 border-rose-200" : "text-indigo-600 bg-indigo-50 border-indigo-200");
                      const barColor = isHigh ? "bg-emerald-500" : (isLow ? "bg-rose-500" : "bg-indigo-500");
                      
                      return (
                        <div key={sign} className={`border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:shadow-md ${colorClass}`}>
                          <span className="text-sm font-semibold uppercase tracking-wider mb-1 opacity-80">
                            {t("zodiac." + (SIGN_KEY_MAP[sign.toLowerCase()] || sign.toLowerCase())) || sign}
                          </span>
                          <span className="text-4xl font-black my-2">{numBindus}</span>
                          <span className="text-[10px] font-bold opacity-70 mb-3">BINDUS (SAV)</span>
                          
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${(numBindus / 45) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-700 mb-1">{language === 'si' ? "අෂ්ටකවර්ග (SAV) යනු කුමක්ද?" : "What is Ashtakavarga?"}</p>
                    <p>{language === 'si' ? "ලකුණු (Bindus) 28කට වඩ වඩි රීන් සුබ ඵල දෙන අතර, 25ට අඩු රීන් තරමක් දුර්වල වේ. වඩිම ලකුණු ඇති රියට ග්‍රහයන් ගචර වන කලය ඉත සර්ථක වේ." : "Signs with more than 28 bindus are considered strong and yield positive results during transits. Signs with less than 25 bindus are considered weak."}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transit" className="space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800">{language === 'si' ? "  " : "Live Gocharam Transits"}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  <ChartRenderer planets={chartData.transit?.planets || planets} style={chartStyle} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="premium" className="space-y-6">
              <Card className="shadow-md border-amber-200 bg-amber-50 relative overflow-hidden">
                {/* Premium Lock Overlay */}
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{language === 'si' ? "මෙය ප්‍රිමියම් පහසුකමකි" : "Premium Feature"}</h3>
                  <p className="text-slate-600 max-w-md mb-6">{language === 'si' ? "ඔබගේ කර්ම දෂ, ධන යග, සහ ග්‍රහ අපල සඳහ නිවරදි ප්රතිකර්ම (පූජ) දනගනීමට ප්‍රිමියම් වෙත මරුවන්න." : "Unlock deep karmic analysis, wealth yogas, and personalized remedial measures (Poojas) based on your unique birth chart."}</p>
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl border-0" onClick={() => window.location.href='/pricing'}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {language === 'si' ? "ප්‍රිමියම් ලබගන්න" : "Unlock Full Horoscope Book"}
                  </Button>
                </div>

                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" /> 
                    {language === 'si' ? "ගඹුරු කර්ම විශ්ලේෂණය" : "Deep Karmic Analysis"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 opacity-30 select-none">
                  <div className="space-y-8 pointer-events-none">
                    <div className="space-y-3">
                      <div className="h-6 bg-slate-300 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                      <div className="h-24 bg-slate-200 rounded w-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
      
      {/* Deep Dive Modal / Drawer */}
      {activeDeepDive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveDeepDive(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveDeepDive(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
            >
              ✕
            </button>
            
            <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50/50 border-b border-indigo-100/50">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">{activeDeepDive.icon}</div>
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full tracking-wide uppercase mb-2">
                {activeDeepDive.badge}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-indigo-950 mb-1 leading-tight">{activeDeepDive.title}</h2>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {language === 'si' ? "දළ විශ්ලේෂණය" : "Overview"}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{activeDeepDive.overview}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  {language === 'si' ? "මනවිද්යත්මක බලපෑම" : "Psychology"}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{activeDeepDive.psychology}</p>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  {language === 'si' ? "ජ්යතිෂ්යමය බලපෑම" : "Astrological Impact"}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{activeDeepDive.astrologicalImpact}</p>
              </div>

              <Separator />
              
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  {language === 'si' ? "පිළියම් සහ යහපත් ක්රිය" : "Remedies"}
                </h3>
                <p className="text-emerald-800 text-sm leading-relaxed">{activeDeepDive.remedies}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Generator Container for html2canvas */}
      <div style={{ position: 'absolute', top: '-99999px', left: '-99999px', zIndex: -1 }}>
        <div id="pdf-book-render-target">
          <PDFBookGenerator chartData={chartData} language={language} />
        </div>
      </div>

    </div>
  );
}



