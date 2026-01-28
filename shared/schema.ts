import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  organizationName: text("organization_name"),
  governorate: text("governorate"),
  registrationNumber: text("registration_number"),
  registrationDate: text("registration_date"),
  status: text("status", { enum: ["active", "suspended"] }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  
  // Section 1: معلومات التأسيس - Basic Info
  orgIdentifier: text("org_identifier"),
  arabicName: text("arabic_name").notNull(),
  englishName: text("english_name"),
  legalForm: text("legal_form").notNull(),
  
  // Section 1: معلومات الإشهار - Publication Info
  scope: text("scope").notNull(),
  orgStatus: text("org_status"),
  publicationNumber: text("publication_number"),
  publicationDate: text("publication_date"),
  hasPublicBenefit: boolean("has_public_benefit").default(false),
  hasInternalRegulations: boolean("has_internal_regulations").default(false),
  hasWomenPolicy: boolean("has_women_policy").default(false),
  hasVolunteerPolicy: boolean("has_volunteer_policy").default(false),
  hasOrgStructure: boolean("has_org_structure").default(false),
  
  // Section 1: نبذة عن المنظمة
  description: text("description"),
  
  // Organization logo
  logo: text("logo"),
  
  // Section 1: وثائق المنظمة (file paths stored as text)
  internalRegulationsDoc: text("internal_regulations_doc"),
  publicationDecisionDoc: text("publication_decision_doc"),
  publicBenefitDoc: text("public_benefit_doc"),
  
  // Section 2: التصنيفات والخدمات (JSON array)
  classifications: jsonb("classifications").$type<Array<{type: string, name: string}>>(),
  services: jsonb("services").$type<Array<{
    specialty: string,
    serviceType: string,
    targetGroup: string,
    governorate: string,
    serviceDescription: string,
    serviceTiming: string,
    availabilityStatus: string
  }>>(),
  
  // Section 3: المراكز الخدمية (JSON array)
  serviceCenters: jsonb("service_centers").$type<Array<{
    name: string,
    centerType: string,
    licenseNumber: string,
    longitude: string,
    latitude: string,
    detailedAddress: string,
    division: string,
    propertyArea: string,
    propertyNumber: string,
    licensedGovernorate: string
  }>>(),
  
  // Section 4: الفروع والمكاتب (JSON array)
  branches: jsonb("branches").$type<Array<{
    branchType: string,
    licensedGovernorate: string,
    address: string,
    propertyArea: string,
    propertyNumber: string,
    propertyOccupied: boolean,
    longitude: string,
    latitude: string,
    offeredServices: string
  }>>(),
  
  // Section 5: العلاقة مع الوزارة (JSON array)
  financialData: jsonb("financial_data").$type<Array<{
    year: string,
    closingBudget: string,
    budgetDocument: string
  }>>(),
  
  // Section 6: معلومات التواصل (JSON array)
  contactMethods: jsonb("contact_methods").$type<Array<{
    type: string,
    value: string
  }>>(),
  
  // Section 7: الحسابات البنكية (JSON array)
  bankAccounts: jsonb("bank_accounts").$type<Array<{
    bankName: string,
    branchName: string,
    accountNumber: string,
    isDonationAccount: boolean
  }>>(),
  
  // Section 8: البرامج والأنشطة
  programs: jsonb("programs").$type<Array<{
    name: string,
    targetGroups: string,
    services: string,
    goals: string
  }>>(),
  activities: jsonb("activities").$type<Array<{
    name: string,
    activityType: string,
    goals: string,
    services: string,
    targetGroups: string
  }>>(),
  annualPlans: jsonb("annual_plans").$type<Array<{
    plan: string,
    tracking: string
  }>>(),
  unCooperation: jsonb("un_cooperation").$type<Array<{
    basicInfo: string,
    projectSector: string,
    projectGoals: string,
    governorates: string,
    financialData: string
  }>>(),
  
  // Section 9: الوضع الإداري والتنظيمي
  meetingMinutes: jsonb("meeting_minutes").$type<Array<{
    meetingName: string,
    meetingDate: string,
    attendees: string,
    minutesFile: string
  }>>(),
  employees: jsonb("employees").$type<Array<{
    firstName: string,
    lastName: string,
    fatherName: string,
    motherName: string,
    nationalId: string,
    contactNumber: string,
    gender: string,
    governorate: string,
    birthDate: string,
    hasDisabilityCard: boolean,
    address: string,
    branch: string,
    position: string,
    work: string,
    employmentStartDate: string,
    insuranceNumber: string,
    employmentNumber: string,
    memberStatus: string,
    qualifications: string
  }>>(),
  volunteers: jsonb("volunteers").$type<Array<{
    firstName: string,
    lastName: string,
    fatherName: string,
    motherName: string,
    nationalId: string,
    contactNumber: string,
    gender: string,
    governorate: string,
    birthDate: string,
    hasDisabilityCard: boolean,
    address: string,
    branch: string,
    position: string,
    work: string,
    startDate: string,
    insuranceNumber: string,
    volunteerNumber: string,
    memberStatus: string
  }>>(),
  
  // Section 10: الممتلكات
  vehicles: jsonb("vehicles").$type<Array<{
    vehicleType: string,
    model: string,
    plateNumber: string,
    governorate: string,
    serialNumber: string,
    chassisNumber: string,
    manufacturingYear: string,
    fuelType: string,
    passengerCount: string,
    ownershipType: string,
    ownershipDocument: string,
    taxExempt: boolean
  }>>(),
  realEstate: jsonb("real_estate").$type<Array<{
    propertyNumber: string,
    propertyType: string,
    administrativeArea: string,
    governorate: string,
    ownershipType: string,
    ownershipDocument: string
  }>>(),
  
  // Section 11: البيانات الاختيارية
  jobOpportunities: jsonb("job_opportunities").$type<Array<{
    workField: string,
    vacancyName: string,
    vacancyNumber: string,
    governorate: string,
    startDate: string,
    endDate: string,
    commitmentNature: string,
    jobPurpose: string,
    qualification: string,
    skills: string,
    experience: string,
    details: string,
    employmentType: string,
    education: string,
    classification: string
  }>>(),
  volunteerOpportunities: jsonb("volunteer_opportunities").$type<Array<{
    workField: string,
    vacancyName: string,
    vacancyNumber: string,
    governorate: string,
    startDate: string,
    endDate: string,
    commitmentNature: string,
    volunteerPurpose: string,
    qualification: string,
    skills: string,
    experience: string
  }>>(),
  statistics: jsonb("statistics").$type<Array<{
    title: string,
    count: string,
    icon: string
  }>>(),
  events: jsonb("events").$type<Array<{
    image: string,
    eventName: string,
    invitationType: string,
    eventType: string,
    startDate: string,
    endDate: string,
    announcementDate: string,
    announcementEndDate: string,
    startDescription: string,
    endDescription: string,
    address: string,
    details: string
  }>>(),
  donationCampaigns: jsonb("donation_campaigns").$type<Array<{
    image: string,
    campaignName: string,
    campaignType: string,
    targetGroups: string,
    startDate: string,
    endDate: string,
    governorate: string,
    details: string
  }>>(),
  photoGallery: jsonb("photo_gallery").$type<Array<{
    image: string,
    title: string,
    details: string
  }>>(),
  
  // Section 11: إعدادات الدفع الإلكتروني
  syriatelCashEnabled: boolean("syriatel_cash_enabled").default(false),
  mtnCashEnabled: boolean("mtn_cash_enabled").default(false),
  
  // Section 11: إدارة واجهات الجمهور
  showJobOpportunities: boolean("show_job_opportunities").default(false),
  showVolunteerOpportunities: boolean("show_volunteer_opportunities").default(false),
  showEvents: boolean("show_events").default(false),
  showDonationCampaigns: boolean("show_donation_campaigns").default(false),
  
  // Section 11: تشبيك
  networking: jsonb("networking").$type<Array<{
    needType: string,
    classification: string,
    need: string,
    description: string,
    count: string
  }>>(),
  
  // Legacy fields (kept for compatibility)
  name: text("name"),
  city: text("city"),
  presidentName: text("president_name"),
  email: text("email"),
  phone: text("phone"),
  
  // System fields
  status: text("status", { enum: ["Pending", "Approved", "Rejected"] }).default("Pending").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  noticeNumber: text("notice_number").notNull(),
  noticeDate: text("notice_date").notNull(),
  title: text("title"),
  pdfUrl: text("pdf_url").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const footerLinks = pgTable("footer_links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertNgoSchema = createInsertSchema(ngos).omit({ id: true, status: true, createdBy: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdBy: true, createdAt: true, updatedAt: true });
export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true, updatedBy: true, updatedAt: true });
export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true, createdBy: true, createdAt: true });
export const insertFooterLinkSchema = createInsertSchema(footerLinks).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;

export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;

export type FooterLink = typeof footerLinks.$inferSelect;
export type InsertFooterLink = z.infer<typeof insertFooterLinkSchema>;
