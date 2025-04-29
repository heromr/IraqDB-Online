import React from 'react';
import { Language, useLanguage } from '@/lib/languageContext';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const t = getTranslations(language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('english')} className={language === 'english' ? 'bg-primary/10' : ''}>
          {t.english}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('arabic')} className={language === 'arabic' ? 'bg-primary/10' : ''}>
          {t.arabic}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('kurdish')} className={language === 'kurdish' ? 'bg-primary/10' : ''}>
          {t.kurdish}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}