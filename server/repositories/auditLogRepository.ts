import { auditLogs, type AuditLog } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export async function findByNgoId(ngoId: number): Promise<AuditLog[]> {
  return db.select().from(auditLogs).where(eq(auditLogs.ngoId, ngoId)).orderBy(desc(auditLogs.createdAt));
}

export async function createForNgo(entry: {
  ngoId: number;
  userId: number;
  action: "created" | "edited" | "approved" | "rejected" | "deleted" | "status_changed";
  details?: Record<string, any>;
}): Promise<AuditLog> {
  const [created] = await db.insert(auditLogs).values({
    ngoId: entry.ngoId,
    userId: entry.userId,
    action: entry.action,
    details: entry.details || null,
  }).returning();
  return created;
}
