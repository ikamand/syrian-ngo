import { siteContent, type SiteContent, type InsertSiteContent } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findByKey(key: string): Promise<SiteContent | undefined> {
  const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
  return content;
}

export async function findAllForAdmin(): Promise<SiteContent[]> {
  return db.select().from(siteContent);
}

export async function upsert(key: string, content: Omit<InsertSiteContent, 'key'> & { updatedBy: number }): Promise<SiteContent> {
  const existing = await findByKey(key);

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
