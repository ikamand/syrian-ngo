import { notices, type Notice, type InsertNotice } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export async function findById(id: number): Promise<Notice | undefined> {
  const [notice] = await db.select().from(notices).where(eq(notices.id, id));
  return notice;
}

export async function findAllOrderedForAdmin(): Promise<Notice[]> {
  return db.select().from(notices).orderBy(desc(notices.createdAt));
}

export async function create(data: InsertNotice & { createdBy: number }): Promise<Notice> {
  const [notice] = await db.insert(notices).values(data).returning();
  return notice;
}

export async function update(id: number, updates: Partial<InsertNotice>): Promise<Notice | undefined> {
  const [updated] = await db.update(notices)
    .set(updates)
    .where(eq(notices.id, id))
    .returning();
  return updated;
}

export async function removeByAdmin(id: number): Promise<boolean> {
  const result = await db.delete(notices).where(eq(notices.id, id)).returning();
  return result.length > 0;
}
