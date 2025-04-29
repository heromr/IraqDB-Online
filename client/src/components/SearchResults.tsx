import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, AlertCircle, RotateCcw, Search } from "lucide-react";
import { RecordDetailsModal } from "./RecordDetailsModal";
import { Record, SearchResult } from "@/lib/types";
import { formatDatabaseName } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import { getTranslations } from "@/lib/translations";

interface SearchResultsProps {
  searchResult: SearchResult | null;
  isLoading: boolean;
  error: Error | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  hasSearched: boolean;
}

export function SearchResults({
  searchResult,
  isLoading,
  error,
  onPageChange,
  onRetry,
  hasSearched
}: SearchResultsProps) {
  const { language, direction } = useLanguage();
  const t = getTranslations(language);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (record: Record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const renderPagination = () => {
    if (!searchResult) return null;

    const { page, totalPages } = searchResult;
    const items = [];

    // Add first page
    if (totalPages > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            isActive={page === 1} 
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i <= totalPages && i > 1) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={page === i} 
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Add ellipsis if needed
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={page === totalPages} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          
          {items}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className={page === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Determine positioning based on text direction
  const iconPosition = direction === 'rtl' ? 'ml-2' : 'mr-2';
  const marginPosition = direction === 'rtl' ? 'mr-3' : 'ml-3';

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-lg text-teal-700 dark:text-teal-400">{t.searchResults}</CardTitle>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {searchResult ? `${searchResult.total} ${t.resultsFound}` : `0 ${t.resultsFound}`}
        </div>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 text-center">{t.loading}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t.baghdadWarning}</p>
          </div>
        )}
        
        {/* Empty State - No search performed */}
        {!isLoading && !error && !hasSearched && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">{t.noSearchPerformed}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t.enterSearchCriteria}</p>
          </div>
        )}
        
        {/* Empty Search Results */}
        {!isLoading && !error && hasSearched && searchResult && searchResult.records.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">{t.noResults}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t.enterSearchCriteria}</p>
          </div>
        )}
        
        {/* Error State */}
        {!isLoading && error && (
          <div className="py-8 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className={marginPosition}>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t.error}</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error.message}</p>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={onRetry}
                    className="inline-flex items-center"
                  >
                    <RotateCcw className={`h-4 w-4 ${iconPosition}`} /> {t.retry}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Table */}
        {!isLoading && !error && searchResult && searchResult.records.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table className="border-collapse border-spacing-0">
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="font-medium">{t.fields.first_name}</TableHead>
                    <TableHead className="font-medium">{t.fields.family_id}</TableHead>
                    <TableHead className="font-medium">{t.fields.birth_date}</TableHead>
                    <TableHead className="font-medium">{t.fields.mother_name}</TableHead>
                    <TableHead className="font-medium">{t.database}</TableHead>
                    <TableHead className="font-medium"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResult.records.map((record, index) => (
                    <TableRow key={`${record.family_id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {record.first_name} {record.father_name} {record.grandfather_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t.sonOf} {record.father_name} {record.grandfather_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 dark:text-gray-100">{record.family_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {/* Format birth_date to remove trailing zeros */}
                          {record.birth_date ? 
                            (typeof record.birth_date === 'string' && 
                             String(record.birth_date).endsWith('00') && 
                             String(record.birth_date).length > 4 ? 
                              String(record.birth_date).slice(0, -2) : 
                              record.birth_date) 
                            : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 dark:text-gray-100">{record.mother_name}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.database === 'baghdad' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                        }`}>
                          {formatDatabaseName(record.database)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(record)}
                          className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center"
                        >
                          <Eye className={`h-4 w-4 ${iconPosition}`} /> {t.viewDetails}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {renderPagination()}
          </>
        )}
      </CardContent>

      {/* Details Modal */}
      {selectedRecord && (
        <RecordDetailsModal
          record={selectedRecord}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Card>
  );
}
