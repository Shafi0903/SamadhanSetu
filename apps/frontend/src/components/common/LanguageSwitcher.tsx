"use client";

import * as React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageIcon } from "@heroicons/react/24/outline";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs cursor-pointer"
      title="Switch Language / भाषा बदलें"
    >
      <LanguageIcon className="w-3.5 h-3.5 text-indigo-600" />
      <span>{language === "en" ? "हिंदी" : "English"}</span>
    </button>
  );
}
