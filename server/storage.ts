import { users, ngos, type User, type InsertUser, type Ngo, type InsertNgo } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createNgo(ngo: InsertNgo & { createdBy: number }): Promise<Ngo>;
  getNgo(id: number): Promise<Ngo | undefined>;
  getNgos(): Promise<Ngo[]>;
  getNgosByUserId(userId: number): Promise<Ngo[]>;
  updateNgoStatus(id: number, status: string): Promise<Ngo | undefined>;
  updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined>;
  deleteNgo(id: number): Promise<boolean>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ngos: Map<number, Ngo>;
  private userId: number;
  private ngoId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.ngos = new Map();
    this.userId = 1;
    this.ngoId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
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
    const id = this.userId++;
    // Default role logic if needed, but schema handles default "user"
    const user: User = { ...insertUser, id, role: insertUser.role || "user" };
    this.users.set(id, user);
    return user;
  }

  async createNgo(insertNgo: InsertNgo & { createdBy: number }): Promise<Ngo> {
    const id = this.ngoId++;
    const ngo: Ngo = { 
      ...insertNgo, 
      id, 
      status: "Pending", 
      createdAt: new Date(),
      arabicName: insertNgo.arabicName,
      englishName: insertNgo.englishName,
      legalForm: insertNgo.legalForm,
      scope: insertNgo.scope
    };
    this.ngos.set(id, ngo);
    return ngo;
  }

  async getNgo(id: number): Promise<Ngo | undefined> {
    return this.ngos.get(id);
  }

  async getNgos(): Promise<Ngo[]> {
    return Array.from(this.ngos.values());
  }

  async getNgosByUserId(userId: number): Promise<Ngo[]> {
    return Array.from(this.ngos.values()).filter(
      (ngo) => ngo.createdBy === userId
    );
  }

  async updateNgoStatus(id: number, status: string): Promise<Ngo | undefined> {
    const ngo = this.ngos.get(id);
    if (!ngo) return undefined;
    
    // Validate status against schema enum if strictness is needed, 
    // but schema enforcement happens at route level usually.
    const updatedNgo = { ...ngo, status: status as "Pending" | "Approved" | "Rejected" };
    this.ngos.set(id, updatedNgo);
    return updatedNgo;
  }

  async updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined> {
    const ngo = this.ngos.get(id);
    if (!ngo) return undefined;
    const updatedNgo = { ...ngo, ...updates };
    this.ngos.set(id, updatedNgo);
    return updatedNgo;
  }

  async deleteNgo(id: number): Promise<boolean> {
    return this.ngos.delete(id);
  }
}

export const storage = new MemStorage();
