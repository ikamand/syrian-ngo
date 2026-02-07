import { ngos, type Ngo } from "@shared/schema";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";

export async function verifyOwnership(userId: number, ngoId: number): Promise<boolean> {
  const [ngo] = await db
    .select({ id: ngos.id })
    .from(ngos)
    .where(and(eq(ngos.id, ngoId), eq(ngos.createdBy, userId)));
  return !!ngo;
}

export async function findNgosByOwner(userId: number): Promise<Ngo[]> {
  return db.select().from(ngos).where(eq(ngos.createdBy, userId)).orderBy(desc(ngos.createdAt));
}
