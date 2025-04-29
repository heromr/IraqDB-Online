import React, { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DatabaseSelector } from "@/components/DatabaseSelector";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { SearchQuery, SearchResult } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  // Use mutation for POST request
  const {
    mutate,
    isPending: isLoading,
    error,
    reset: resetMutation
  } = useMutation({
    mutationFn: async (query: SearchQuery) => {
      const response = await apiRequest('POST', '/api/search', query);
      return response.json() as Promise<SearchResult>;
    },
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: (error) => {
      console.error("Search error:", error);
      // Toast could be added here if needed
    }
  });

  const handleSearch = useCallback((query: SearchQuery) => {
    // Add selected databases to query if any are selected
    if (selectedDatabases.length > 0) {
      query.databases = selectedDatabases;
    }
    setSearchQuery(query);
    setHasSearched(true);
    
    // Execute the search mutation
    mutate(query);
  }, [selectedDatabases, mutate]);

  const handlePageChange = useCallback((page: number) => {
    if (searchQuery) {
      const updatedQuery = {
        ...searchQuery,
        page
      };
      setSearchQuery(updatedQuery);
      mutate(updatedQuery);
    }
  }, [searchQuery, mutate]);

  const handleRetry = useCallback(() => {
    if (searchQuery) {
      mutate(searchQuery);
    }
  }, [searchQuery, mutate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DatabaseSelector 
          selectedDatabases={selectedDatabases}
          setSelectedDatabases={setSelectedDatabases}
        />
        
        <SearchForm 
          onSearch={handleSearch}
          selectedDatabases={selectedDatabases}
          isLoading={isLoading}
        />
        
        <SearchResults 
          searchResult={searchResults}
          isLoading={isLoading}
          error={error as Error | null}
          onPageChange={handlePageChange}
          onRetry={handleRetry}
          hasSearched={hasSearched}
        />
      </main>
      
      <Footer />
    </div>
  );
}
