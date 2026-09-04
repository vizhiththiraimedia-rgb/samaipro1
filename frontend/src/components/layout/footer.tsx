"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function Footer() {
  const { t, language } = useLanguage();
  return (
    <footer className="border-t border-white/5 bg-background/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#d4af37] flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">M</span>
              </div>
              <span className="font-display text-xl font-bold" suppressHydrationWarning>{t("app.name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.freeReports")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/free-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ කේන්ද්‍රය" : "Free Horoscope"}</Link></li>
              <li><Link href="/free-kundli" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ ජන්මපත්‍රය" : "Free Kundli"}</Link></li>
              <li><Link href="/free-birth-chart" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ උපන් සටහන" : "Free Birth Chart"}</Link></li>
              <li><Link href="/career-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ වෘත්තීය කේන්ද්‍රය" : "Free Career Horoscope"}</Link></li>
              <li><Link href="/marriage-predictions" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ විවාහ අනාවැකි" : "Free Marriage Predictions"}</Link></li>
              <li><Link href="/wealth-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "නොමිලේ ධනය පිළිබඳ කේන්ද්‍රය" : "Free Wealth Horoscope"}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.horoscopes")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/yearly-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "වාර්ෂික කේන්ද්‍රය" : "Yearly Horoscope"}</Link></li>
              <li><Link href="/monthly-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "මාසික කේන්ද්‍රය" : "Monthly Horoscope"}</Link></li>
              <li><Link href="/daily-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "දෛනික කේන්ද්‍රය" : "Daily Horoscope"}</Link></li>
              <li><Link href="/weekly-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "සතිපතා කේන්ද්‍රය" : "Weekly Horoscope"}</Link></li>
              <li><Link href="/career-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "වෘත්තීය කේන්ද්‍රය" : "Career Horoscope"}</Link></li>
              <li><Link href="/health-horoscope" className="hover:text-foreground transition-colors">{language === "si" ? "සෞඛ්‍ය කේන්ද්‍රය" : "Health Horoscope"}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.predictions")} & {t("footer.matching")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/numerology" className="hover:text-foreground transition-colors">{language === "si" ? "සංඛ්‍යා විද්‍යාව" : "Numerology"}</Link></li>
              <li><Link href="/gemstone" className="hover:text-foreground transition-colors">{language === "si" ? "මැණික් නිර්දේශය" : "Gem Recommendation"}</Link></li>
              <li><Link href="/compatibility" className="hover:text-foreground transition-colors">{language === "si" ? "කේන්ද්‍ර ගැළපීම" : "Horoscope Matching"}</Link></li>
              <li><Link href="/love-compatibility" className="hover:text-foreground transition-colors">{language === "si" ? "ආදර ගැළපීම" : "Love Matching"}</Link></li>
              <li><Link href="/kundli-matching" className="hover:text-foreground transition-colors">{language === "si" ? "ජන්මපත්‍ර ගැළපීම" : "Kundli Matching"}</Link></li>
              <li><Link href="/name-matching" className="hover:text-foreground transition-colors">{language === "si" ? "නම් ගැළපීම" : "Name Matching"}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">{t("footer.aboutUs")}</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">{t("footer.blog")}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{t("footer.contactUs")}</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacyPolicy")}</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.termsOfService")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p suppressHydrationWarning> {t("app.name")}. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
