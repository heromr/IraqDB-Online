import React, { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, direction } = useLanguage();
  const t = getTranslations(language);
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues with next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Database className={`text-primary ${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-6 w-6`} />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {theme === "dark" ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
