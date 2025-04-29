import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { AVAILABLE_DATABASES, formatDatabaseName } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";

interface DatabaseSelectorProps {
  selectedDatabases: string[];
  setSelectedDatabases: (databases: string[]) => void;
}

export function DatabaseSelector({ selectedDatabases, setSelectedDatabases }: DatabaseSelectorProps) {
  const { language, direction } = useLanguage();
  const t = getTranslations(language);
  const [selectionType, setSelectionType] = useState<"all" | "specific">("all");

  const handleSelectionTypeChange = (value: "all" | "specific") => {
    setSelectionType(value);
    if (value === "all") {
      setSelectedDatabases([]);
    }
  };

  const handleDatabaseChange = (database: string, checked: boolean) => {
    if (checked) {
      setSelectedDatabases([...selectedDatabases, database]);
    } else {
      setSelectedDatabases(selectedDatabases.filter(db => db !== database));
    }
  };

  const spaceDirection = direction === 'rtl' ? 'space-x-reverse' : 'space-x-2';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t.databaseSelection}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectionType} 
          onValueChange={(value) => handleSelectionTypeChange(value as "all" | "specific")}
          className="mb-4"
        >
          <div className={`flex items-center ${spaceDirection} mb-2`}>
            <RadioGroupItem value="all" id="allDatabases" />
            <Label htmlFor="allDatabases">{t.searchAllDatabases}</Label>
          </div>
          <div className={`flex items-center ${spaceDirection}`}>
            <RadioGroupItem value="specific" id="selectDatabases" />
            <Label htmlFor="selectDatabases">{t.selectSpecificDatabases}</Label>
          </div>
        </RadioGroup>
        
        {selectionType === "specific" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {AVAILABLE_DATABASES.map((database) => (
              <div key={database} className={`flex items-start ${spaceDirection}`}>
                <Checkbox 
                  id={`db-${database}`} 
                  checked={selectedDatabases.includes(database)}
                  onCheckedChange={(checked) => 
                    handleDatabaseChange(database, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`db-${database}`} 
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {formatDatabaseName(database)}
                </Label>
              </div>
            ))}
          </div>
        )}
        
        <div className={`mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center ${spaceDirection}`}>
          <InfoIcon className={`h-3 w-3 ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
          <span>{t.baghdadWarning}</span>
        </div>
      </CardContent>
    </Card>
  );
}
