import { footerLinks, type FooterLink, type InsertFooterLink } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findById(id: number): Promise<FooterLink | undefined> {
  const [link] = await db.select().from(footerLinks).where(eq(footerLinks.id, id));
  return link;
}

export async function findAllSorted(): Promise<FooterLink[]> {
  return db.select().from(footerLinks).orderBy(footerLinks.sortOrder);
}

export async function create(data: InsertFooterLink): Promise<FooterLink> {
  const [link] = await db.insert(footerLinks).values(data).returning();
  return link;
}

export async function update(id: number, updates: Partial<InsertFooterLink>): Promise<FooterLink | undefined> {
  const [updated] = await db.update(footerLinks)
    .set(updates)
    .where(eq(footerLinks.id, id))
    .returning();
  return updated;
}

export async function removeByAdmin(id: number): Promise<boolean> {
  const result = await db.delete(footerLinks).where(eq(footerLinks.id, id)).returning();
  return result.length > 0;
}
