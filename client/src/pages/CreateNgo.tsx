import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreateNgo } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { LogoUploader } from "@/components/LogoUploader";
import { ImageUploader } from "@/components/ImageUploader";
import { DocumentUploader } from "@/components/DocumentUploader";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const governorates = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "الرقة",
  "دير الزور",
  "الحسكة",
  "درعا",
  "السويداء",
  "القنيطرة",
];

const legalForms = [
  "جمعية أهلية",
  "مؤسسة خاصة",
  "مؤسسة تنموية",
  "مؤسسة خيرية",
  "اتحاد جمعيات",
  "منظمة غير حكومية دولية",
  "منظمة مجتمع مدني",
];

const scopeOptions = [
  "نطاق محلي",
  "نطاق محافظة",
  "نطاق محافظات",
  "نطاق وطني",
  "نطاق إقليمي",
  "نطاق دولي",
];

const orgStatusOptions = [
  "فعالة",
  "معلقة",
  "منحلة",
  "قيد التأسيس",
];

const formSchema = z.object({
  // Section 1: معلومات التأسيس
  orgIdentifier: z.string().optional(),
  arabicName: z.string().min(1, "الاسم العربي مطلوب"),
  englishName: z.string().optional(),
  legalForm: z.string().min(1, "الشكل القانوني مطلوب"),
  scope: z.string().min(1, "نطاق العمل مطلوب"),
  headquartersGovernorate: z.string().optional(),
  orgStatus: z.string().optional(),
  publicationNumber: z.string().optional(),
  publicationDate: z.string().optional(),
  hasPublicBenefit: z.boolean().default(false),
  hasInternalRegulations: z.boolean().default(false),
  hasWomenPolicy: z.boolean().default(false),
  hasVolunteerPolicy: z.boolean().default(false),
  hasOrgStructure: z.boolean().default(false),
  description: z.string().optional(),
  logo: z.string().optional(),
  internalRegulationsDoc: z.string().optional(),
  publicationDecisionDoc: z.string().optional(),
  publicBenefitDoc: z.string().optional(),
  
  // Section 2: التصنيفات والخدمات
  classifications: z.array(z.object({
    type: z.string(),
    name: z.string(),
  })).optional(),
  services: z.array(z.object({
    specialty: z.string(),
    serviceType: z.string(),
    targetGroup: z.string(),
    governorate: z.string(),
    serviceDescription: z.string(),
    serviceTiming: z.string(),
    availabilityStatus: z.string(),
  })).optional(),
  
  // Section 3: المراكز الخدمية
  serviceCenters: z.array(z.object({
    name: z.string(),
    centerType: z.string(),
    licenseNumber: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    detailedAddress: z.string(),
    division: z.string(),
    propertyArea: z.string(),
    propertyNumber: z.string(),
    licensedGovernorate: z.string(),
  })).optional(),
  
  // Section 4: الفروع والمكاتب
  branches: z.array(z.object({
    branchType: z.string(),
    licensedGovernorate: z.string(),
    address: z.string(),
    propertyArea: z.string(),
    propertyNumber: z.string(),
    propertyOccupied: z.boolean(),
    longitude: z.string(),
    latitude: z.string(),
    offeredServices: z.string(),
  })).optional(),
  
  // Section 5: العلاقة مع الوزارة
  financialData: z.array(z.object({
    year: z.string(),
    closingBudget: z.string(),
    budgetDocument: z.string(),
  })).optional(),
  
  // Section 6: معلومات التواصل
  contactMethods: z.array(z.object({
    type: z.string(),
    value: z.string(),
  })).optional(),
  
  // Section 7: الحسابات البنكية
  bankAccounts: z.array(z.object({
    bankName: z.string(),
    branchName: z.string(),
    accountNumber: z.string(),
    isDonationAccount: z.boolean(),
  })).optional(),
  
  // Section 8: البرامج والأنشطة
  programs: z.array(z.object({
    name: z.string(),
    targetGroups: z.string(),
    services: z.string(),
    goals: z.string(),
  })).optional(),
  activities: z.array(z.object({
    name: z.string(),
    activityType: z.string(),
    goals: z.string(),
    services: z.string(),
    targetGroups: z.string(),
  })).optional(),
  annualPlans: z.array(z.object({
    plan: z.string(),
    tracking: z.string(),
  })).optional(),
  unCooperation: z.array(z.object({
    basicInfo: z.string(),
    projectSector: z.string(),
    projectGoals: z.string(),
    governorates: z.string(),
    financialData: z.string(),
  })).optional(),
  
  // Section 9: الوضع الإداري والتنظيمي
  meetingMinutes: z.array(z.object({
    meetingName: z.string(),
    meetingDate: z.string(),
    attendees: z.string(),
    minutesFile: z.string(),
  })).optional(),
  employees: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    nationalId: z.string(),
    contactNumber: z.string(),
    gender: z.string(),
    governorate: z.string(),
    birthDate: z.string(),
    hasDisabilityCard: z.boolean(),
    address: z.string(),
    branch: z.string(),
    position: z.string(),
    work: z.string(),
    employmentStartDate: z.string(),
    insuranceNumber: z.string(),
    employmentNumber: z.string(),
    memberStatus: z.string(),
    qualifications: z.string(),
  })).optional(),
  volunteers: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    nationalId: z.string(),
    contactNumber: z.string(),
    gender: z.string(),
    governorate: z.string(),
    birthDate: z.string(),
    hasDisabilityCard: z.boolean(),
    address: z.string(),
    branch: z.string(),
    position: z.string(),
    work: z.string(),
    startDate: z.string(),
    insuranceNumber: z.string(),
    volunteerNumber: z.string(),
    memberStatus: z.string(),
  })).optional(),
  
  // Section 10: الممتلكات
  vehicles: z.array(z.object({
    vehicleType: z.string(),
    model: z.string(),
    plateNumber: z.string(),
    governorate: z.string(),
    serialNumber: z.string(),
    chassisNumber: z.string(),
    manufacturingYear: z.string(),
    fuelType: z.string(),
    passengerCount: z.string(),
    ownershipType: z.string(),
    ownershipDocument: z.string(),
    taxExempt: z.boolean(),
  })).optional(),
  realEstate: z.array(z.object({
    propertyNumber: z.string(),
    propertyType: z.string(),
    administrativeArea: z.string(),
    governorate: z.string(),
    ownershipType: z.string(),
    ownershipDocument: z.string(),
  })).optional(),
  
  // Section 11: البيانات الاختيارية
  jobOpportunities: z.array(z.object({
    workField: z.string(),
    vacancyName: z.string(),
    vacancyNumber: z.string(),
    governorate: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    commitmentNature: z.string(),
    jobPurpose: z.string(),
    qualification: z.string(),
    skills: z.string(),
    experience: z.string(),
    details: z.string(),
  })).optional(),
  volunteerOpportunities: z.array(z.object({
    workField: z.string(),
    vacancyName: z.string(),
    vacancyNumber: z.string(),
    governorate: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    commitmentNature: z.string(),
    volunteerPurpose: z.string(),
    qualification: z.string(),
    skills: z.string(),
    experience: z.string(),
  })).optional(),
  statistics: z.array(z.object({
    title: z.string(),
    count: z.string(),
    icon: z.string(),
  })).optional(),
  events: z.array(z.object({
    image: z.string(),
    eventName: z.string(),
    invitationType: z.string(),
    eventType: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    announcementDate: z.string(),
    announcementEndDate: z.string(),
    startDescription: z.string(),
    endDescription: z.string(),
    address: z.string(),
    details: z.string(),
  })).optional(),
  donationCampaigns: z.array(z.object({
    image: z.string(),
    campaignName: z.string(),
    campaignType: z.string(),
    targetGroups: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    governorate: z.string(),
    details: z.string(),
  })).optional(),
  photoGallery: z.array(z.object({
    image: z.string(),
    title: z.string(),
    details: z.string(),
  })).optional(),
  syriatelCashEnabled: z.boolean().default(false),
  mtnCashEnabled: z.boolean().default(false),
  showJobOpportunities: z.boolean().default(false),
  showVolunteerOpportunities: z.boolean().default(false),
  showEvents: z.boolean().default(false),
  showDonationCampaigns: z.boolean().default(false),
  networking: z.array(z.object({
    needType: z.string(),
    classification: z.string(),
    need: z.string(),
    description: z.string(),
    count: z.string(),
  })).optional(),
  
  // Legacy fields
  name: z.string().optional(),
  city: z.string().optional(),
  presidentName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNgo() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: createNgo, isPending } = useCreateNgo();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgIdentifier: "",
      arabicName: "",
      englishName: "",
      legalForm: "",
      scope: "",
      orgStatus: "",
      publicationNumber: "",
      publicationDate: "",
      hasPublicBenefit: false,
      hasInternalRegulations: false,
      hasWomenPolicy: false,
      hasVolunteerPolicy: false,
      hasOrgStructure: false,
      description: "",
      logo: "",
      classifications: [],
      services: [],
      serviceCenters: [],
      branches: [],
      financialData: [],
      contactMethods: [],
      bankAccounts: [],
      programs: [],
      activities: [],
      annualPlans: [],
      unCooperation: [],
      meetingMinutes: [],
      employees: [],
      volunteers: [],
      vehicles: [],
      realEstate: [],
      jobOpportunities: [],
      volunteerOpportunities: [],
      statistics: [],
      events: [],
      donationCampaigns: [],
      photoGallery: [],
      syriatelCashEnabled: false,
      mtnCashEnabled: false,
      showJobOpportunities: false,
      showVolunteerOpportunities: false,
      showEvents: false,
      showDonationCampaigns: false,
      networking: [],
    },
  });

  // Field arrays for dynamic sections
  const classificationsArray = useFieldArray({ control: form.control, name: "classifications" });
  const servicesArray = useFieldArray({ control: form.control, name: "services" });
  const serviceCentersArray = useFieldArray({ control: form.control, name: "serviceCenters" });
  const branchesArray = useFieldArray({ control: form.control, name: "branches" });
  const financialDataArray = useFieldArray({ control: form.control, name: "financialData" });
  const contactMethodsArray = useFieldArray({ control: form.control, name: "contactMethods" });
  const bankAccountsArray = useFieldArray({ control: form.control, name: "bankAccounts" });
  const programsArray = useFieldArray({ control: form.control, name: "programs" });
  const activitiesArray = useFieldArray({ control: form.control, name: "activities" });
  const employeesArray = useFieldArray({ control: form.control, name: "employees" });
  const volunteersArray = useFieldArray({ control: form.control, name: "volunteers" });
  const vehiclesArray = useFieldArray({ control: form.control, name: "vehicles" });
  const realEstateArray = useFieldArray({ control: form.control, name: "realEstate" });
  const jobOpportunitiesArray = useFieldArray({ control: form.control, name: "jobOpportunities" });
  const volunteerOpportunitiesArray = useFieldArray({ control: form.control, name: "volunteerOpportunities" });
  const statisticsArray = useFieldArray({ control: form.control, name: "statistics" });
  const eventsArray = useFieldArray({ control: form.control, name: "events" });
  const donationCampaignsArray = useFieldArray({ control: form.control, name: "donationCampaigns" });
  const photoGalleryArray = useFieldArray({ control: form.control, name: "photoGallery" });
  const networkingArray = useFieldArray({ control: form.control, name: "networking" });

  if (isAuthLoading) return null;

  if (!user) {
    setLocation("/login");
    return null;
  }

  const onSubmit = (data: FormValues) => {
    createNgo(data as any, {
      onSuccess: () => {
        setLocation("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary" data-testid="button-back-dashboard">
            <ArrowRight className="w-4 h-4" />
            العودة للوحة التحكم
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto shadow-lg border-primary/10">
          <CardHeader className="border-b bg-white rounded-t-xl pb-6">
            <CardTitle className="text-2xl text-primary">إنشاء منظمة جديدة</CardTitle>
            <CardDescription>يرجى ملء البيانات المطلوبة لتسجيل منظمتكم على منصة تشارك</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Accordion type="multiple" defaultValue={["section-1"]} className="w-full space-y-4">
                  
                  {/* Section 1: معلومات التأسيس */}
                  <AccordionItem value="section-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-1">
                      1. معلومات التأسيس
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* المعلومات الأساسية */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">المعلومات الأساسية</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="orgIdentifier"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>معرف المنظمة</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-org-identifier" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="arabicName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم العربي *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-arabic-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="englishName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الإنكليزي</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-english-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="legalForm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الشكل القانوني *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-legal-form">
                                      <SelectValue placeholder="اختر الشكل القانوني" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {legalForms.map(form => (
                                      <SelectItem key={form} value={form}>{form}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* معلومات الإشهار */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">معلومات الإشهار</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="scope"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نطاق عمل المنظمة *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-scope">
                                      <SelectValue placeholder="اختر النطاق" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {scopeOptions.map(s => (
                                      <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="headquartersGovernorate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>المحافظة</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-headquarters-governorate">
                                      <SelectValue placeholder="اختر المحافظة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {governorates.map(gov => (
                                      <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="orgStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>حالة المنظمة</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-org-status">
                                      <SelectValue placeholder="اختر الحالة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {orgStatusOptions.map(s => (
                                      <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="publicationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم قرار الإشهار</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-publication-number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="publicationDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تاريخ قرار الإشهار</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-publication-date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                          <FormField
                            control={form.control}
                            name="hasPublicBenefit"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-public-benefit" />
                                </FormControl>
                                <FormLabel className="font-normal">تمتلك صفة النفع العام</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="hasInternalRegulations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-internal-regulations" />
                                </FormControl>
                                <FormLabel className="font-normal">نظام داخلي خاص بالموظفين</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="hasWomenPolicy"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-women-policy" />
                                </FormControl>
                                <FormLabel className="font-normal">نظام خاص بالنساء</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="hasVolunteerPolicy"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-volunteer-policy" />
                                </FormControl>
                                <FormLabel className="font-normal">نظام خاص بالتطوع</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="hasOrgStructure"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-org-structure" />
                                </FormControl>
                                <FormLabel className="font-normal">هيكل تنظيمي معتمد</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* نبذة عن المنظمة */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">نبذة عن المنظمة</h3>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  placeholder="اكتب نبذة تعريفية عن المنظمة وأهدافها ورسالتها..."
                                  minHeight="150px"
                                  data-testid="textarea-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* شعار المنظمة */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">شعار المنظمة</h3>
                        <FormField
                          control={form.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <LogoUploader
                                  value={field.value}
                                  onChange={field.onChange}
                                  label="شعار المنظمة"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* وثائق المنظمة */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">وثائق المنظمة</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="internalRegulationsDoc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>النظام الداخلي</FormLabel>
                                <FormControl>
                                  <DocumentUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="النظام الداخلي"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="publicationDecisionDoc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>قرار الإشهار</FormLabel>
                                <FormControl>
                                  <DocumentUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="قرار الإشهار"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="publicBenefitDoc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>وثيقة النفع العام</FormLabel>
                                <FormControl>
                                  <DocumentUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="وثيقة النفع العام"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2: معلومات التواصل */}
                  <AccordionItem value="section-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-2">
                      2. معلومات التواصل
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => contactMethodsArray.append({ type: "", value: "" })}
                          data-testid="button-add-contact"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة وسيلة تواصل
                        </Button>
                      </div>
                      {contactMethodsArray.fields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                          <FormField
                            control={form.control}
                            name={`contactMethods.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نوع وسيلة التواصل</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر النوع" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="موبايل">موبايل</SelectItem>
                                    <SelectItem value="واتساب">واتساب</SelectItem>
                                    <SelectItem value="بريد إلكتروني">بريد إلكتروني</SelectItem>
                                    <SelectItem value="هاتف أرضي">هاتف أرضي</SelectItem>
                                    <SelectItem value="فاكس">فاكس</SelectItem>
                                    <SelectItem value="موقع إلكتروني">موقع إلكتروني</SelectItem>
                                    <SelectItem value="فيسبوك">فيسبوك</SelectItem>
                                    <SelectItem value="أخرى">أخرى</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`contactMethods.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>القيمة</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => contactMethodsArray.remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 3: التصنيفات والخدمات */}
                  <AccordionItem value="section-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-3">
                      3. التصنيفات والخدمات
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* التصنيفات */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">التصنيفات</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => classificationsArray.append({ type: "", name: "" })}
                            data-testid="button-add-classification"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة تصنيف
                          </Button>
                        </div>
                        {classificationsArray.fields.map((field, index) => (
                          <div key={field.id} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                            <FormField
                              control={form.control}
                              name={`classifications.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>نوع التصنيف</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="اختر النوع" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="رئيسي">رئيسي</SelectItem>
                                      <SelectItem value="فرعي">فرعي</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`classifications.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>اسم التصنيف</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => classificationsArray.remove(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* الخدمات */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">خدمات المنظمة</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => servicesArray.append({ 
                              specialty: "", serviceType: "", targetGroup: "", 
                              governorate: "", serviceDescription: "", serviceTiming: "", availabilityStatus: "" 
                            })}
                            data-testid="button-add-service"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة خدمة
                          </Button>
                        </div>
                        {servicesArray.fields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`services.${index}.specialty`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>الاختصاص</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`services.${index}.serviceType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>نوع الخدمة</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`services.${index}.targetGroup`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>الفئة المستهدفة</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`services.${index}.governorate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>المحافظة</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="اختر المحافظة" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {governorates.map(g => (
                                          <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`services.${index}.serviceTiming`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>توقيت الخدمة</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`services.${index}.availabilityStatus`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>حالة توفر الخدمة</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="متوفرة">متوفرة</SelectItem>
                                        <SelectItem value="غير متوفرة">غير متوفرة</SelectItem>
                                        <SelectItem value="متوفرة جزئياً">متوفرة جزئياً</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name={`services.${index}.serviceDescription`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف الخدمة</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="resize-none" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => servicesArray.remove(index)}
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف الخدمة
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 4: المراكز الخدمية */}
                  <AccordionItem value="section-4" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-4">
                      4. المراكز الخدمية
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => serviceCentersArray.append({ 
                            name: "", centerType: "", licenseNumber: "", longitude: "", latitude: "",
                            detailedAddress: "", division: "", propertyArea: "", propertyNumber: "", licensedGovernorate: ""
                          })}
                          data-testid="button-add-service-center"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة مركز خدمي
                        </Button>
                      </div>
                      {serviceCentersArray.fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>اسم المركز</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.centerType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>نوع المركز</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.licenseNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>رقم قرار الترخيص</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.longitude`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>خط الطول</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.latitude`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>خط العرض</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.licensedGovernorate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>المحافظة المرخصة</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="اختر المحافظة" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {governorates.map(g => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.detailedAddress`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>العنوان التفصيلي</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.division`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>القسم</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.propertyArea`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>منطقة العقار</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`serviceCenters.${index}.propertyNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>رقم العقار</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => serviceCentersArray.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف المركز
                          </Button>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 5: الفروع والمكاتب */}
                  <AccordionItem value="section-5" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-5">
                      5. الفروع والمكاتب
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => branchesArray.append({ 
                            branchType: "", licensedGovernorate: "", address: "", propertyArea: "",
                            propertyNumber: "", propertyOccupied: false, longitude: "", latitude: "", offeredServices: ""
                          })}
                          data-testid="button-add-branch"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة فرع
                        </Button>
                      </div>
                      {branchesArray.fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`branches.${index}.branchType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>نوع الفرع</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="اختر النوع" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="فرع رئيسي">فرع رئيسي</SelectItem>
                                      <SelectItem value="مكتب فرعي">مكتب فرعي</SelectItem>
                                      <SelectItem value="مكتب تمثيلي">مكتب تمثيلي</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.licensedGovernorate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>المحافظة المرخصة</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="اختر المحافظة" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {governorates.map(g => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.address`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>العنوان</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.propertyArea`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>منطقة العقار</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.propertyNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>رقم العقار</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.propertyOccupied`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 pt-6">
                                  <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <FormLabel className="font-normal">تأكيد إشغال العقار</FormLabel>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.longitude`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>خط الطول</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`branches.${index}.latitude`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>خط العرض</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`branches.${index}.offeredServices`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الخدمات المقدمة</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="resize-none" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => branchesArray.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف الفرع
                          </Button>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 6: العلاقة مع الوزارة */}
                  <AccordionItem value="section-6" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-6">
                      6. العلاقة مع الوزارة
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-semibold text-foreground">البيانات المالية</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => financialDataArray.append({ year: "", closingBudget: "", budgetDocument: "" })}
                          data-testid="button-add-financial-data"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة سنة مالية
                        </Button>
                      </div>
                      {financialDataArray.fields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/30">
                          <FormField
                            control={form.control}
                            name={`financialData.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>السنة</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="مثال: 2024" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`financialData.${index}.closingBudget`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الميزانية الختامية</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`financialData.${index}.budgetDocument`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>وثيقة الميزانية</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="رابط الملف" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => financialDataArray.remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 7: الحسابات البنكية */}
                  <AccordionItem value="section-7" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-7">
                      7. الحسابات البنكية
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => bankAccountsArray.append({ bankName: "", branchName: "", accountNumber: "", isDonationAccount: false })}
                          data-testid="button-add-bank-account"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة حساب بنكي
                        </Button>
                      </div>
                      {bankAccountsArray.fields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/30">
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.bankName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم البنك</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.branchName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم فرع البنك</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.accountNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الحساب</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.isDonationAccount`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 pt-6">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="font-normal">حساب تبرعات</FormLabel>
                              </FormItem>
                            )}
                          />
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => bankAccountsArray.remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 8: البرامج والأنشطة */}
                  <AccordionItem value="section-8" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-8">
                      8. البرامج والأنشطة
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* البرامج */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">برامج المنظمة</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => programsArray.append({ name: "", targetGroups: "", services: "", goals: "" })}
                            data-testid="button-add-program"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة برنامج
                          </Button>
                        </div>
                        {programsArray.fields.map((field, index) => (
                          <div key={field.id} className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                            <FormField
                              control={form.control}
                              name={`programs.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>اسم البرنامج</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`programs.${index}.targetGroups`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الفئات المستهدفة</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`programs.${index}.services`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الخدمات</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`programs.${index}.goals`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الأهداف</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="md:col-span-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => programsArray.remove(index)}
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف البرنامج
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* الأنشطة */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">أنشطة المنظمة</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => activitiesArray.append({ name: "", activityType: "", goals: "", services: "", targetGroups: "" })}
                            data-testid="button-add-activity"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة نشاط
                          </Button>
                        </div>
                        {activitiesArray.fields.map((field, index) => (
                          <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                            <FormField
                              control={form.control}
                              name={`activities.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>اسم النشاط</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`activities.${index}.activityType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>نوع النشاط</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`activities.${index}.goals`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الأهداف</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`activities.${index}.services`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الخدمات</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`activities.${index}.targetGroups`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الفئات المستهدفة</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => activitiesArray.remove(index)}
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 9: الوضع الإداري والتنظيمي */}
                  <AccordionItem value="section-9" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-9">
                      9. الوضع الإداري والتنظيمي
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* الموظفون */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">الموظفون</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => employeesArray.append({ 
                              firstName: "", lastName: "", fatherName: "", motherName: "",
                              nationalId: "", contactNumber: "", gender: "", governorate: "",
                              birthDate: "", hasDisabilityCard: false, address: "", branch: "",
                              position: "", work: "", employmentStartDate: "", insuranceNumber: "",
                              employmentNumber: "", memberStatus: "", qualifications: ""
                            })}
                            data-testid="button-add-employee"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة موظف
                          </Button>
                        </div>
                        {employeesArray.fields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground">المعلومات الشخصية</h4>
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                              <FormField control={form.control} name={`employees.${index}.firstName`} render={({ field }) => (
                                <FormItem><FormLabel>الاسم الأول</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.lastName`} render={({ field }) => (
                                <FormItem><FormLabel>الكنية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.fatherName`} render={({ field }) => (
                                <FormItem><FormLabel>اسم الأب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.motherName`} render={({ field }) => (
                                <FormItem><FormLabel>اسم الأم</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.nationalId`} render={({ field }) => (
                                <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.contactNumber`} render={({ field }) => (
                                <FormItem><FormLabel>رقم التواصل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.gender`} render={({ field }) => (
                                <FormItem><FormLabel>الجنس</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                      <SelectItem value="ذكر">ذكر</SelectItem>
                                      <SelectItem value="أنثى">أنثى</SelectItem>
                                    </SelectContent>
                                  </Select>
                                <FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.birthDate`} render={({ field }) => (
                                <FormItem><FormLabel>تاريخ الميلاد</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                            <h4 className="font-medium text-sm text-muted-foreground pt-2">المعلومات الوظيفية</h4>
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                              <FormField control={form.control} name={`employees.${index}.position`} render={({ field }) => (
                                <FormItem><FormLabel>المنصب الوظيفي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.branch`} render={({ field }) => (
                                <FormItem><FormLabel>الفرع</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.employmentStartDate`} render={({ field }) => (
                                <FormItem><FormLabel>تاريخ بداية التوظيف</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`employees.${index}.qualifications`} render={({ field }) => (
                                <FormItem><FormLabel>المؤهلات العلمية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                            <Button type="button" variant="destructive" size="sm" onClick={() => employeesArray.remove(index)}>
                              <Trash2 className="w-4 h-4 ml-2" />حذف الموظف
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* المتطوعون */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">المتطوعون</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => volunteersArray.append({ 
                              firstName: "", lastName: "", fatherName: "", motherName: "",
                              nationalId: "", contactNumber: "", gender: "", governorate: "",
                              birthDate: "", hasDisabilityCard: false, address: "", branch: "",
                              position: "", work: "", startDate: "", insuranceNumber: "",
                              volunteerNumber: "", memberStatus: ""
                            })}
                            data-testid="button-add-volunteer"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة متطوع
                          </Button>
                        </div>
                        {volunteersArray.fields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                              <FormField control={form.control} name={`volunteers.${index}.firstName`} render={({ field }) => (
                                <FormItem><FormLabel>الاسم الأول</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`volunteers.${index}.lastName`} render={({ field }) => (
                                <FormItem><FormLabel>الكنية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`volunteers.${index}.position`} render={({ field }) => (
                                <FormItem><FormLabel>المنصب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`volunteers.${index}.contactNumber`} render={({ field }) => (
                                <FormItem><FormLabel>رقم التواصل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                            <Button type="button" variant="destructive" size="sm" onClick={() => volunteersArray.remove(index)}>
                              <Trash2 className="w-4 h-4 ml-2" />حذف المتطوع
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 10: الممتلكات */}
                  <AccordionItem value="section-10" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-10">
                      10. الممتلكات
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* الآليات */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">الآليات (المركبات)</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => vehiclesArray.append({ 
                              vehicleType: "", model: "", plateNumber: "", governorate: "",
                              serialNumber: "", chassisNumber: "", manufacturingYear: "",
                              fuelType: "", passengerCount: "", ownershipType: "", ownershipDocument: "", taxExempt: false
                            })}
                            data-testid="button-add-vehicle"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة مركبة
                          </Button>
                        </div>
                        {vehiclesArray.fields.map((field, index) => (
                          <div key={field.id} className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/30">
                            <FormField control={form.control} name={`vehicles.${index}.vehicleType`} render={({ field }) => (
                              <FormItem><FormLabel>نوع المركبة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`vehicles.${index}.model`} render={({ field }) => (
                              <FormItem><FormLabel>الطراز</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`vehicles.${index}.plateNumber`} render={({ field }) => (
                              <FormItem><FormLabel>رقم اللوحة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`vehicles.${index}.manufacturingYear`} render={({ field }) => (
                              <FormItem><FormLabel>سنة الصنع</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`vehicles.${index}.taxExempt`} render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 pt-6">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">معفاة من الضرائب</FormLabel>
                              </FormItem>
                            )} />
                            <div className="flex items-end">
                              <Button type="button" variant="destructive" size="sm" onClick={() => vehiclesArray.remove(index)}>
                                <Trash2 className="w-4 h-4 ml-2" />حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* العقارات */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="font-semibold text-foreground">العقارات</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => realEstateArray.append({ 
                              propertyNumber: "", propertyType: "", administrativeArea: "",
                              governorate: "", ownershipType: "", ownershipDocument: ""
                            })}
                            data-testid="button-add-real-estate"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة عقار
                          </Button>
                        </div>
                        {realEstateArray.fields.map((field, index) => (
                          <div key={field.id} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                            <FormField control={form.control} name={`realEstate.${index}.propertyNumber`} render={({ field }) => (
                              <FormItem><FormLabel>رقم العقار</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`realEstate.${index}.propertyType`} render={({ field }) => (
                              <FormItem><FormLabel>نوع العقار</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`realEstate.${index}.governorate`} render={({ field }) => (
                              <FormItem><FormLabel>المحافظة</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    {governorates.map(g => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`realEstate.${index}.ownershipType`} render={({ field }) => (
                              <FormItem><FormLabel>صيغة التملك</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="flex items-end">
                              <Button type="button" variant="destructive" size="sm" onClick={() => realEstateArray.remove(index)}>
                                <Trash2 className="w-4 h-4 ml-2" />حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 11: البيانات الاختيارية */}
                  <AccordionItem value="section-11" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline" data-testid="accordion-section-11">
                      11. البيانات الاختيارية
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* فرص العمل */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">فرص العمل</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => jobOpportunitiesArray.append({ workField: "", vacancyName: "", vacancyNumber: "", governorate: "", startDate: "", endDate: "", commitmentNature: "", jobPurpose: "", qualification: "", skills: "", experience: "", details: "" })} data-testid="button-add-job">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة فرصة عمل
                          </Button>
                        </div>
                        {jobOpportunitiesArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">فرصة عمل {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => jobOpportunitiesArray.remove(index)} data-testid={`button-remove-job-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`jobOpportunities.${index}.vacancyName`} render={({ field }) => (<FormItem><FormLabel>اسم الشاغر</FormLabel><FormControl><Input {...field} data-testid={`input-job-vacancyName-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.workField`} render={({ field }) => (<FormItem><FormLabel>مجال العمل</FormLabel><FormControl><Input {...field} data-testid={`input-job-workField-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.vacancyNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الشاغر</FormLabel><FormControl><Input {...field} data-testid={`input-job-vacancyNumber-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} data-testid={`input-job-governorate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ البدء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-job-startDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ الانتهاء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-job-endDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.commitmentNature`} render={({ field }) => (<FormItem><FormLabel>طبيعة الالتزام</FormLabel><FormControl><Input {...field} data-testid={`input-job-commitmentNature-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.jobPurpose`} render={({ field }) => (<FormItem><FormLabel>الغرض الوظيفي</FormLabel><FormControl><Input {...field} data-testid={`input-job-jobPurpose-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.qualification`} render={({ field }) => (<FormItem><FormLabel>المؤهلات</FormLabel><FormControl><Input {...field} data-testid={`input-job-qualification-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.skills`} render={({ field }) => (<FormItem><FormLabel>المهارات</FormLabel><FormControl><Input {...field} data-testid={`input-job-skills-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`jobOpportunities.${index}.experience`} render={({ field }) => (<FormItem><FormLabel>الخبرة</FormLabel><FormControl><Input {...field} data-testid={`input-job-experience-${index}`} /></FormControl></FormItem>)} />
                            </div>
                            <FormField control={form.control} name={`jobOpportunities.${index}.details`} render={({ field }) => (<FormItem className="col-span-full"><FormLabel>تفاصيل الوظيفة</FormLabel><FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="أدخل تفاصيل الوظيفة الكاملة هنا..." minHeight="150px" data-testid={`textarea-job-details-${index}`} /></FormControl></FormItem>)} />
                          </div>
                        ))}
                      </div>

                      {/* فرص التطوع */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">فرص التطوع</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => volunteerOpportunitiesArray.append({ workField: "", vacancyName: "", vacancyNumber: "", governorate: "", startDate: "", endDate: "", commitmentNature: "", volunteerPurpose: "", qualification: "", skills: "", experience: "" })} data-testid="button-add-volunteer">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة فرصة تطوع
                          </Button>
                        </div>
                        {volunteerOpportunitiesArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">فرصة تطوع {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => volunteerOpportunitiesArray.remove(index)} data-testid={`button-remove-volunteer-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.vacancyName`} render={({ field }) => (<FormItem><FormLabel>اسم الشاغر</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-vacancyName-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.workField`} render={({ field }) => (<FormItem><FormLabel>مجال العمل</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-workField-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.vacancyNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الشاغر</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-vacancyNumber-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-governorate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ البدء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-volunteer-startDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ الانتهاء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-volunteer-endDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.commitmentNature`} render={({ field }) => (<FormItem><FormLabel>طبيعة الالتزام</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-commitmentNature-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.volunteerPurpose`} render={({ field }) => (<FormItem><FormLabel>الغرض التطوعي</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-volunteerPurpose-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.qualification`} render={({ field }) => (<FormItem><FormLabel>المؤهلات</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-qualification-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.skills`} render={({ field }) => (<FormItem><FormLabel>المهارات</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-skills-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`volunteerOpportunities.${index}.experience`} render={({ field }) => (<FormItem><FormLabel>الخبرة</FormLabel><FormControl><Input {...field} data-testid={`input-volunteer-experience-${index}`} /></FormControl></FormItem>)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* الفعاليات */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">الفعاليات</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => eventsArray.append({ image: "", eventName: "", invitationType: "", eventType: "", startDate: "", endDate: "", announcementDate: "", announcementEndDate: "", startDescription: "", endDescription: "", address: "", details: "" })} data-testid="button-add-event">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة فعالية
                          </Button>
                        </div>
                        {eventsArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">فعالية {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => eventsArray.remove(index)} data-testid={`button-remove-event-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`events.${index}.eventName`} render={({ field }) => (<FormItem><FormLabel>اسم الفعالية</FormLabel><FormControl><Input {...field} data-testid={`input-event-eventName-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.eventType`} render={({ field }) => (<FormItem><FormLabel>نوع الفعالية</FormLabel><FormControl><Input {...field} data-testid={`input-event-eventType-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.invitationType`} render={({ field }) => (<FormItem><FormLabel>نوع الدعوة</FormLabel><FormControl><Input {...field} data-testid={`input-event-invitationType-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.address`} render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} data-testid={`input-event-address-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ البدء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-event-startDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ الانتهاء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-event-endDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`events.${index}.details`} render={({ field }) => (<FormItem className="md:col-span-3"><FormLabel>تفاصيل الفعالية</FormLabel><FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="تفاصيل الفعالية..." minHeight="120px" data-testid={`textarea-event-details-${index}`} /></FormControl></FormItem>)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* حملات التبرع */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">حملات التبرع</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => donationCampaignsArray.append({ image: "", campaignName: "", campaignType: "", targetGroups: "", startDate: "", endDate: "", governorate: "", details: "" })} data-testid="button-add-campaign">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة حملة
                          </Button>
                        </div>
                        {donationCampaignsArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">حملة {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => donationCampaignsArray.remove(index)} data-testid={`button-remove-campaign-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`donationCampaigns.${index}.campaignName`} render={({ field }) => (<FormItem><FormLabel>اسم الحملة</FormLabel><FormControl><Input {...field} data-testid={`input-campaign-campaignName-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.campaignType`} render={({ field }) => (<FormItem><FormLabel>نوع الحملة</FormLabel><FormControl><Input {...field} data-testid={`input-campaign-campaignType-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.targetGroups`} render={({ field }) => (<FormItem><FormLabel>الفئات المستهدفة</FormLabel><FormControl><Input {...field} data-testid={`input-campaign-targetGroups-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} data-testid={`input-campaign-governorate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ البدء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-campaign-startDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>تاريخ الانتهاء</FormLabel><FormControl><Input type="date" {...field} data-testid={`input-campaign-endDate-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`donationCampaigns.${index}.details`} render={({ field }) => (<FormItem className="md:col-span-3"><FormLabel>تفاصيل الحملة</FormLabel><FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="تفاصيل الحملة..." minHeight="120px" data-testid={`textarea-campaign-details-${index}`} /></FormControl></FormItem>)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* معرض الصور */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">معرض الصور</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => photoGalleryArray.append({ image: "", title: "", details: "" })} data-testid="button-add-photo">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة صورة
                          </Button>
                        </div>
                        {photoGalleryArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">صورة {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => photoGalleryArray.remove(index)} data-testid={`button-remove-photo-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="flex gap-4 items-start">
                              <FormField 
                                control={form.control} 
                                name={`photoGallery.${index}.image`} 
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <ImageUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                        size="md"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )} 
                              />
                              <div className="flex-1 grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`photoGallery.${index}.title`} render={({ field }) => (<FormItem><FormLabel>عنوان الصورة</FormLabel><FormControl><Input {...field} data-testid={`input-photo-title-${index}`} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name={`photoGallery.${index}.details`} render={({ field }) => (<FormItem><FormLabel>التفاصيل</FormLabel><FormControl><Input {...field} data-testid={`input-photo-details-${index}`} /></FormControl></FormItem>)} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* الإحصائيات */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">الإحصائيات</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => statisticsArray.append({ title: "", count: "", icon: "" })} data-testid="button-add-stat">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة إحصائية
                          </Button>
                        </div>
                        {statisticsArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">إحصائية {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => statisticsArray.remove(index)} data-testid={`button-remove-stat-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`statistics.${index}.title`} render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} data-testid={`input-stat-title-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`statistics.${index}.count`} render={({ field }) => (<FormItem><FormLabel>العدد</FormLabel><FormControl><Input {...field} data-testid={`input-stat-count-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`statistics.${index}.icon`} render={({ field }) => (<FormItem><FormLabel>الأيقونة</FormLabel><FormControl><Input {...field} data-testid={`input-stat-icon-${index}`} /></FormControl></FormItem>)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* التشبيك */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-semibold text-foreground">التشبيك</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => networkingArray.append({ needType: "", classification: "", need: "", description: "", count: "" })} data-testid="button-add-networking">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة احتياج
                          </Button>
                        </div>
                        {networkingArray.fields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary">احتياج {index + 1}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => networkingArray.remove(index)} data-testid={`button-remove-networking-${index}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <FormField control={form.control} name={`networking.${index}.needType`} render={({ field }) => (<FormItem><FormLabel>نوع الاحتياج</FormLabel><FormControl><Input {...field} data-testid={`input-networking-needType-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`networking.${index}.classification`} render={({ field }) => (<FormItem><FormLabel>التصنيف</FormLabel><FormControl><Input {...field} data-testid={`input-networking-classification-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`networking.${index}.need`} render={({ field }) => (<FormItem><FormLabel>الاحتياج</FormLabel><FormControl><Input {...field} data-testid={`input-networking-need-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`networking.${index}.count`} render={({ field }) => (<FormItem><FormLabel>العدد</FormLabel><FormControl><Input {...field} data-testid={`input-networking-count-${index}`} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name={`networking.${index}.description`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>الوصف</FormLabel><FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="وصف الاحتياج..." minHeight="100px" data-testid={`textarea-networking-description-${index}`} /></FormControl></FormItem>)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* إعدادات الدفع الإلكتروني */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">إدارة الدفع الإلكتروني</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="syriatelCashEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-syriatel" />
                                </FormControl>
                                <FormLabel className="font-normal">تفعيل Syriatel Cash</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mtnCashEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-mtn" />
                                </FormControl>
                                <FormLabel className="font-normal">تفعيل MTN Cash</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* إدارة واجهات الجمهور */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b pb-2">إدارة واجهات الجمهور</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="showJobOpportunities"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="font-normal">عرض فرص العمل</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="showVolunteerOpportunities"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="font-normal">عرض فرص التطوع</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="showEvents"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="font-normal">عرض الفعاليات</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="showDonationCampaigns"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-x-reverse space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="font-normal">عرض حملات التبرع</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Submit Button */}
                <div className="pt-6 border-t flex justify-end gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" type="button" data-testid="button-cancel">إلغاء</Button>
                  </Link>
                  <Button type="submit" className="min-w-[150px] shadow-lg shadow-primary/25" disabled={isPending} data-testid="button-submit">
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "تقديم الطلب"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
