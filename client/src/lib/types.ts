import { z } from "zod";
import { searchQuerySchema, recordSchema, searchResultSchema } from "@shared/schema";

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type Record = z.infer<typeof recordSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;

export const AVAILABLE_DATABASES = [
  "al-anbar",
  "babylon",
  "baghdad",
  "balad",
  "basra",
  "dhiqar",
  "diyala",
  "duhok",
  "erbil",
  "karbalaa",
  "kirkuk",
  "mesan",
  "muthana",
  "najaf",
  "nineveh",
  "qadisiya",
  "salah-aldeen",
  "sulaymaniyah",
  "wasit"
];

export const formatDatabaseName = (name: string): string => {
  // Capitalize first letter and handle special cases
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
};
