import { Language } from './languageContext';

// Interface for field translations
export interface FieldTranslations {
  family_id: string;
  first_name: string;
  father_name: string;
  grandfather_name: string;
  birth_date: string;
  mother_name: string;
  maternal_grandfather: string;
}

// Interface for UI translations
export interface UITranslations {
  // App title and general phrases
  appTitle: string;
  searchResults: string;
  noResults: string;
  loading: string;
  error: string;
  retry: string;
  search: string;
  clear: string;
  close: string;
  viewDetails: string;
  resultsFound: string;
  noSearchPerformed: string;
  enterSearchCriteria: string;
  searchDatabases: string;
  advancedSearchOptions: string;
  
  // Form fields and labels
  fields: FieldTranslations;
  
  // Database selection related
  databaseSelection: string;
  searchAllDatabases: string;
  selectSpecificDatabases: string;
  baghdadWarning: string;
  
  // Search options
  matchType: string;
  exactMatch: string;
  partialMatch: string;
  resultsPerPage: string;
  
  // Record details
  recordDetails: string;
  fullName: string;
  sonOf: string;
  database: string;
  familyMembers: string;
  noFamilyMembers: string;
  
  // Language selection
  language: string;
  english: string;
  arabic: string;
  kurdish: string;
  
  // Input validation
  invalidInput: string;
  onlyArabicKurdish: string;
}

// English translations
const englishTranslations: UITranslations = {
  appTitle: 'IraqDB',
  searchResults: 'Search Results',
  noResults: 'No records found',
  loading: 'Searching databases...',
  error: 'An error occurred during the search',
  retry: 'Retry Search',
  search: 'Search',
  clear: 'Clear',
  close: 'Close',
  viewDetails: 'View Details',
  resultsFound: 'results found',
  noSearchPerformed: 'No search performed yet',
  enterSearchCriteria: 'Enter search criteria and click "Search" to begin',
  searchDatabases: 'Search Databases',
  advancedSearchOptions: 'Advanced Search Options',
  
  // Form fields
  fields: {
    family_id: 'Family ID',
    first_name: 'First Name',
    father_name: 'Father\'s Name',
    grandfather_name: 'Grandfather\'s Name',
    birth_date: 'Birth Year',
    mother_name: 'Mother\'s Name',
    maternal_grandfather: 'Maternal Grandfather\'s Name'
  },
  
  // Database selection
  databaseSelection: 'Database Selection',
  searchAllDatabases: 'Search All Databases',
  selectSpecificDatabases: 'Select Specific Databases',
  baghdadWarning: 'Baghdad database is the largest (~1GB) and may take longer to search.',
  
  // Search options
  matchType: 'Match Type',
  exactMatch: 'Exact Match',
  partialMatch: 'Partial Match',
  resultsPerPage: 'Results Per Page',
  
  // Record details
  recordDetails: 'Record Details',
  fullName: 'Full Name',
  sonOf: 'Son of',
  database: 'Database',
  familyMembers: 'Family Members',
  noFamilyMembers: 'No additional family members found',
  
  // Language selection
  language: 'Language',
  english: 'English',
  arabic: 'العربية',
  kurdish: 'کوردی',
  
  // Input validation
  invalidInput: 'Invalid input',
  onlyArabicKurdish: 'Only Arabic and Kurdish characters are allowed'
};

// Arabic translations
const arabicTranslations: UITranslations = {
  appTitle: 'قاعدة بيانات العراق',
  searchResults: 'نتائج البحث',
  noResults: 'لم يتم العثور على سجلات',
  loading: 'جاري البحث في قواعد البيانات...',
  error: 'حدث خطأ أثناء البحث',
  retry: 'إعادة البحث',
  search: 'بحث',
  clear: 'مسح',
  close: 'إغلاق',
  viewDetails: 'عرض التفاصيل',
  resultsFound: 'نتيجة',
  noSearchPerformed: 'لم يتم إجراء بحث بعد',
  enterSearchCriteria: 'أدخل معايير البحث وانقر على "بحث" للبدء',
  searchDatabases: 'البحث في قواعد البيانات',
  advancedSearchOptions: 'خيارات البحث المتقدمة',
  
  // Form fields
  fields: {
    family_id: 'رقم العائلة',
    first_name: 'الاسم الأول',
    father_name: 'اسم الأب',
    grandfather_name: 'اسم الجد',
    birth_date: 'سنة الميلاد',
    mother_name: 'اسم الأم',
    maternal_grandfather: 'اسم جد الأم'
  },
  
  // Database selection
  databaseSelection: 'اختيار قواعد البيانات',
  searchAllDatabases: 'البحث في جميع قواعد البيانات',
  selectSpecificDatabases: 'اختيار قواعد بيانات محددة',
  baghdadWarning: 'قاعدة بيانات بغداد هي الأكبر (~1GB) وقد تستغرق وقتًا أطول للبحث.',
  
  // Search options
  matchType: 'نوع المطابقة',
  exactMatch: 'مطابقة تامة',
  partialMatch: 'مطابقة جزئية',
  resultsPerPage: 'النتائج في الصفحة',
  
  // Record details
  recordDetails: 'تفاصيل السجل',
  fullName: 'الاسم الكامل',
  sonOf: 'ابن',
  database: 'قاعدة البيانات',
  familyMembers: 'أفراد العائلة',
  noFamilyMembers: 'لم يتم العثور على أفراد إضافيين للعائلة',
  
  // Language selection
  language: 'اللغة',
  english: 'English',
  arabic: 'العربية',
  kurdish: 'کوردی',
  
  // Input validation
  invalidInput: 'إدخال غير صالح',
  onlyArabicKurdish: 'يُسمح فقط بالأحرف العربية والكردية'
};

