import { announcements, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export async function findById(id: number): Promise<Announcement | undefined> {
  const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
  return announcement;
}

export async function findAllForAdmin(): Promise<Announcement[]> {
  return db.select().from(announcements).orderBy(desc(announcements.createdAt));
}

export async function findPublished(): Promise<Announcement[]> {
  return db.select().from(announcements).where(eq(announcements.published, true)).orderBy(desc(announcements.createdAt));
}

export async function create(data: InsertAnnouncement & { createdBy: number }): Promise<Announcement> {
  const [announcement] = await db.insert(announcements).values(data).returning();
  return announcement;
}

export async function update(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
  const [updated] = await db.update(announcements)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(announcements.id, id))
    .returning();
  return updated;
}

export async function removeByAdmin(id: number): Promise<boolean> {
  const result = await db.delete(announcements).where(eq(announcements.id, id));
  return (result.rowCount ?? 0) > 0;
}
