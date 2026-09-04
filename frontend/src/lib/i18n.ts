export type SupportedLanguage = 
  | "en" | "ta" | "si" | "hi" | "ml" | "te" | "kn" 
  | "ar" | "es" | "fr" | "de" | "it" | "pt" | "zh" 
  | "ja" | "ko" | "ru" | "th" | "id" | "tr";

export const LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "id", name: "Indonesian", nativeName: "Indonesia" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "si";

export function getLanguageFromCookie(): SupportedLanguage {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && LANGUAGES.some((l) => l.code === match[1])) {
      return match[1] as SupportedLanguage;
    }
  }
  return "si";
}

export function getLanguageFromHeader(acceptLanguage: string): SupportedLanguage {
  const lang = acceptLanguage.split(",")[0]?.split("-")[0];
  if (lang && LANGUAGES.some((l) => l.code === lang)) {
    return lang as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}
