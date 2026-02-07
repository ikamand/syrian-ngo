import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findById(userId: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user;
}

export async function findByUsername(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function createWithRole(userData: InsertUser): Promise<User> {
  const [user] = await db.insert(users).values(userData).returning();
  return user;
}

export async function updatePassword(userId: number, hashedPassword: string): Promise<User | undefined> {
  const [user] = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId)).returning();
  return user;
}

export async function updateProfile(userId: number, updates: Partial<InsertUser>): Promise<User | undefined> {
  const [user] = await db.update(users).set(updates).where(eq(users.id, userId)).returning();
  return user;
}

export async function findAllForAdmin(): Promise<User[]> {
  return db.select().from(users);
}

export async function removeUserByAdmin(userId: number): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, userId));
  return (result.rowCount ?? 0) > 0;
}
