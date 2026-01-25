import { users, ngos, announcements, siteContent, type User, type InsertUser, type Ngo, type InsertNgo, type Announcement, type InsertAnnouncement, type SiteContent, type InsertSiteContent } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PgSession = connectPgSimple(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, newPassword: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  createNgo(ngo: InsertNgo & { createdBy: number }): Promise<Ngo>;
  getNgo(id: number): Promise<Ngo | undefined>;
  getNgos(): Promise<Ngo[]>;
  getNgosByUserId(userId: number): Promise<Ngo[]>;
  updateNgoStatus(id: number, status: string): Promise<Ngo | undefined>;
  updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined>;
  deleteNgo(id: number): Promise<boolean>;

  createAnnouncement(announcement: InsertAnnouncement & { createdBy: number }): Promise<Announcement>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncements(): Promise<Announcement[]>;
  getPublishedAnnouncements(): Promise<Announcement[]>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  getSiteContent(key: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  upsertSiteContent(key: string, content: Omit<InsertSiteContent, 'key'> & { updatedBy: number }): Promise<SiteContent>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
      this.sessionStore = new PgSession({
        pool: pool as any,
        tableName: "session",
        createTableIfMissing: true,
      });
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000,
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ password: newPassword }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createNgo(insertNgo: InsertNgo & { createdBy: number }): Promise<Ngo> {
    const [ngo] = await db.insert(ngos).values({
      ...insertNgo,
      status: "Pending",
    }).returning();
    return ngo;
  }

  async getNgo(id: number): Promise<Ngo | undefined> {
    const [ngo] = await db.select().from(ngos).where(eq(ngos.id, id));
    return ngo;
  }

  async getNgos(): Promise<Ngo[]> {
    return db.select().from(ngos).orderBy(desc(ngos.createdAt));
  }

  async getNgosByUserId(userId: number): Promise<Ngo[]> {
    return db.select().from(ngos).where(eq(ngos.createdBy, userId)).orderBy(desc(ngos.createdAt));
  }

  async updateNgoStatus(id: number, status: string): Promise<Ngo | undefined> {
    const [updated] = await db.update(ngos)
      .set({ status: status as "Pending" | "Approved" | "Rejected" })
      .where(eq(ngos.id, id))
      .returning();
    return updated;
  }

  async updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined> {
    const [updated] = await db.update(ngos)
      .set({ ...updates, status: "Pending" })
      .where(eq(ngos.id, id))
      .returning();
    return updated;
  }

  async deleteNgo(id: number): Promise<boolean> {
    const result = await db.delete(ngos).where(eq(ngos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement & { createdBy: number }): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.published, true)).orderBy(desc(announcements.createdAt));
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [updated] = await db.update(announcements)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return updated;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent);
  }

  async upsertSiteContent(key: string, content: Omit<InsertSiteContent, 'key'> & { updatedBy: number }): Promise<SiteContent> {
    const existing = await this.getSiteContent(key);
    
    if (existing) {
      const [updated] = await db.update(siteContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteContent)
        .values({ key, ...content })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