// Kurdish translations
const kurdishTranslations: UITranslations = {
  appTitle: 'داتابەیسی عێراق',
  searchResults: 'ئەنجامەکانی گەڕان',
  noResults: 'هیچ تۆمارێک نەدۆزرایەوە',
  loading: 'گەڕان لە داتابەیسەکان...',
  error: 'هەڵەیەک ڕوویدا لە کاتی گەڕاندا',
  retry: 'دووبارە هەوڵدانەوەی گەڕان',
  search: 'گەڕان',
  clear: 'پاککردنەوە',
  close: 'داخستن',
  viewDetails: 'بینینی وردەکاری',
  resultsFound: 'ئەنجام دۆزرایەوە',
  noSearchPerformed: 'هیچ گەڕانێک نەکراوە',
  enterSearchCriteria: 'پێوەرەکانی گەڕان بنووسە و کلیک لەسەر "گەڕان" بکە بۆ دەستپێکردن',
  searchDatabases: 'گەڕان لە داتابەیسەکان',
  advancedSearchOptions: 'بژاردەکانی گەڕانی پێشکەوتوو',
  
  // Form fields
  fields: {
    family_id: 'ناسنامەی خێزان',
    first_name: 'ناوی یەکەم',
    father_name: 'ناوی باوک',
    grandfather_name: 'ناوی باپیر',
    birth_date: 'ساڵی لەدایکبوون',
    mother_name: 'ناوی دایک',
    maternal_grandfather: 'ناوی باپیری دایک'
  },
  
  // Database selection
  databaseSelection: 'هەڵبژاردنی داتابەیس',
  searchAllDatabases: 'گەڕان لە هەموو داتابەیسەکان',
  selectSpecificDatabases: 'هەڵبژاردنی داتابەیسی دیاریکراو',
  baghdadWarning: 'داتابەیسی بەغدا گەورەترینە (~1GB) و لەوانەیە کاتێکی زیاتر بخایەنێت بۆ گەڕان.',
  
  // Search options
  matchType: 'جۆری گونجاندن',
  exactMatch: 'گونجاندنی تەواو',
  partialMatch: 'گونجاندنی بەشەکی',
  resultsPerPage: 'ئەنجامەکان لە هەر لاپەڕەیەک',
  
  // Record details
  recordDetails: 'وردەکاری تۆمار',
  fullName: 'ناوی تەواو',
  sonOf: 'کوڕی',
  database: 'داتابەیس',
  familyMembers: 'ئەندامانی خێزان',
  noFamilyMembers: 'هیچ ئەندامێکی زیاتری خێزان نەدۆزرایەوە',
  
  // Language selection
  language: 'زمان',
  english: 'English',
  arabic: 'العربية',
  kurdish: 'کوردی',
  
  // Input validation
  invalidInput: 'داخلکردنی نادروست',
  onlyArabicKurdish: 'تەنها پیتەکانی عەرەبی و کوردی ڕێگەپێدراون'
};

// Get translations for the selected language
export function getTranslations(language: Language): UITranslations {
  switch (language) {
    case 'arabic':
      return arabicTranslations;
    case 'kurdish':
      return kurdishTranslations;
    case 'english':
    default:
      return englishTranslations;
  }
}

// Function to validate input - only allow Arabic and Kurdish characters
export function isArabicOrKurdish(text: string): boolean {
  if (!text) return true; // Empty string is valid
  
  // Regular expression for Arabic and Kurdish characters
  // Arabic: \u0600-\u06FF
  // Kurdish/Persian: \u0750-\u077F and \u08A0-\u08FF
  // Kurdish additional: \uFB50-\uFDFF and \uFE70-\uFEFF
  const arabicKurdishRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;
  
  return arabicKurdishRegex.test(text);
}