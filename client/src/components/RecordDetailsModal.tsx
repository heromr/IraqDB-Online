import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { Record } from "@/lib/types";
import { formatDatabaseName } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";
import { FamilyMembers } from "./FamilyMembers";

interface RecordDetailsModalProps {
  record: Record;
  isOpen: boolean;
  onClose: () => void;
}

export function RecordDetailsModal({ record, isOpen, onClose }: RecordDetailsModalProps) {
  const { language, direction } = useLanguage();
  const t = getTranslations(language);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <DialogTitle className="text-lg text-teal-700 dark:text-teal-400">{t.recordDetails}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 pt-4 border-t">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fullName}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                {record.first_name} {record.father_name} {record.grandfather_name}
              </dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.family_id}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{record.family_id}</dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.father_name}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{record.father_name}</dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.grandfather_name}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{record.grandfather_name}</dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.birth_date}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                {record.birth_date ? 
                  (typeof record.birth_date === 'string' && 
                   String(record.birth_date).endsWith('00') &&
                   String(record.birth_date).length > 4 ? 
                    String(record.birth_date).slice(0, -2) : 
                    record.birth_date) 
                  : ''}
              </dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.mother_name}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{record.mother_name}</dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fields.maternal_grandfather}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{record.maternal_grandfather}</dd>
            </div>
            
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.database}</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                {formatDatabaseName(record.database)}
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Family Members Section */}
        <FamilyMembers 
          familyId={record.family_id} 
          database={record.database} 
        />
        
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800"
          >
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
