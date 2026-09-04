"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const primaryLinks = [
    { href: "/", label: t("nav.home") || "Home" },
    { href: "/free-horoscope", label: t("nav.freeHoroscope") || "Free Horoscope" },
    { href: "/kundli-matching", label: t("nav.kundliMatching") || "Kundli Matching" },
  ];

  const serviceLinks = [
    { href: "/daily-horoscope", label: t("menu.dailyHoroscope") || "Daily Horoscope" },
    { href: "/weekly-horoscope", label: t("menu.weeklyHoroscope") || "Weekly Horoscope" },
    { href: "/yearly-horoscope", label: t("menu.yearlyHoroscope") || "Yearly Horoscope" },
    { href: "/career-horoscope", label: t("menu.careerHoroscope") || "Career Horoscope" },
    { href: "/marriage-predictions", label: t("menu.marriagePredictions") || "Marriage Predictions" },
    { href: "/wealth-horoscope", label: t("menu.wealthHoroscope") || "Wealth Horoscope" },
    { href: "/health-horoscope", label: t("menu.healthHoroscope") || "Health Horoscope" },
    { href: "/numerology", label: t("menu.numerology") || "Numerology" },
    { href: "/gemstone", label: t("menu.gemstone") || "Gem Recommendation" },
  ];

  const otherLinks = [
    { href: "/consult", label: t("nav.consult") || "Consult Astrologer" },
    { href: "/reports", label: t("nav.reports") || "Reports" },
  ];

  const allLinks = [...primaryLinks, ...serviceLinks, ...otherLinks];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md shadow-sm"}`}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-primary" suppressHydrationWarning>
            {t("app.name") || "Methjothisa"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          
          <div className="relative group">
            <button className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 h-16">
              {t("nav.services")} <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-16 left-0 w-56 bg-white border border-border rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {otherLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 border-l border-border pl-6 ml-2">
            {user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? (
              <Link href="/admin"><Button variant="ghost" size="sm">Admin</Button></Link>
            ) : null}
            {user ? (
              <Link href="/modules/astrology-studio/dashboard">
                <Button variant="default" size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">{t("nav.dashboard") || "Dashboard"}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">{t("nav.login") || "Login"}</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">{t("nav.signup") || "Sign Up"}</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium py-2 border-b border-border/50 text-muted-foreground"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border/50 pt-4 mt-2">
              {user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? (
                <Link href="/admin" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start">Admin</Button>
                </Link>
              ) : null}
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/modules/astrology-studio/dashboard" onClick={closeMenu}>
                    <Button variant="cosmic" className="w-full">{t("nav.dashboard") || "Dashboard"}</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => { logout(); closeMenu(); }}>Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="ghost" className="w-full">{t("nav.login") || "Login"}</Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <Button variant="cosmic" className="w-full">{t("nav.signup") || "Sign Up"}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
