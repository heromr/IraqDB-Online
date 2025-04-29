import React from "react";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";

export function Footer() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {t.appTitle}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
