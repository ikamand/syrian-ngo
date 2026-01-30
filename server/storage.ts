import { users, ngos, announcements, siteContent, notices, footerLinks, ngoNotes, type User, type InsertUser, type Ngo, type InsertNgo, type Announcement, type InsertAnnouncement, type SiteContent, type InsertSiteContent, type Notice, type InsertNotice, type FooterLink, type InsertFooterLink, type NgoNote, type InsertNgoNote } from "@shared/schema";
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
  updateNgoApproval(id: number, updates: {
    status: string;
    approvedByAdminId?: number;
    approvedByAdminAt?: Date;
    approvedBySuperAdminId?: number;
    approvedBySuperAdminAt?: Date;
    rejectedById?: number;
    rejectedAt?: Date;
    rejectionReason?: string;
  }): Promise<Ngo | undefined>;
  updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined>;
  deleteNgo(id: number): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;

  createAnnouncement(announcement: InsertAnnouncement & { createdBy: number }): Promise<Announcement>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncements(): Promise<Announcement[]>;
  getPublishedAnnouncements(): Promise<Announcement[]>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  getSiteContent(key: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  upsertSiteContent(key: string, content: Omit<InsertSiteContent, 'key'> & { updatedBy: number }): Promise<SiteContent>;

  createNotice(notice: InsertNotice & { createdBy: number }): Promise<Notice>;
  getNotice(id: number): Promise<Notice | undefined>;
  getNotices(): Promise<Notice[]>;
  updateNotice(id: number, updates: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: number): Promise<boolean>;

  createFooterLink(link: InsertFooterLink): Promise<FooterLink>;
  getFooterLink(id: number): Promise<FooterLink | undefined>;
  getFooterLinks(): Promise<FooterLink[]>;
  updateFooterLink(id: number, updates: Partial<InsertFooterLink>): Promise<FooterLink | undefined>;
  deleteFooterLink(id: number): Promise<boolean>;

  createNgoNote(note: InsertNgoNote & { authorId: number }): Promise<NgoNote>;
  getNgoNotes(ngoId: number): Promise<NgoNote[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Always use PostgreSQL session store when DATABASE_URL is available
    // This ensures consistent behavior between development and production
    if (process.env.DATABASE_URL) {
      const pgStore = new PgSession({
        pool: pool as any,
        tableName: "session",
        createTableIfMissing: true,
        pruneSessionInterval: 60, // Prune expired sessions every 60 seconds
      });
      
      pgStore.on('error', (error: Error) => {
        console.error('Session store error:', error);
      });
      
      this.sessionStore = pgStore;
      console.log('Using PostgreSQL session store');
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000,
      });
      console.log('Using Memory session store');
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
      status: "Pending" as const,
    } as any).returning();
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
      .set({ status: status as "Pending" | "AdminApproved" | "Approved" | "Rejected" })
      .where(eq(ngos.id, id))
      .returning();
    return updated;
  }

  async updateNgoApproval(id: number, updates: {
    status: string;
    approvedByAdminId?: number;
    approvedByAdminAt?: Date;
    approvedBySuperAdminId?: number;
    approvedBySuperAdminAt?: Date;
    rejectedById?: number;
    rejectedAt?: Date;
    rejectionReason?: string;
  }): Promise<Ngo | undefined> {
    const [updated] = await db.update(ngos)
      .set({
        status: updates.status as "Pending" | "AdminApproved" | "Approved" | "Rejected",
        approvedByAdminId: updates.approvedByAdminId,
        approvedByAdminAt: updates.approvedByAdminAt,
        approvedBySuperAdminId: updates.approvedBySuperAdminId,
        approvedBySuperAdminAt: updates.approvedBySuperAdminAt,
        rejectedById: updates.rejectedById,
        rejectedAt: updates.rejectedAt,
        rejectionReason: updates.rejectionReason
      })
      .where(eq(ngos.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateNgo(id: number, updates: Partial<InsertNgo>): Promise<Ngo | undefined> {
    const [updated] = await db.update(ngos)
      .set({ ...updates, status: "Pending" as const } as any)
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

  async createNotice(notice: InsertNotice & { createdBy: number }): Promise<Notice> {
    const [created] = await db.insert(notices).values(notice).returning();
    return created;
  }

  async getNotice(id: number): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice;
  }

  async getNotices(): Promise<Notice[]> {
    return db.select().from(notices).orderBy(desc(notices.createdAt));
  }

  async updateNotice(id: number, updates: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [updated] = await db.update(notices)
      .set(updates)
      .where(eq(notices.id, id))
      .returning();
    return updated;
  }

  async deleteNotice(id: number): Promise<boolean> {
    const result = await db.delete(notices).where(eq(notices.id, id)).returning();
    return result.length > 0;
  }

  async createFooterLink(link: InsertFooterLink): Promise<FooterLink> {
    const [created] = await db.insert(footerLinks).values(link).returning();
    return created;
  }

  async getFooterLink(id: number): Promise<FooterLink | undefined> {
    const [link] = await db.select().from(footerLinks).where(eq(footerLinks.id, id));
    return link;
  }

  async getFooterLinks(): Promise<FooterLink[]> {
    return db.select().from(footerLinks).orderBy(footerLinks.sortOrder);
  }

  async updateFooterLink(id: number, updates: Partial<InsertFooterLink>): Promise<FooterLink | undefined> {
    const [updated] = await db.update(footerLinks)
      .set(updates)
      .where(eq(footerLinks.id, id))
      .returning();
    return updated;
  }

  async deleteFooterLink(id: number): Promise<boolean> {
    const result = await db.delete(footerLinks).where(eq(footerLinks.id, id)).returning();
    return result.length > 0;
  }

  async createNgoNote(note: InsertNgoNote & { authorId: number }): Promise<NgoNote> {
    const [created] = await db.insert(ngoNotes).values(note).returning();
    return created;
  }

  async getNgoNotes(ngoId: number): Promise<NgoNote[]> {
    return db.select().from(ngoNotes).where(eq(ngoNotes.ngoId, ngoId)).orderBy(desc(ngoNotes.createdAt));
  }
}

export const storage = new DatabaseStorage();
