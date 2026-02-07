import { ngos, type Ngo, type InsertNgo } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export async function findById(ngoId: number): Promise<Ngo | undefined> {
  const [ngo] = await db.select().from(ngos).where(eq(ngos.id, ngoId));
  return ngo;
}

export async function findAllForAdmin(): Promise<Ngo[]> {
  return db.select().from(ngos).orderBy(desc(ngos.createdAt));
}

export async function createForUser(ngoData: InsertNgo & { createdBy: number }): Promise<Ngo> {
  const [ngo] = await db.insert(ngos).values({
    ...ngoData,
    status: "Pending" as const,
  } as any).returning();
  return ngo;
}

export async function updateFields(ngoId: number, updates: Partial<InsertNgo>, resetStatus: boolean = true): Promise<Ngo | undefined> {
  const setData = resetStatus
    ? { ...updates, status: "Pending" as const }
    : updates;
  const [updated] = await db.update(ngos)
    .set(setData as any)
    .where(eq(ngos.id, ngoId))
    .returning();
  return updated;
}

export async function updateStatus(ngoId: number, status: string): Promise<Ngo | undefined> {
  const [updated] = await db.update(ngos)
    .set({ status: status as "Pending" | "AdminApproved" | "Approved" | "Rejected" })
    .where(eq(ngos.id, ngoId))
    .returning();
  return updated;
}

export async function updateApprovalStatus(ngoId: number, updates: {
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
    .where(eq(ngos.id, ngoId))
    .returning();
  return updated;
}

export async function removeNgoByAdmin(ngoId: number): Promise<boolean> {
  const result = await db.delete(ngos).where(eq(ngos.id, ngoId));
  return (result.rowCount ?? 0) > 0;
}
