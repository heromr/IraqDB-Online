import { users, type User, type InsertUser } from "@shared/schema";
import { searchRecords, getFamilyMembers } from "./db";
import { SearchQuery, SearchResult } from "@shared/schema";
import type { Record as DatabaseRecord } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  searchRecords(query: SearchQuery): Promise<SearchResult>;
  getFamilyMembers(familyId: string, database: string): Promise<DatabaseRecord[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async searchRecords(query: SearchQuery): Promise<SearchResult> {
    return searchRecords(query);
  }
  
  async getFamilyMembers(familyId: string, database: string): Promise<DatabaseRecord[]> {
    return getFamilyMembers(familyId, database);
  }
}

export const storage = new MemStorage();
