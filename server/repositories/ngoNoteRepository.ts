import { ngoNotes, type NgoNote, type InsertNgoNote } from "@shared/schema";
import { db } from "../db";
import { eq, desc, sql } from "drizzle-orm";

export async function findByNgoId(ngoId: number): Promise<NgoNote[]> {
  return db.select().from(ngoNotes).where(eq(ngoNotes.ngoId, ngoId)).orderBy(desc(ngoNotes.createdAt));
}

export async function createForNgo(note: InsertNgoNote & { authorId: number }): Promise<NgoNote> {
  const [created] = await db.insert(ngoNotes).values(note).returning();
  return created;
}

export async function countsByNgo(): Promise<{ ngoId: number; count: number }[]> {
  const result = await db
    .select({
      ngoId: ngoNotes.ngoId,
      count: sql<number>`count(*)::int`,
    })
    .from(ngoNotes)
    .groupBy(ngoNotes.ngoId);
  return result;
}
