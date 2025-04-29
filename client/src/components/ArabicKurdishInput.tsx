import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { isArabicOrKurdish } from '@/lib/translations';
import { useLanguage } from '@/lib/languageContext';
import { getTranslations } from '@/lib/translations';

interface ArabicKurdishInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

const ArabicKurdishInput = forwardRef<HTMLInputElement, ArabicKurdishInputProps>(
  ({ onValueChange, onChange, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();
    const t = getTranslations(language);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Allow empty input
      if (!value) {
        setError(null);
        if (onChange) onChange(e);
        if (onValueChange) onValueChange(value);
        return;
      }
      
      // Validate input for Arabic/Kurdish characters
      if (isArabicOrKurdish(value)) {
        setError(null);
        if (onChange) onChange(e);
        if (onValueChange) onValueChange(value);
      } else {
        setError(t.onlyArabicKurdish);
        // Still call onChange to ensure form values are updated
        // but the error state will be visible to the user
        if (onChange) onChange(e);
        if (onValueChange) onValueChange(value);
      }
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          onChange={handleInputChange}
          className={`${className} ${error ? 'border-red-500 pr-10' : ''}`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500" id="input-error-message">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ArabicKurdishInput.displayName = 'ArabicKurdishInput';

export { ArabicKurdishInput };