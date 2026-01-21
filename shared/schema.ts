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
  arabicName: text("arabic_name").notNull(),
  englishName: text("english_name").notNull(),
  legalForm: text("legal_form").notNull(),
  scope: text("scope").notNull(),
  city: text("city").notNull(),
  presidentName: text("president_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["Pending", "Approved", "Rejected"] }).default("Pending").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertNgoSchema = createInsertSchema(ngos).omit({ id: true, status: true, createdBy: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;
