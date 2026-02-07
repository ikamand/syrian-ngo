import { type User, type InsertUser, type Ngo, type InsertNgo, type Announcement, type InsertAnnouncement, type SiteContent, type InsertSiteContent, type Notice, type InsertNotice, type FooterLink, type InsertFooterLink, type NgoNote, type InsertNgoNote } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

import * as userRepo from "./repositories/userRepository";
import * as membershipRepo from "./repositories/membershipRepository";
import * as ngoRepo from "./repositories/ngoRepository";
import * as announcementRepo from "./repositories/announcementRepository";
import * as siteContentRepo from "./repositories/siteContentRepository";
import * as noticeRepo from "./repositories/noticeRepository";
import * as footerLinkRepo from "./repositories/footerLinkRepository";
import * as ngoNoteRepo from "./repositories/ngoNoteRepository";

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
  updateNgo(id: number, updates: Partial<InsertNgo>, resetStatus?: boolean): Promise<Ngo | undefined>;
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
  getAllNgoNoteCounts(): Promise<{ ngoId: number; count: number }[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (process.env.DATABASE_URL) {
      const pgStore = new PgSession({
        pool: pool as any,
        tableName: "session",
        createTableIfMissing: true,
        pruneSessionInterval: 60,
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
    return userRepo.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return userRepo.findByUsername(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return userRepo.createWithRole(insertUser);
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    return userRepo.updatePassword(id, newPassword);
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return userRepo.updateProfile(id, updates);
  }

  async getAllUsers(): Promise<User[]> {
    return userRepo.findAllForAdmin();
  }

  async createNgo(insertNgo: InsertNgo & { createdBy: number }): Promise<Ngo> {
    return ngoRepo.createForUser(insertNgo);
  }

  async getNgo(id: number): Promise<Ngo | undefined> {
    return ngoRepo.findById(id);
  }

  async getNgos(): Promise<Ngo[]> {
    return ngoRepo.findAllForAdmin();
  }

  async getNgosByUserId(userId: number): Promise<Ngo[]> {
    return membershipRepo.findNgosByOwner(userId);
  }

  async updateNgoStatus(id: number, status: string): Promise<Ngo | undefined> {
    return ngoRepo.updateStatus(id, status);
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
    return ngoRepo.updateApprovalStatus(id, updates);
  }

  async deleteUser(id: number): Promise<boolean> {
    return userRepo.removeUserByAdmin(id);
  }

  async updateNgo(id: number, updates: Partial<InsertNgo>, resetStatus: boolean = true): Promise<Ngo | undefined> {
    return ngoRepo.updateFields(id, updates, resetStatus);
  }

  async deleteNgo(id: number): Promise<boolean> {
    return ngoRepo.removeNgoByAdmin(id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement & { createdBy: number }): Promise<Announcement> {
    return announcementRepo.create(insertAnnouncement);
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return announcementRepo.findById(id);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return announcementRepo.findAllForAdmin();
  }

  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return announcementRepo.findPublished();
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    return announcementRepo.update(id, updates);
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return announcementRepo.removeByAdmin(id);
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    return siteContentRepo.findByKey(key);
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return siteContentRepo.findAllForAdmin();
  }

  async upsertSiteContent(key: string, content: Omit<InsertSiteContent, 'key'> & { updatedBy: number }): Promise<SiteContent> {
    return siteContentRepo.upsert(key, content);
  }

  async createNotice(notice: InsertNotice & { createdBy: number }): Promise<Notice> {
    return noticeRepo.create(notice);
  }

  async getNotice(id: number): Promise<Notice | undefined> {
    return noticeRepo.findById(id);
  }

  async getNotices(): Promise<Notice[]> {
    return noticeRepo.findAllOrderedForAdmin();
  }

  async updateNotice(id: number, updates: Partial<InsertNotice>): Promise<Notice | undefined> {
    return noticeRepo.update(id, updates);
  }

  async deleteNotice(id: number): Promise<boolean> {
    return noticeRepo.removeByAdmin(id);
  }

  async createFooterLink(link: InsertFooterLink): Promise<FooterLink> {
    return footerLinkRepo.create(link);
  }

  async getFooterLink(id: number): Promise<FooterLink | undefined> {
    return footerLinkRepo.findById(id);
  }

  async getFooterLinks(): Promise<FooterLink[]> {
    return footerLinkRepo.findAllSorted();
  }

  async updateFooterLink(id: number, updates: Partial<InsertFooterLink>): Promise<FooterLink | undefined> {
    return footerLinkRepo.update(id, updates);
  }

  async deleteFooterLink(id: number): Promise<boolean> {
    return footerLinkRepo.removeByAdmin(id);
  }

  async createNgoNote(note: InsertNgoNote & { authorId: number }): Promise<NgoNote> {
    return ngoNoteRepo.createForNgo(note);
  }

  async getNgoNotes(ngoId: number): Promise<NgoNote[]> {
    return ngoNoteRepo.findByNgoId(ngoId);
  }

  async getAllNgoNoteCounts(): Promise<{ ngoId: number; count: number }[]> {
    return ngoNoteRepo.countsByNgo();
  }
}

export const storage = new DatabaseStorage();
