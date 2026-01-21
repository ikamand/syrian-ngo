import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
});

export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  presidentName: text("president_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["Pending", "Approved", "Rejected"] }).default("Pending").notNull(),
  createdBy: integer("created_by").notNull(), // References user.id
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertNgoSchema = createInsertSchema(ngos).omit({ id: true, status: true, createdBy: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;
