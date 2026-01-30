import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import type { User } from "@shared/schema";
import bcrypt from "bcrypt";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

const SALT_ROUNDS = 10;

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
  const isProduction = app.get("env") === "production";
  if (isProduction) {
    app.set("trust proxy", 1);
  }
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev_secret_key",
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: "lax",
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
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = user;
    next();
  };

  const requireSuperAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden: Super Admins only" });
    }
    req.user = user;
    next();
  };

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // --- Auth Routes ---
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check if account is suspended
      if (user.status === "suspended") {
        return res.status(403).json({ message: "تم إيقاف هذا الحساب. يرجى التواصل مع المسؤول." });
      }
      
      // Check password - support both bcrypt and legacy plaintext for migration
      let isValidPassword = false;
      
      // First try bcrypt comparison (for hashed passwords)
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
      } catch {
        // If bcrypt fails (e.g., password isn't a valid hash), try plaintext
        isValidPassword = false;
      }
      
      // If bcrypt failed, check if it's a legacy plaintext password
      if (!isValidPassword && user.password === password) {
        isValidPassword = true;
        // Upgrade to hashed password for security
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await storage.updateUserPassword(user.id, hashedPassword);
      }
      
      if (!isValidPassword) {
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

  // Check username availability endpoint
  app.get("/api/auth/check-username/:username", requireAdmin, async (req, res) => {
    try {
      const { username } = req.params;
      if (!username || username.trim().length < 1) {
        return res.json({ available: false, message: "اسم المستخدم مطلوب" });
      }
      
      const existing = await storage.getUserByUsername(username.trim());
      return res.json({ 
        available: !existing,
        message: existing ? "اسم المستخدم مستخدم مسبقاً" : "اسم المستخدم متاح"
      });
    } catch (error) {
      console.error("[check-username] Error:", error);
      return res.status(500).json({ available: false, message: "خطأ في التحقق" });
    }
  });

  // Admin-only user creation endpoint
  app.post(api.auth.register.path, requireAdmin, async (req, res) => {
    try {
      console.log("[register] Request body:", JSON.stringify(req.body));
      
      const { 
        username, 
        password,
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        governorate,
        registrationNumber,
        registrationDate
      } = req.body;
      
      if (!username || !password) {
        console.log("[register] Missing username or password");
        return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
      }
      
      if (password.length < 6) {
        console.log("[register] Password too short");
        return res.status(400).json({ message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      }
      
      const existing = await storage.getUserByUsername(username);
      console.log("[register] Existing user check:", existing ? "found" : "not found");
      if (existing) {
        return res.status(400).json({ message: "اسم المستخدم موجود مسبقاً. يرجى اختيار اسم مستخدم آخر" });
      }

      // Hash password before storing
      console.log("[register] Hashing password...");
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log("[register] Password hashed, creating user...");
      
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        role: "user",
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        governorate,
        registrationNumber,
        registrationDate,
        status: "active"
      });
      
      console.log("[register] User created:", user.id, user.username);
      res.status(201).json(user);
    } catch (err) {
      console.log("[register] Error:", err);
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
      
      // Compare current password - support both bcrypt and legacy plaintext
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password);
      } catch {
        isValidPassword = false;
      }
      
      // Fallback to plaintext comparison for legacy passwords
      if (!isValidPassword && user.password === currentPassword) {
        isValidPassword = true;
      }
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await storage.updateUserPassword(user.id, hashedPassword);
      res.json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin resets a user's password
  app.post("/api/admin/reset-user-password", requireAdmin, async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      const currentUser = req.user!;
      
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
      
      // Regular admins cannot reset super_admin passwords
      if (targetUser.role === "super_admin" && currentUser.role !== "super_admin") {
        return res.status(403).json({ message: "لا يمكنك تعديل حساب المشرف الأعلى" });
      }
      
      // Hash new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await storage.updateUserPassword(userId, hashedPassword);
      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin gets all users (with full details except password)
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      // Don't send passwords to frontend, but include all other fields
      const safeUsers = allUsers.map(u => ({ 
        id: u.id, 
        username: u.username, 
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        organizationName: u.organizationName,
        governorate: u.governorate,
        registrationNumber: u.registrationNumber,
        registrationDate: u.registrationDate,
        status: u.status,
        createdAt: u.createdAt
      }));
      res.json(safeUsers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin updates a user's details
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = req.user!;
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        organizationName, 
        governorate, 
        registrationNumber, 
        registrationDate,
        status 
      } = req.body;
      
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Regular admins cannot modify super_admin accounts
      if (targetUser.role === "super_admin" && currentUser.role !== "super_admin") {
        return res.status(403).json({ message: "لا يمكنك تعديل حساب المشرف الأعلى" });
      }
      
      // Users cannot suspend their own account
      if (userId === currentUser.id && status === "suspended") {
        return res.status(403).json({ message: "لا يمكنك تعطيل حسابك الخاص" });
      }
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        governorate,
        registrationNumber,
        registrationDate,
        status
      });
      
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Super Admin Routes ---

  // Super admin creates admin accounts
  app.post("/api/super-admin/create-admin", requireSuperAdmin, async (req, res) => {
    try {
      const { 
        username, 
        password,
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        governorate,
        registrationNumber,
        registrationDate
      } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      }
      
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "اسم المستخدم موجود مسبقاً" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        role: "admin",
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        governorate,
        registrationNumber,
        registrationDate,
        status: "active"
      });
      
      res.status(201).json(user);
    } catch (err) {
      console.log("[create-admin] Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Super admin deletes users (can delete admins and regular users)
  app.delete("/api/super-admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = req.user!;
      
      // Cannot delete yourself
      if (userId === currentUser.id) {
        return res.status(400).json({ message: "لا يمكنك حذف حسابك الخاص" });
      }
      
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }
      
      // Cannot delete super admins (only other super admins can delete super admins via different mechanism if needed)
      if (targetUser.role === "super_admin") {
        return res.status(403).json({ message: "لا يمكن حذف حساب المشرف الأعلى" });
      }
      
      await storage.deleteUser(userId);
      res.json({ success: true, message: "تم حذف المستخدم بنجاح" });
    } catch (err) {
      console.error("[delete-user] Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Super admin updates user role (can promote user to admin or demote admin to user)
  app.patch("/api/super-admin/users/:id/role", requireSuperAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      const currentUser = req.user!;
      
      if (!role || !["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "الدور المطلوب غير صالح" });
      }
      
      // Cannot change your own role
      if (userId === currentUser.id) {
        return res.status(400).json({ message: "لا يمكنك تغيير دور حسابك الخاص" });
      }
      
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }
      
      // Cannot change super admin roles
      if (targetUser.role === "super_admin") {
        return res.status(403).json({ message: "لا يمكن تعديل دور المشرف الأعلى" });
      }
      
      const updatedUser = await storage.updateUser(userId, { role });
      res.json(updatedUser);
    } catch (err) {
      console.error("[update-user-role] Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Statistics endpoint for dashboard
  app.get("/api/admin/statistics", requireAdmin, async (req, res) => {
    try {
      const allNgos = await storage.getNgos();
      const allUsers = await storage.getAllUsers();
      
      const stats = {
        totalNgos: allNgos.length,
        pendingByAdmin: allNgos.filter(n => n.status === "Pending").length,
        pendingBySuperAdmin: allNgos.filter(n => n.status === "AdminApproved").length,
        approved: allNgos.filter(n => n.status === "Approved").length,
        rejected: allNgos.filter(n => n.status === "Rejected").length,
        totalUsers: allUsers.filter(u => u.role === "user").length,
        totalAdmins: allUsers.filter(u => u.role === "admin").length,
        totalSuperAdmins: allUsers.filter(u => u.role === "super_admin").length
      };
      
      res.json(stats);
    } catch (err) {
      console.error("[statistics] Error:", err);
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

  // Public endpoint: Get a single approved NGO by ID (no auth required)
  app.get("/api/ngos/public/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid NGO ID" });
    }
    const ngo = await storage.getNgo(id);
    if (!ngo || ngo.status !== "Approved") {
      return res.status(404).json({ error: "NGO not found" });
    }
    res.json(ngo);
  });

  // Public endpoint: Get all job and volunteer opportunities from approved NGOs
  app.get(api.opportunities.list.path, async (_req, res) => {
    const allNgos = await storage.getNgos();
    const approvedNgos = allNgos.filter(ngo => ngo.status === "Approved");
    
    const opportunities: Array<{
      id: string;
      type: 'job' | 'volunteer';
      ngoId: number;
      ngoName: string;
      vacancyName: string;
      workField?: string;
      governorate?: string;
      startDate?: string;
      endDate?: string;
      commitmentNature?: string;
      qualification?: string;
      skills?: string;
      experience?: string;
      details?: string;
      jobPurpose?: string;
      volunteerPurpose?: string;
      employmentType?: string;
      education?: string;
      classification?: string;
    }> = [];

    for (const ngo of approvedNgos) {
      // Extract job opportunities
      if (ngo.jobOpportunities && Array.isArray(ngo.jobOpportunities)) {
        for (let i = 0; i < ngo.jobOpportunities.length; i++) {
          const job = ngo.jobOpportunities[i] as any;
          opportunities.push({
            id: `job-${ngo.id}-${i}`,
            type: 'job',
            ngoId: ngo.id,
            ngoName: ngo.arabicName,
            vacancyName: job.vacancyName || '',
            workField: job.workField,
            governorate: job.governorate,
            startDate: job.startDate,
            endDate: job.endDate,
            commitmentNature: job.commitmentNature,
            qualification: job.qualification,
            skills: job.skills,
            experience: job.experience,
            details: job.details,
            jobPurpose: job.jobPurpose,
            employmentType: job.employmentType,
            education: job.education,
            classification: job.classification,
          });
        }
      }

      // Extract volunteer opportunities
      if (ngo.volunteerOpportunities && Array.isArray(ngo.volunteerOpportunities)) {
        for (let i = 0; i < ngo.volunteerOpportunities.length; i++) {
          const vol = ngo.volunteerOpportunities[i] as any;
          opportunities.push({
            id: `volunteer-${ngo.id}-${i}`,
            type: 'volunteer',
            ngoId: ngo.id,
            ngoName: ngo.arabicName,
            vacancyName: vol.vacancyName || '',
            workField: vol.workField,
            governorate: vol.governorate,
            startDate: vol.startDate,
            endDate: vol.endDate,
            commitmentNature: vol.commitmentNature,
            qualification: vol.qualification,
            skills: vol.skills,
            experience: vol.experience,
            volunteerPurpose: vol.volunteerPurpose,
            details: vol.details,
          });
        }
      }
    }

    res.json(opportunities);
  });

  // Get a single opportunity by ID
  app.get(api.opportunities.get.path, async (req, res) => {
    const id = req.params.id as string;
    
    // Parse the ID format: job-{ngoId}-{index} or volunteer-{ngoId}-{index}
    const match = id.match(/^(job|volunteer)-(\d+)-(\d+)$/);
    if (!match) {
      return res.status(404).json({ message: "الفرصة غير موجودة" });
    }

    const [, type, ngoIdStr, indexStr] = match;
    const ngoId = parseInt(ngoIdStr);
    const index = parseInt(indexStr);

    const ngo = await storage.getNgo(ngoId);
    if (!ngo || ngo.status !== "Approved") {
      return res.status(404).json({ message: "الفرصة غير موجودة" });
    }

    let opportunity: any = null;

    if (type === 'job') {
      const jobs = ngo.jobOpportunities as any[] | null;
      if (jobs && jobs[index]) {
        const job = jobs[index];
        opportunity = {
          id,
          type: 'job' as const,
          ngoId: ngo.id,
          ngoName: ngo.arabicName,
          vacancyName: job.vacancyName || '',
          vacancyNumber: job.vacancyNumber,
          workField: job.workField,
          governorate: job.governorate,
          startDate: job.startDate,
          endDate: job.endDate,
          commitmentNature: job.commitmentNature,
          qualification: job.qualification,
          skills: job.skills,
          experience: job.experience,
          details: job.details,
          jobPurpose: job.jobPurpose,
          employmentType: job.employmentType,
          education: job.education,
          classification: job.classification,
        };
      }
    } else {
      const volunteers = ngo.volunteerOpportunities as any[] | null;
      if (volunteers && volunteers[index]) {
        const vol = volunteers[index];
        opportunity = {
          id,
          type: 'volunteer' as const,
          ngoId: ngo.id,
          ngoName: ngo.arabicName,
          vacancyName: vol.vacancyName || '',
          vacancyNumber: vol.vacancyNumber,
          workField: vol.workField,
          governorate: vol.governorate,
          startDate: vol.startDate,
          endDate: vol.endDate,
          commitmentNature: vol.commitmentNature,
          qualification: vol.qualification,
          skills: vol.skills,
          experience: vol.experience,
          volunteerPurpose: vol.volunteerPurpose,
          details: vol.details,
        };
      }
    }

    if (!opportunity) {
      return res.status(404).json({ message: "الفرصة غير موجودة" });
    }

    res.json(opportunity);
  });

  // Get all NGOs (Super Admin sees AdminApproved, Admin sees Pending, User sees theirs)
  app.get(api.ngos.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).send();

    let ngos;
    if (user.role === 'super_admin') {
      // Super admin sees all NGOs
      ngos = await storage.getNgos();
    } else if (user.role === 'admin') {
      // Admin sees all NGOs except those awaiting super admin approval (they see Pending status)
      ngos = await storage.getNgos();
    } else {
      ngos = await storage.getNgosByUserId(user.id);
    }
    res.json(ngos);
  });

  // Get NGOs awaiting super admin approval (AdminApproved status)
  app.get("/api/super-admin/pending-ngos", requireSuperAdmin, async (req, res) => {
    const allNgos = await storage.getNgos();
    const pendingNgos = allNgos.filter(ngo => ngo.status === "AdminApproved");
    res.json(pendingNgos);
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

  // Admin approves NGO (moves to AdminApproved)
  app.patch(api.ngos.updateStatus.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const { status, rejectionReason } = req.body;
      const user = req.user!;
      
      const ngo = await storage.getNgo(id);
      if (!ngo) return res.status(404).json({ message: "NGO not found" });
      
      // Determine what the admin can do based on role and current NGO status
      if (user.role === "admin") {
        // Regular admin can only approve Pending -> AdminApproved or Reject
        if (ngo.status !== "Pending") {
          return res.status(400).json({ message: "يمكنك فقط معالجة المنظمات بحالة 'قيد الانتظار'" });
        }
        
        if (status === "Approved" || status === "AdminApproved") {
          // Admin approves -> moves to AdminApproved
          const updated = await storage.updateNgoApproval(id, {
            status: "AdminApproved",
            approvedByAdminId: user.id,
            approvedByAdminAt: new Date()
          });
          return res.json(updated);
        } else if (status === "Rejected") {
          if (!rejectionReason) {
            return res.status(400).json({ message: "يرجى ذكر سبب الرفض" });
          }
          const updated = await storage.updateNgoApproval(id, {
            status: "Rejected",
            rejectedById: user.id,
            rejectedAt: new Date(),
            rejectionReason
          });
          return res.json(updated);
        }
      } else if (user.role === "super_admin") {
        // Super admin can only act on AdminApproved NGOs (after admin approval)
        if (ngo.status === "Pending") {
          return res.status(400).json({ message: "يجب أن يوافق المشرف العادي على المنظمة أولاً قبل أن تتمكن من اتخاذ إجراء" });
        }
        
        if (status === "Approved") {
          if (ngo.status !== "AdminApproved") {
            return res.status(400).json({ message: "يجب أن يوافق المشرف العادي على المنظمة أولاً" });
          }
          const updated = await storage.updateNgoApproval(id, {
            status: "Approved",
            approvedBySuperAdminId: user.id,
            approvedBySuperAdminAt: new Date()
          });
          return res.json(updated);
        } else if (status === "Rejected") {
          if (ngo.status !== "AdminApproved") {
            return res.status(400).json({ message: "يمكنك فقط رفض المنظمات الموافق عليها من المشرف العادي" });
          }
          if (!rejectionReason) {
            return res.status(400).json({ message: "يرجى ذكر سبب الرفض" });
          }
          const updated = await storage.updateNgoApproval(id, {
            status: "Rejected",
            rejectedById: user.id,
            rejectedAt: new Date(),
            rejectionReason
          });
          return res.json(updated);
        }
      }
      
      res.status(400).json({ message: "Invalid status transition" });
    } catch (err) {
      console.error("Error updating NGO status:", err);
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
      if (user.role !== "admin" && user.role !== "super_admin" && ngo.createdBy !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Regular users cannot edit NGOs under review (Pending or AdminApproved)
      // Admins and super admins can still edit
      if (user.role === "user" && (ngo.status === "Pending" || ngo.status === "AdminApproved")) {
        return res.status(403).json({ message: "لا يمكن تعديل الجمعية أثناء فترة المراجعة" });
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

  // Notices (التعاميم) endpoints
  app.get(api.notices.list.path, requireAdmin, async (req, res) => {
    const allNotices = await storage.getNotices();
    res.json(allNotices);
  });

  app.get(api.notices.listPublic.path, async (req, res) => {
    const allNotices = await storage.getNotices();
    res.json(allNotices);
  });

  app.get(api.notices.get.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const notice = await storage.getNotice(id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  });

  app.post(api.notices.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.notices.create.input.parse(req.body);
      const notice = await storage.createNotice({ ...input, createdBy: req.session.userId! });
      res.status(201).json(notice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.notices.update.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const input = api.notices.update.input.parse(req.body);
      const updated = await storage.updateNotice(id, input);
      if (!updated) return res.status(404).json({ message: "Notice not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.notices.delete.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const success = await storage.deleteNotice(id);
    if (!success) return res.status(404).json({ message: "Notice not found" });
    res.json({ success: true });
  });

  // --- Footer Links Routes ---

  // Get all footer links (public - used by footer component)
  app.get("/api/footer-links", async (_req, res) => {
    const links = await storage.getFooterLinks();
    res.json(links);
  });

  // Admin: Get all footer links
  app.get("/api/admin/footer-links", requireAdmin, async (_req, res) => {
    const links = await storage.getFooterLinks();
    res.json(links);
  });

  // Admin: Create footer link
  app.post("/api/admin/footer-links", requireAdmin, async (req, res) => {
    try {
      const { title, url, sortOrder } = req.body;
      if (!title || !url) {
        return res.status(400).json({ message: "العنوان والرابط مطلوبان" });
      }
      const link = await storage.createFooterLink({ title, url, sortOrder: sortOrder || 0 });
      res.status(201).json(link);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Update footer link
  app.put("/api/admin/footer-links/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, url, sortOrder } = req.body;
      const updated = await storage.updateFooterLink(id, { title, url, sortOrder });
      if (!updated) return res.status(404).json({ message: "الرابط غير موجود" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Admin: Delete footer link
  app.delete("/api/admin/footer-links/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteFooterLink(id);
    if (!success) return res.status(404).json({ message: "الرابط غير موجود" });
    res.json({ success: true });
  });

  // --- Open Graph Meta Tags for Social Media Sharing ---
  // This middleware injects dynamic meta tags for news article pages
  app.get("/news/:id", async (req, res, next) => {
    const userAgent = req.get("user-agent") || "";
    
    // Allow testing OG tags via query parameter: /news/1?og=1
    const forceOg = req.query.og === "1" || req.query.og === "true";
    
    // Check if this is a social media crawler/bot or link previewer
    const socialBots = [
      "facebookexternalhit",
      "Facebot",
      "Twitterbot",
      "WhatsApp",
      "LinkedInBot",
      "TelegramBot",
      "Slackbot",
      "Discord",
      "bot",
      "crawler",
      "spider",
      "preview",
      "embed",
      "curl",
      "wget",
      "python-requests",
      "okhttp",
      "axios",
      "node-fetch",
      "Googlebot",
      "bingbot",
      "yahoo",
      "baidu",
      "yandex",
      "duckduckgo",
      "applebot",
      "pingdom",
      "lighthouse",
      "Pinterestbot",
      "Rogerbot",
      "Screaming Frog",
      "ia_archiver",
      "heritrix",
      "Syndicator"
    ];
    
    const isSocialBot = socialBots.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    );
    
    // If not a social bot and not forcing OG, let the SPA handle it
    if (!isSocialBot && !forceOg) {
      return next();
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return next();
      }
      
      const announcement = await storage.getAnnouncement(id);
      if (!announcement) {
        return next();
      }
      
      // HTML-escape function to prevent XSS and broken meta tags
      const escapeHtml = (text: string) => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };
      
      // Strip HTML tags from content for description
      const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, "").substring(0, 200);
      };
      
      const title = escapeHtml(announcement.title);
      const description = escapeHtml(stripHtml(announcement.content || ""));
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const articleUrl = `${baseUrl}/news/${id}`;
      
      // Use article image or fallback to default platform image
      // Make sure image URL is absolute for social media platforms
      let imageUrl = announcement.imageUrl || "/favicon.png";
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
      }
      
      // Build Open Graph HTML
      const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - منصة تشارك</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:site_name" content="منصة تشارك" />
  <meta property="og:locale" content="ar_SY" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <a href="${articleUrl}">اقرأ المزيد على منصة تشارك</a>
</body>
</html>`;
      
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (error) {
      console.error("Error generating OG meta tags:", error);
      next();
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
