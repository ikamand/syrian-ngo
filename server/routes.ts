import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";

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

  // --- NGO Routes ---

  // Get all NGOs (Admin sees all, User sees theirs - logic in route or generic list?)
  // Requirement says: "Admin Panel: View all NGOs", "User Dashboard: View list of NGOs they created"
  // Let's implement /api/ngos to return based on role or context
  app.get(api.ngos.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
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
    const id = parseInt(req.params.id);
    const ngo = await storage.getNgo(id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    
    // Check ownership if not admin? 
    // For now, let's allow viewing if logged in (public transparency?) or strict?
    // User dashboard requirement says "Edit existing NGOs", implying ownership check.
    // Let's keep it simple: if you can get it, you can see it.
    res.json(ngo);
  });

  app.post(api.ngos.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.ngos.create.input.parse(req.body);
      const ngo = await storage.createNgo({ ...input, createdBy: req.session.userId });
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
      const ngo = await storage.getNgo(id);
      
      if (!ngo) return res.status(404).json({ message: "NGO not found" });
      
      // Ensure user owns the NGO or is admin
      if (req.user!.role !== "admin" && ngo.createdBy !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const input = api.ngos.update.input.parse(req.body);
      
      // If admin is updating, we might want to preserve status unless they explicitly change it
      // But based on user request "after the request is done it'll need to be approved by the admin"
      // we default to Pending in storage.updateNgo for everyone or handle here.
      // Let's handle status reset specifically for non-admins if needed, 
      // but storage.updateNgo already does it.
      
      const updated = await storage.updateNgo(id, input);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.ngos.delete.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteNgo(id);
    if (!success) return res.status(404).json({ message: "NGO not found" });
    res.json({ success: true });
  });

  // Seeding
  if ((await storage.getNgos()).length === 0) {
    console.log("Seeding database...");
    const admin = await storage.createUser({ username: "admin", password: "admin123", role: "admin" });
    const user = await storage.createUser({ username: "user", password: "user123", role: "user" });
    
    await storage.createNgo({
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
      status: "Approved",
      createdBy: user.id
    });
    
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
      status: "Pending",
      createdBy: user.id
    });
  }

  return httpServer;
}
