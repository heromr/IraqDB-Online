import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { Record } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FamilyMembersProps {
  familyId: string;
  database: string;
}

export function FamilyMembers({ familyId, database }: FamilyMembersProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  const { data: familyMembers, isLoading, error } = useFamilyMembers({
    familyId,
    database,
  });

  const formatBirthDate = (birthDate: string | number | null) => {
    if (!birthDate) return '';
    
    if (typeof birthDate === 'string' && 
        String(birthDate).endsWith('00') &&
        String(birthDate).length > 4) {
      return String(birthDate).slice(0, -2);
    }
    
    return birthDate;
  };

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-medium text-teal-700 dark:text-teal-500">{t.familyMembers}</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-medium text-teal-700 dark:text-teal-500">{t.familyMembers}</h3>
        </div>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!familyMembers || familyMembers.length === 0) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-medium text-teal-700 dark:text-teal-500">{t.familyMembers}</h3>
        </div>
        <Alert>
          <AlertDescription>
            {t.noFamilyMembers}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-teal-500" />
        <h3 className="text-lg font-medium text-teal-700 dark:text-teal-500">{t.familyMembers}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map((member) => (
          <Card key={member.first_name + "-" + member.father_name} className="overflow-hidden">
            <CardHeader className="bg-teal-50 dark:bg-teal-900/20 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-400">
                {member.first_name} {member.father_name} {member.grandfather_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2 text-sm">
                {member.birth_date && (
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">{t.fields.birth_date}:</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{formatBirthDate(member.birth_date)}</dd>
                  </div>
                )}
                
                {member.mother_name && (
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">{t.fields.mother_name}:</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{member.mother_name}</dd>
                  </div>
                )}
                
                {member.maternal_grandfather && (
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">{t.fields.maternal_grandfather}:</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{member.maternal_grandfather}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
