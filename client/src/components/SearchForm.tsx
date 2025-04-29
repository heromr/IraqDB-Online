import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { SearchQuery } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations, isArabicOrKurdish } from "@/lib/translations";
import { ArabicKurdishInput } from "./ArabicKurdishInput";

// Create validators for Arabic/Kurdish input
const arabicKurdishString = z.string().refine(
  (val) => !val || isArabicOrKurdish(val),
  { message: "Only Arabic and Kurdish characters are allowed" }
);

// Create the form schema based on our SearchQuery type
const formSchema = z.object({
  family_id: z.string().optional(),
  first_name: arabicKurdishString.optional(),
  father_name: arabicKurdishString.optional(),
  grandfather_name: arabicKurdishString.optional(),
  birth_date: z.string().optional(),
  mother_name: arabicKurdishString.optional(),
  maternal_grandfather: arabicKurdishString.optional(),
  matchType: z.enum(["exact", "partial"]).default("exact"),
  limit: z.string().default("25")
});

type SearchFormValues = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  selectedDatabases: string[];
  isLoading: boolean;
}

export function SearchForm({ onSearch, selectedDatabases, isLoading }: SearchFormProps) {
  const { language, direction } = useLanguage();
  const t = getTranslations(language);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      family_id: "",
      first_name: "",
      father_name: "",
      grandfather_name: "",
      birth_date: "",
      mother_name: "",
      maternal_grandfather: "",
      matchType: "exact",
      limit: "25"
    }
  });

  const onSubmit = (values: SearchFormValues) => {
    // Convert form values to SearchQuery
    const searchQuery: SearchQuery = {
      ...values,
      limit: parseInt(values.limit),
      page: 1
    };

    // Only include selectedDatabases if it's not empty (meaning specific databases were selected)
    if (selectedDatabases.length > 0) {
      searchQuery.databases = selectedDatabases;
    }

    onSearch(searchQuery);
  };

  const handleReset = () => {
    form.reset();
  };

  // Determine positioning of icons based on text direction
  const iconPosition = direction === 'rtl' ? 'ml-2' : 'mr-2';
  const actionSpacing = direction === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3';
  const rotateDirection = direction === 'rtl' ? 'rotate-180' : '';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t.searchDatabases}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="family_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.family_id}</FormLabel>
                    <FormControl>
                      <Input placeholder={`${t.fields.family_id}...`} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.first_name}</FormLabel>
                    <FormControl>
                      <ArabicKurdishInput placeholder={`${t.fields.first_name}...`} {...field} />
                    </FormControl>
                    {/* Don't use FormMessage here since ArabicKurdishInput shows its own error */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.father_name}</FormLabel>
                    <FormControl>
                      <ArabicKurdishInput placeholder={`${t.fields.father_name}...`} {...field} />
                    </FormControl>
                    {/* Don't use FormMessage here since ArabicKurdishInput shows its own error */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="grandfather_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.grandfather_name}</FormLabel>
                    <FormControl>
                      <ArabicKurdishInput placeholder={`${t.fields.grandfather_name}...`} {...field} />
                    </FormControl>
                    {/* Don't use FormMessage here since ArabicKurdishInput shows its own error */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.birth_date}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1900" 
                        max="2023" 
                        placeholder="Year only (e.g. 2006)" 
                        {...field} 
                        onChange={(e) => {
                          // Limit to 4 digits for year
                          if (e.target.value.length <= 4) {
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mother_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.mother_name}</FormLabel>
                    <FormControl>
                      <ArabicKurdishInput placeholder={`${t.fields.mother_name}...`} {...field} />
                    </FormControl>
                    {/* Don't use FormMessage here since ArabicKurdishInput shows its own error */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maternal_grandfather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fields.maternal_grandfather}</FormLabel>
                    <FormControl>
                      <ArabicKurdishInput placeholder={`${t.fields.maternal_grandfather}...`} {...field} />
                    </FormControl>
                    {/* Don't use FormMessage here since ArabicKurdishInput shows its own error */}
                  </FormItem>
                )}
              />
            </div>
            
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm text-primary hover:text-primary/80 p-0 flex items-center"
                >
                  <SlidersHorizontal className={`h-4 w-4 ${iconPosition}`} />
                  {t.advancedSearchOptions}
                  <ChevronDown 
                    className={`h-4 w-4 ${direction === 'rtl' ? 'mr-1' : 'ml-1'} transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''} ${rotateDirection}`}
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="matchType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>{t.matchType}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
                          >
                            <div className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                              <RadioGroupItem value="exact" id="exactMatch" />
                              <FormLabel htmlFor="exactMatch" className="font-normal">
                                {t.exactMatch}
                              </FormLabel>
                            </div>
                            <div className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                              <RadioGroupItem value="partial" id="partialMatch" />
                              <FormLabel htmlFor="partialMatch" className="font-normal">
                                {t.partialMatch}
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>{t.resultsPerPage}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.resultsPerPage} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <div className={`flex justify-end ${actionSpacing}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={isLoading}
              >
                {t.clear}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center bg-teal-600 hover:bg-teal-700"
              >
                <Search className={`h-4 w-4 ${iconPosition}`} />
                {t.search}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
