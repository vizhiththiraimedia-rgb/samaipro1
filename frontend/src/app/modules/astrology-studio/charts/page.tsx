"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, FileText, Crown } from "lucide-react";

export default function ChartsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${language === "si" ? "elegant-sinhala" : "font-display"}`}>
            {language === "si" ? "ඔබේ කේන්ද්‍ර සටහන්" : "Your Charts"}
          </h1>
          <p className="text-muted-foreground">
            {language === "si" ? "ඔබගේ කේන්ද්‍ර සටහන් නරඹා විශ්ලේෂණය කරන්න" : "View and analyze your birth charts"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-purple-600" /> {language === "si" ? "කේන්ද්‍ර සටහන්" : "Birth Charts"}</CardTitle>
              <CardDescription>{language === "si" ? "ඔබ විසින් සාදන ලද කේන්ද්‍ර සටහන්" : "Your generated birth charts"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/birth-chart"><Button variant="cosmic" className="w-full">{language === "si" ? "කේන්ද්‍රය සාදන්න" : "Generate Chart"}</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-indigo-600" /> {language === "si" ? "වාර්තා" : "Reports"}</CardTitle>
              <CardDescription>{language === "si" ? "AI මඟින් ජනනය කළ තොරතුරු" : "AI-generated insights"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reports"><Button variant="cosmic" className="w-full">{language === "si" ? "වාර්තා බලන්න" : "View Reports"}</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-600" /> {language === "si" ? "ප්‍රිමියම්" : "Premium"}</CardTitle>
              <CardDescription>{language === "si" ? "වැඩිදුර පහසුකම් ලබාගන්න" : "Unlock more features"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing"><Button variant="cosmic" className="w-full">{language === "si" ? "ප්‍රිමියම් ලබාගන්න" : "Upgrade"}</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
