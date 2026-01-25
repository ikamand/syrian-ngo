import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import type { User } from "@shared/schema";

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev_secret_key",
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: app.get("env") === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  };

  // --- Auth Routes ---
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(input);
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user);
  });

  // --- Password Management Routes ---
  
  // User changes their own password
  app.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      if (user.password !== currentPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      await storage.updateUserPassword(user.id, newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin resets a user's password
  app.post("/api/admin/reset-user-password", requireAdmin, async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      
      if (!userId || !newPassword) {
        return res.status(400).json({ message: "User ID and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.updateUserPassword(userId, newPassword);
      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin gets all users
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      // Don't send passwords to frontend
      const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, role: u.role }));
      res.json(safeUsers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- NGO Routes ---

  // Public endpoint: Get all approved NGOs (no auth required)
  app.get(api.ngos.listPublic.path, async (_req, res) => {
    const allNgos = await storage.getNgos();
    const approvedNgos = allNgos.filter(ngo => ngo.status === "Approved");
    res.json(approvedNgos);
  });

  // Get all NGOs (Admin sees all, User sees theirs - logic in route or generic list?)
  // Requirement says: "Admin Panel: View all NGOs", "User Dashboard: View list of NGOs they created"
  // Let's implement /api/ngos to return based on role or context
  app.get(api.ngos.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).send();

    let ngos;
    if (user.role === 'admin') {
      ngos = await storage.getNgos();
    } else {
      ngos = await storage.getNgosByUserId(user.id);
    }
    res.json(ngos);
  });

  app.get(api.ngos.get.path, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const ngo = await storage.getNgo(id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json(ngo);
  });

  app.post(api.ngos.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.ngos.create.input.parse(req.body);
      const ngo = await storage.createNgo({ ...input, createdBy: req.session.userId! });
      res.status(201).json(ngo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.ngos.updateStatus.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const { status } = api.ngos.updateStatus.input.parse(req.body);
      
      const updated = await storage.updateNgoStatus(id, status);
      if (!updated) return res.status(404).json({ message: "NGO not found" });
      
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.put(api.ngos.update.path, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const ngo = await storage.getNgo(id);
      
      if (!ngo) return res.status(404).json({ message: "NGO not found" });
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      
      // Ensure user owns the NGO or is admin
      if (user.role !== "admin" && ngo.createdBy !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const input = api.ngos.update.input.parse(req.body);
      const updated = await storage.updateNgo(id, input);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.ngos.delete.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const success = await storage.deleteNgo(id);
    if (!success) return res.status(404).json({ message: "NGO not found" });
    res.json({ success: true });
  });

  // --- Announcements Routes ---

  // Get all announcements (admin only)
  app.get(api.announcements.list.path, requireAdmin, async (req, res) => {
    const allAnnouncements = await storage.getAnnouncements();
    res.json(allAnnouncements);
  });

  // Get published announcements (public)
  app.get(api.announcements.listPublished.path, async (req, res) => {
    const published = await storage.getPublishedAnnouncements();
    res.json(published);
  });

  // Get single announcement
  app.get(api.announcements.get.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const announcement = await storage.getAnnouncement(id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json(announcement);
  });

  // Create announcement (admin only)
  app.post(api.announcements.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement({ ...input, createdBy: req.session.userId! });
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update announcement (admin only)
  app.put(api.announcements.update.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const input = api.announcements.update.input.parse(req.body);
      const updated = await storage.updateAnnouncement(id, input);
      if (!updated) return res.status(404).json({ message: "Announcement not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Delete announcement (admin only)
  app.delete(api.announcements.delete.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const success = await storage.deleteAnnouncement(id);
    if (!success) return res.status(404).json({ message: "Announcement not found" });
    res.json({ success: true });
  });

  // --- Site Content Routes ---

  // Get all site content (admin only)
  app.get(api.siteContent.list.path, requireAdmin, async (req, res) => {
    const content = await storage.getAllSiteContent();
    res.json(content);
  });

  // Get site content by key (public)
  app.get(api.siteContent.get.path, async (req, res) => {
    const key = req.params.key as string;
    const content = await storage.getSiteContent(key);
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json(content);
  });

  // Upsert site content (admin only)
  app.put(api.siteContent.upsert.path, requireAdmin, async (req, res) => {
    try {
      const key = req.params.key as string;
      const input = api.siteContent.upsert.input.parse(req.body);
      const content = await storage.upsertSiteContent(key, { ...input, updatedBy: req.session.userId! });
      res.json(content);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seeding
  if ((await storage.getNgos()).length === 0) {
    console.log("Seeding database...");
    const admin = await storage.createUser({ username: "admin", password: "admin123", role: "admin" });
    const user = await storage.createUser({ username: "user", password: "user123", role: "user" });
    
    const ngo1 = await storage.createNgo({
      name: "Syrian Hope Foundation",
      arabicName: "مؤسسة الأمل السورية",
      englishName: "Syrian Hope Foundation",
      legalForm: "جمعية أهلية",
      scope: "نطاق محلي",
      city: "Damascus",
      presidentName: "Ahmed Al-Sayed",
      email: "info@syrianhope.org",
      phone: "+96311223344",
      description: "Dedicated to providing educational resources.",
      createdBy: user.id
    });
    await storage.updateNgoStatus(ngo1.id, "Approved");
    
    await storage.createNgo({
      name: "Aleppo Reconstruction Initiative",
      arabicName: "مبادرة إعادة إعمار حلب",
      englishName: "Aleppo Reconstruction Initiative",
      legalForm: "مؤسسة تنموية",
      scope: "نطاق محافظات",
      city: "Aleppo",
      presidentName: "Fatima Khalid",
      email: "contact@alepporebuild.sy",
      phone: "+96321998877",
      description: "Focusing on infrastructure rehabilitation.",
      createdBy: user.id
    });

    // Seed initial announcement
    await storage.createAnnouncement({
      title: "مرحباً بكم في بوابة المنظمات غير الحكومية",
      content: "نرحب بكم في بوابة تسجيل وإدارة المنظمات غير الحكومية التابعة لوزارة الشؤون الاجتماعية والعمل. نسعى لتوفير خدمات متميزة لجميع المنظمات المسجلة.",
      published: true,
      createdBy: admin.id
    });

    // Seed default site content
    await storage.upsertSiteContent("homepage_hero_title", {
      title: "عنوان الصفحة الرئيسية",
      content: "بوابة تشارك - المنظمات غير الحكومية",
      updatedBy: admin.id
    });

    await storage.upsertSiteContent("homepage_hero_description", {
      title: "وصف الصفحة الرئيسية",
      content: "النظام الموحد لتسجيل ومتابعة المنظمات والجمعيات الأهلية في الجمهورية العربية السورية. نسعى لتعزيز العمل الأهلي بشفافية ومصداقية.",
      updatedBy: admin.id
    });

    await storage.upsertSiteContent("homepage_about", {
      title: "نص قسم حول",
      content: "تهدف هذه البوابة إلى تسهيل عملية تسجيل وإدارة المنظمات غير الحكومية والجمعيات الأهلية في سوريا، وتوفير قاعدة بيانات شاملة ومحدثة لجميع المنظمات المسجلة رسمياً.",
      updatedBy: admin.id
    });

    await storage.upsertSiteContent("footer_contact", {
      title: "معلومات التواصل",
      content: "وزارة الشؤون الاجتماعية والعمل - دمشق، الجمهورية العربية السورية | هاتف: +963-11-000-0000 | البريد الإلكتروني: info@molsa.gov.sy",
      updatedBy: admin.id
    });

    await storage.upsertSiteContent("registration_instructions", {
      title: "تعليمات التسجيل",
      content: "يرجى ملء جميع الحقول المطلوبة بدقة. تأكد من صحة المعلومات قبل الإرسال. سيتم مراجعة طلبك من قبل الجهات المختصة وإعلامك بالنتيجة.",
      updatedBy: admin.id
    });
  }

  return httpServer;
}
