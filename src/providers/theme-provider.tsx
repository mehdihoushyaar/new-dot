"use client";
import { useEffect, type ReactNode } from "react";
import { useLanguageStore } from "@/store/language.store";
import i18n from "@/i18n";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    const dir = language === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.documentElement.style.setProperty(
      "--font-main",
      language === "fa" ? "iransans, sans-serif" : "Chirp, sans-serif"
    );
    i18n.changeLanguage(language);
  }, [language]);

  return <>{children}</>;
}
