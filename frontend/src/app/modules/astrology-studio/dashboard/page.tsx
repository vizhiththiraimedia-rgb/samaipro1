"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart3, FileText, Settings, Crown, Calendar, Loader2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/api/charts/list')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCharts(data.data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!mounted) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>;
  }

  if (!user) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><p>{language === 'si' ? 'කරුණාකර ඩෑෂ්බෝඩ් එකට පිවිසීමට ලොග් වන්න' : 'Please login to access dashboard'}</p></div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${language === 'si' ? 'elegant-sinhala' : 'font-display'}`}>{language === 'si' ? 'ආයුබෝවන්, ' : 'Welcome, '} {user.name}</h1>
          <p className="text-muted-foreground mt-2">{language === 'si' ? 'ඔබගේ ජ්‍යෝතිෂ්‍ය ගමන කළමනාකරණය කරන්න' : 'Manage your astrological journey'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: BarChart3, title: language === 'si' ? 'මගේ කේන්ද්‍ර සටහන්' : 'My Charts', description: language === 'si' ? 'සුරැකි කේන්ද්‍ර සටහන් බලන්න' : 'View saved birth charts', href: '#saved-charts', color: 'from-purple-500 to-indigo-500' },
            { icon: Crown, title: language === 'si' ? 'ප්‍රිමියම්' : 'Premium', description: language === 'si' ? 'ප්‍රිමියම් පහසුකම් ලබාගන්න' : 'Unlock deep features', href: '/pricing', color: 'from-amber-500 to-orange-500' },
            { icon: Settings, title: language === 'si' ? 'සැකසුම්' : 'Settings', description: language === 'si' ? 'ගිණුම වෙනස් කරන්න' : 'Account preferences', href: '/settings', color: 'from-slate-500 to-slate-700' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-purple-100">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-0.5">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div id="saved-charts" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24">
          <div className="lg:col-span-2">
            <Card className="shadow-md border-slate-200">
              <CardHeader className="border-b pb-4 bg-slate-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-800">{language === 'si' ? 'සුරැකි කේන්ද්‍ර සටහන්' : 'Saved Profiles & Charts'}</CardTitle>
                    <CardDescription className="mt-1">{language === 'si' ? 'ඔබ සහ ඔබගේ පවුලේ අයගේ ජ්‍යෝතිෂ්‍ය තොරතුරු' : 'Instantly access horoscopes without regenerating'}</CardDescription>
                  </div>
                  <Link href="/free-horoscope">
                    <Button variant="cosmic" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {language === 'si' ? 'නව කේන්ද්‍රයක්' : 'Add New Profile'}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-2" />
                    <p className="text-sm text-slate-500">Loading your saved charts...</p>
                  </div>
                ) : !Array.isArray(charts) || charts.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No profiles saved yet</h3>
                    <p className="text-slate-500 mb-6">Generate your first birth chart to save it here automatically.</p>
                    <Link href="/free-horoscope">
                      <Button variant="outline">Generate Horoscope</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {charts.map((chart, idx) => {
                      const dobStr = chart?.birthDetails?.dateOfBirth;
                      const dob = dobStr ? new Date(dobStr).toLocaleDateString() : 'Unknown Date';
                      return (
                        <div key={chart?.id || idx} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition-colors">{chart?.birthDetails?.fullName || 'Unknown'}</h4>
                              <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {dob}</span>
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold">{chart?.lagna || 'Unknown'} Lagna</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="group-hover:bg-purple-100 group-hover:text-purple-700"
                            onClick={() => router.push(`/charts/${chart.id}`)}
                          >
                            {language === 'si' ? 'බලන්න' : 'View Chart'} <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-md border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  {language === 'si' ? 'ප්‍රිමියම් පහසුකම්' : 'Premium Access'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-amber-900/80">
                <p className="text-sm">{language === 'si' ? 'ඔබගේ කේන්ද්‍රයේ සියලුම රහස්, කර්ම විශ්ලේෂණ, සහ පෞද්ගලික பரிகார (ප්‍රතිකර්ම) දැනගැනීමට ප්‍රිමියම් වෙත මාරුවන්න.' : 'Unlock deep karmic analysis, detailed planetary remedies, and traditional A-Z full life readings without generic AI text.'}</p>
                <Link href="/pricing" className="block">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg border-0">
                    {language === 'si' ? 'ප්‍රිමියම් ලබාගන්න' : 'Upgrade to Premium'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
