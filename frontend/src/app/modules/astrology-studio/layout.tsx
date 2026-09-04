"use client";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "@/styles/globals.css";

export default function AstrologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <main className="min-h-screen bg-slate-50">{children}</main>
            <Footer />
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
