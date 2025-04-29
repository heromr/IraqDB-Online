import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { SearchQuery, searchQuerySchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { getFamilyMembers } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search API endpoint
  app.post("/api/search", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const searchQuery = searchQuerySchema.parse(req.body) as SearchQuery;
      
      // Perform the search
      const results = await storage.searchRecords(searchQuery);
      
      return res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          error: "Invalid search parameters",
          details: validationError.message
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        error: "An error occurred during search",
        message: (error as Error).message
      });
    }
  });

  // API endpoint to get family members
  app.get("/api/family-members/:familyId/:database", async (req: Request, res: Response) => {
    try {
      const { familyId, database } = req.params;
      
      if (!familyId || !database) {
        return res.status(400).json({
          error: "Missing parameters",
          message: "Both familyId and database parameters are required"
        });
      }
      
      // Fetch family members
      const familyMembers = await getFamilyMembers(familyId, database);
      
      return res.json({
        familyId,
        database,
        members: familyMembers
      });
    } catch (error) {
      console.error("Error fetching family members:", error);
      
      return res.status(500).json({
        error: "An error occurred while fetching family members",
        message: (error as Error).message
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
