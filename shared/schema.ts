import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains the same (as it's required for sessions)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the record schema based on the SQLite database structure
export const recordSchema = z.object({
  family_id: z.string(),
  first_name: z.string(),
  father_name: z.string(),
  grandfather_name: z.string(),
  birth_date: z.string(),
  mother_name: z.string(),
  maternal_grandfather: z.string(),
  database: z.string(), // The database this record came from
});

export type Record = z.infer<typeof recordSchema>;

// Define the search query schema
export const searchQuerySchema = z.object({
  family_id: z.string().optional(),
  first_name: z.string().optional(),
  father_name: z.string().optional(),
  grandfather_name: z.string().optional(),
  birth_date: z.string().optional(),
  mother_name: z.string().optional(),
  maternal_grandfather: z.string().optional(),
  databases: z.array(z.string()).optional(),
  matchType: z.enum(["exact", "partial"]).default("exact"),
  page: z.number().default(1),
  limit: z.number().default(25)
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Define the search result schema
export const searchResultSchema = z.object({
  records: z.array(recordSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
  limit: z.number()
});

export type SearchResult = z.infer<typeof searchResultSchema>;
