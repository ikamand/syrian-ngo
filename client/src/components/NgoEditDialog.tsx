import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useEffect } from "react";
import type { Ngo } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LogoUploader } from "@/components/LogoUploader";
import { ImageUploader } from "@/components/ImageUploader";
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
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "إدلب", "الرقة", "دير الزور", "الحسكة", "درعا", "السويداء", "القنيطرة",
];

const legalForms = ["جمعية أهلية", "مؤسسة خاصة", "مؤسسة تنموية", "مؤسسة خيرية", "اتحاد جمعيات", "منظمة غير حكومية دولية", "منظمة مجتمع مدني"];
const scopeOptions = ["نطاق محلي", "نطاق محافظة", "نطاق محافظات", "نطاق وطني", "نطاق إقليمي", "نطاق دولي"];
const orgStatusOptions = ["فعالة", "معلقة", "منحلة", "قيد التأسيس"];

const formSchema = z.object({
  orgIdentifier: z.string().optional(),
  arabicName: z.string().min(1, "الاسم العربي مطلوب"),
  englishName: z.string().optional(),
  legalForm: z.string().min(1, "الشكل القانوني مطلوب"),
  scope: z.string().min(1, "نطاق العمل مطلوب"),
  orgStatus: z.string().optional(),
  publicationNumber: z.string().optional(),
  publicationDate: z.string().optional(),
  hasPublicBenefit: z.boolean().default(false),
  hasInternalRegulations: z.boolean().default(false),
  hasWomenPolicy: z.boolean().default(false),
  hasVolunteerPolicy: z.boolean().default(false),
  hasOrgStructure: z.boolean().default(false),
  internalRegulationsDoc: z.string().optional(),
  publicationDecisionDoc: z.string().optional(),
  publicBenefitDoc: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  name: z.string().optional(),
  city: z.string().optional(),
  presidentName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  classifications: z.array(z.object({ type: z.string(), name: z.string() })).optional(),
  services: z.array(z.object({
    specialty: z.string(), serviceType: z.string(), targetGroup: z.string(),
    governorate: z.string(), serviceDescription: z.string(), serviceTiming: z.string(), availabilityStatus: z.string(),
  })).optional(),
  serviceCenters: z.array(z.object({
    name: z.string(), centerType: z.string(), licenseNumber: z.string(),
    longitude: z.string(), latitude: z.string(), detailedAddress: z.string(),
    division: z.string(), propertyArea: z.string(), propertyNumber: z.string(), licensedGovernorate: z.string(),
  })).optional(),
  branches: z.array(z.object({
    branchType: z.string(), licensedGovernorate: z.string(), address: z.string(),
    propertyArea: z.string(), propertyNumber: z.string(), propertyOccupied: z.boolean(),
    longitude: z.string(), latitude: z.string(), offeredServices: z.string(),
  })).optional(),
  financialData: z.array(z.object({ year: z.string(), closingBudget: z.string(), budgetDocument: z.string() })).optional(),
  contactMethods: z.array(z.object({ type: z.string(), value: z.string() })).optional(),
  bankAccounts: z.array(z.object({
    bankName: z.string(), branchName: z.string(), accountNumber: z.string(), isDonationAccount: z.boolean(),
  })).optional(),
  programs: z.array(z.object({ name: z.string(), targetGroups: z.string(), services: z.string(), goals: z.string() })).optional(),
  activities: z.array(z.object({
    name: z.string(), activityType: z.string(), goals: z.string(), services: z.string(), targetGroups: z.string(),
  })).optional(),
  employees: z.array(z.object({
    firstName: z.string(), lastName: z.string(), fatherName: z.string(), motherName: z.string(),
    nationalId: z.string(), contactNumber: z.string(), gender: z.string(), governorate: z.string(),
    birthDate: z.string(), hasDisabilityCard: z.boolean(), address: z.string(), branch: z.string(),
    position: z.string(), work: z.string(), employmentStartDate: z.string(), insuranceNumber: z.string(),
    employmentNumber: z.string(), memberStatus: z.string(), qualifications: z.string(),
  })).optional(),
  volunteers: z.array(z.object({
    firstName: z.string(), lastName: z.string(), fatherName: z.string(), motherName: z.string(),
    nationalId: z.string(), contactNumber: z.string(), gender: z.string(), governorate: z.string(),
    birthDate: z.string(), hasDisabilityCard: z.boolean(), address: z.string(), branch: z.string(),
    position: z.string(), work: z.string(), startDate: z.string(), insuranceNumber: z.string(),
    volunteerNumber: z.string(), memberStatus: z.string(),
  })).optional(),
  vehicles: z.array(z.object({
    vehicleType: z.string(), model: z.string(), plateNumber: z.string(), governorate: z.string(),
    serialNumber: z.string(), chassisNumber: z.string(), manufacturingYear: z.string(), fuelType: z.string(),
    passengerCount: z.string(), ownershipType: z.string(), ownershipDocument: z.string(), taxExempt: z.boolean(),
  })).optional(),
  realEstate: z.array(z.object({
    propertyNumber: z.string(), propertyType: z.string(), administrativeArea: z.string(),
    governorate: z.string(), ownershipType: z.string(), ownershipDocument: z.string(),
  })).optional(),
  annualPlans: z.array(z.object({ plan: z.string(), tracking: z.string() })).optional(),
  unCooperation: z.array(z.object({
    basicInfo: z.string(), projectSector: z.string(), projectGoals: z.string(),
    governorates: z.string(), financialData: z.string(),
  })).optional(),
  meetingMinutes: z.array(z.object({
    meetingName: z.string(), meetingDate: z.string(), attendees: z.string(), minutesFile: z.string(),
  })).optional(),
  jobOpportunities: z.array(z.object({
    workField: z.string(), vacancyName: z.string(), vacancyNumber: z.string(), governorate: z.string(),
    startDate: z.string(), endDate: z.string(), commitmentNature: z.string(), jobPurpose: z.string(),
    qualification: z.string(), skills: z.string(), experience: z.string(), details: z.string(),
  })).optional(),
  volunteerOpportunities: z.array(z.object({
    workField: z.string(), vacancyName: z.string(), vacancyNumber: z.string(), governorate: z.string(),
    startDate: z.string(), endDate: z.string(), commitmentNature: z.string(), volunteerPurpose: z.string(),
    qualification: z.string(), skills: z.string(), experience: z.string(),
  })).optional(),
  statistics: z.array(z.object({ title: z.string(), count: z.string(), icon: z.string() })).optional(),
  events: z.array(z.object({
    image: z.string(), eventName: z.string(), invitationType: z.string(), eventType: z.string(),
    startDate: z.string(), endDate: z.string(), announcementDate: z.string(), announcementEndDate: z.string(),
    startDescription: z.string(), endDescription: z.string(), address: z.string(), details: z.string(),
  })).optional(),
  donationCampaigns: z.array(z.object({
    image: z.string(), campaignName: z.string(), campaignType: z.string(), targetGroups: z.string(),
    startDate: z.string(), endDate: z.string(), governorate: z.string(), details: z.string(),
  })).optional(),
  photoGallery: z.array(z.object({ image: z.string(), title: z.string(), details: z.string() })).optional(),
  networking: z.array(z.object({
    needType: z.string(), classification: z.string(), need: z.string(), description: z.string(), count: z.string(),
  })).optional(),
  syriatelCashEnabled: z.boolean().default(false),
  mtnCashEnabled: z.boolean().default(false),
  showJobOpportunities: z.boolean().default(false),
  showVolunteerOpportunities: z.boolean().default(false),
  showEvents: z.boolean().default(false),
  showDonationCampaigns: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface NgoEditDialogProps {
  ngo: Ngo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NgoEditDialog({ ngo, open, onOpenChange, onSuccess }: NgoEditDialogProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgIdentifier: "", arabicName: "", englishName: "", legalForm: "", scope: "",
      orgStatus: "", publicationNumber: "", publicationDate: "", hasPublicBenefit: false,
      hasInternalRegulations: false, hasWomenPolicy: false, hasVolunteerPolicy: false,
      hasOrgStructure: false, internalRegulationsDoc: "", publicationDecisionDoc: "",
      publicBenefitDoc: "", description: "", logo: "", name: "", city: "", presidentName: "",
      email: "", phone: "", classifications: [], services: [],
      serviceCenters: [], branches: [], financialData: [], contactMethods: [],
      bankAccounts: [], programs: [], activities: [], employees: [], volunteers: [],
      vehicles: [], realEstate: [], annualPlans: [], unCooperation: [], meetingMinutes: [],
      jobOpportunities: [], volunteerOpportunities: [], statistics: [], events: [],
      donationCampaigns: [], photoGallery: [], networking: [],
      syriatelCashEnabled: false, mtnCashEnabled: false,
      showJobOpportunities: false, showVolunteerOpportunities: false, showEvents: false,
      showDonationCampaigns: false,
    },
  });

  const classificationsArray = useFieldArray({ control: form.control, name: "classifications" });
  const servicesArray = useFieldArray({ control: form.control, name: "services" });
  const serviceCentersArray = useFieldArray({ control: form.control, name: "serviceCenters" });
  const branchesArray = useFieldArray({ control: form.control, name: "branches" });
  const financialDataArray = useFieldArray({ control: form.control, name: "financialData" });
  const contactMethodsArray = useFieldArray({ control: form.control, name: "contactMethods" });
  const bankAccountsArray = useFieldArray({ control: form.control, name: "bankAccounts" });
  const programsArray = useFieldArray({ control: form.control, name: "programs" });
  const activitiesArray = useFieldArray({ control: form.control, name: "activities" });
  const annualPlansArray = useFieldArray({ control: form.control, name: "annualPlans" });
  const unCooperationArray = useFieldArray({ control: form.control, name: "unCooperation" });
  const meetingMinutesArray = useFieldArray({ control: form.control, name: "meetingMinutes" });
  const employeesArray = useFieldArray({ control: form.control, name: "employees" });
  const volunteersArray = useFieldArray({ control: form.control, name: "volunteers" });
  const vehiclesArray = useFieldArray({ control: form.control, name: "vehicles" });
  const realEstateArray = useFieldArray({ control: form.control, name: "realEstate" });
  const jobOpportunitiesArray = useFieldArray({ control: form.control, name: "jobOpportunities" });
  const volunteerOpportunitiesArray = useFieldArray({ control: form.control, name: "volunteerOpportunities" });
  const eventsArray = useFieldArray({ control: form.control, name: "events" });
  const donationCampaignsArray = useFieldArray({ control: form.control, name: "donationCampaigns" });
  const photoGalleryArray = useFieldArray({ control: form.control, name: "photoGallery" });
  const networkingArray = useFieldArray({ control: form.control, name: "networking" });
  const statisticsArray = useFieldArray({ control: form.control, name: "statistics" });

  useEffect(() => {
    if (ngo && open) {
      form.reset({
        orgIdentifier: ngo.orgIdentifier || "",
        arabicName: ngo.arabicName || "",
        englishName: ngo.englishName || "",
        legalForm: ngo.legalForm || "",
        scope: ngo.scope || "",
        orgStatus: ngo.orgStatus || "",
        publicationNumber: ngo.publicationNumber || "",
        publicationDate: ngo.publicationDate || "",
        hasPublicBenefit: ngo.hasPublicBenefit || false,
        hasInternalRegulations: ngo.hasInternalRegulations || false,
        hasWomenPolicy: ngo.hasWomenPolicy || false,
        hasVolunteerPolicy: ngo.hasVolunteerPolicy || false,
        hasOrgStructure: ngo.hasOrgStructure || false,
        internalRegulationsDoc: ngo.internalRegulationsDoc || "",
        publicationDecisionDoc: ngo.publicationDecisionDoc || "",
        publicBenefitDoc: ngo.publicBenefitDoc || "",
        description: ngo.description || "",
        logo: ngo.logo || "",
        name: ngo.name || "",
        city: ngo.city || "",
        presidentName: ngo.presidentName || "",
        email: ngo.email || "",
        phone: ngo.phone || "",
        classifications: (ngo.classifications as any[]) || [],
        services: (ngo.services as any[]) || [],
        serviceCenters: (ngo.serviceCenters as any[]) || [],
        branches: (ngo.branches as any[]) || [],
        financialData: (ngo.financialData as any[]) || [],
        contactMethods: (ngo.contactMethods as any[]) || [],
        bankAccounts: (ngo.bankAccounts as any[]) || [],
        programs: (ngo.programs as any[]) || [],
        activities: (ngo.activities as any[]) || [],
        employees: (ngo.employees as any[]) || [],
        volunteers: (ngo.volunteers as any[]) || [],
        vehicles: (ngo.vehicles as any[]) || [],
        realEstate: (ngo.realEstate as any[]) || [],
        annualPlans: (ngo.annualPlans as any[]) || [],
        unCooperation: (ngo.unCooperation as any[]) || [],
        meetingMinutes: (ngo.meetingMinutes as any[]) || [],
        jobOpportunities: (ngo.jobOpportunities as any[]) || [],
        volunteerOpportunities: (ngo.volunteerOpportunities as any[]) || [],
        statistics: (ngo.statistics as any[]) || [],
        events: (ngo.events as any[]) || [],
        donationCampaigns: (ngo.donationCampaigns as any[]) || [],
        photoGallery: (ngo.photoGallery as any[]) || [],
        networking: (ngo.networking as any[]) || [],
        syriatelCashEnabled: ngo.syriatelCashEnabled || false,
        mtnCashEnabled: ngo.mtnCashEnabled || false,
        showJobOpportunities: ngo.showJobOpportunities || false,
        showVolunteerOpportunities: ngo.showVolunteerOpportunities || false,
        showEvents: ngo.showEvents || false,
        showDonationCampaigns: ngo.showDonationCampaigns || false,
      });
    }
  }, [ngo, open, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("PUT", `/api/ngos/${ngo?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ngos"] });
      toast({ title: "تم التحديث", description: "تم تحديث بيانات المنظمة بنجاح" });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء تحديث البيانات", variant: "destructive" });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  const handleFormError = () => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.error("Form validation errors:", errors);
      const errorMessages = Object.entries(errors)
        .map(([field, error]) => `${field}: ${(error as any)?.message || 'خطأ'}`)
        .join(', ');
      toast({ 
        title: "أخطاء في النموذج", 
        description: errorMessages || "يرجى التحقق من البيانات المدخلة", 
        variant: "destructive" 
      });
    }
  };

  if (!ngo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">تعديل بيانات المنظمة</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-4">
            <Accordion type="multiple" defaultValue={["section-1"]} className="w-full space-y-2">
              
              {/* Section 1: معلومات التأسيس */}
              <AccordionItem value="section-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-1">
                  1. معلومات التأسيس
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="orgIdentifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>معرف المنظمة</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-org-identifier" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="arabicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم العربي *</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-arabic-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="englishName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الإنكليزي</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-english-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="legalForm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الشكل القانوني *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger data-testid="edit-select-legal-form"><SelectValue placeholder="اختر الشكل القانوني" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {legalForms.map(form => <SelectItem key={form} value={form}>{form}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="scope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نطاق العمل *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger data-testid="edit-select-scope"><SelectValue placeholder="اختر نطاق العمل" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {scopeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="orgStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>حالة المنظمة</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger data-testid="edit-select-org-status"><SelectValue placeholder="اختر حالة المنظمة" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {orgStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="publicationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الإشهار</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-publication-number" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="publicationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ الإشهار</FormLabel>
                          <FormControl><Input type="date" {...field} data-testid="edit-input-publication-date" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField control={form.control} name="hasPublicBenefit"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="edit-checkbox-public-benefit" /></FormControl>
                          <FormLabel className="!mt-0">ذات نفع عام</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="hasInternalRegulations"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="edit-checkbox-internal-regulations" /></FormControl>
                          <FormLabel className="!mt-0">لديها نظام داخلي</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="hasWomenPolicy"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">لديها سياسة لحماية المرأة</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="hasVolunteerPolicy"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">لديها سياسة للمتطوعين</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="hasOrgStructure"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">لديها هيكل تنظيمي</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <FormField control={form.control} name="internalRegulationsDoc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وثيقة النظام الداخلي</FormLabel>
                          <FormControl><Input {...field} placeholder="رابط الملف" data-testid="edit-input-internal-regulations-doc" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="publicationDecisionDoc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وثيقة قرار الإشهار</FormLabel>
                          <FormControl><Input {...field} placeholder="رابط الملف" data-testid="edit-input-publication-decision-doc" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="publicBenefitDoc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وثيقة النفع العام</FormLabel>
                          <FormControl><Input {...field} placeholder="رابط الملف" data-testid="edit-input-public-benefit-doc" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField control={form.control} name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نبذة عن المنظمة</FormLabel>
                        <FormControl><Textarea {...field} rows={3} data-testid="edit-textarea-description" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="logo"
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
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: التصنيفات والخدمات */}
              <AccordionItem value="section-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-2">
                  2. التصنيفات والخدمات
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">التصنيفات</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => classificationsArray.append({ type: "", name: "" })}>
                        <Plus className="w-4 h-4 ml-1" /> إضافة تصنيف
                      </Button>
                    </div>
                    {classificationsArray.fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-3 gap-2 items-end border-b pb-2">
                        <FormField control={form.control} name={`classifications.${index}.type`}
                          render={({ field }) => (<FormItem><FormLabel>نوع التصنيف</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}
                        />
                        <FormField control={form.control} name={`classifications.${index}.name`}
                          render={({ field }) => (<FormItem><FormLabel>اسم التصنيف</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => classificationsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">الخدمات المقدمة</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => servicesArray.append({ specialty: "", serviceType: "", targetGroup: "", governorate: "", serviceDescription: "", serviceTiming: "", availabilityStatus: "" })}>
                        <Plus className="w-4 h-4 ml-1" /> إضافة خدمة
                      </Button>
                    </div>
                    {servicesArray.fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">خدمة {index + 1}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => servicesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <FormField control={form.control} name={`services.${index}.specialty`} render={({ field }) => (<FormItem><FormLabel>الاختصاص</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`services.${index}.serviceType`} render={({ field }) => (<FormItem><FormLabel>نوع الخدمة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`services.${index}.targetGroup`} render={({ field }) => (<FormItem><FormLabel>الفئة المستهدفة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`services.${index}.governorate`} render={({ field }) => (
                            <FormItem><FormLabel>المحافظة</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}><FormControl><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger></FormControl><SelectContent>{governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name={`services.${index}.serviceDescription`} render={({ field }) => (<FormItem><FormLabel>وصف الخدمة</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>)} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 3: المراكز الخدمية */}
              <AccordionItem value="section-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-3">
                  3. المراكز الخدمية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">المراكز الخدمية</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => serviceCentersArray.append({ name: "", centerType: "", licenseNumber: "", longitude: "", latitude: "", detailedAddress: "", division: "", propertyArea: "", propertyNumber: "", licensedGovernorate: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة مركز
                    </Button>
                  </div>
                  {serviceCentersArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">مركز {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => serviceCentersArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name={`serviceCenters.${index}.name`} render={({ field }) => (<FormItem><FormLabel>اسم المركز</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`serviceCenters.${index}.centerType`} render={({ field }) => (<FormItem><FormLabel>نوع المركز</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`serviceCenters.${index}.licenseNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الترخيص</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`serviceCenters.${index}.licensedGovernorate`} render={({ field }) => (
                          <FormItem><FormLabel>المحافظة</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}><FormControl><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger></FormControl><SelectContent>{governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name={`serviceCenters.${index}.detailedAddress`} render={({ field }) => (<FormItem><FormLabel>العنوان التفصيلي</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>)} />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 4: الفروع والمكاتب */}
              <AccordionItem value="section-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-4">
                  4. الفروع والمكاتب
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">الفروع</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => branchesArray.append({ branchType: "", licensedGovernorate: "", address: "", propertyArea: "", propertyNumber: "", propertyOccupied: false, longitude: "", latitude: "", offeredServices: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة فرع
                    </Button>
                  </div>
                  {branchesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">فرع {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => branchesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name={`branches.${index}.branchType`} render={({ field }) => (<FormItem><FormLabel>نوع الفرع</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`branches.${index}.licensedGovernorate`} render={({ field }) => (
                          <FormItem><FormLabel>المحافظة</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}><FormControl><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger></FormControl><SelectContent>{governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name={`branches.${index}.address`} render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`branches.${index}.offeredServices`} render={({ field }) => (<FormItem><FormLabel>الخدمات المقدمة</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>)} />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 5: معلومات التواصل */}
              <AccordionItem value="section-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-5">
                  5. معلومات التواصل
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">وسائل الاتصال</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => contactMethodsArray.append({ type: "", value: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة وسيلة اتصال
                    </Button>
                  </div>
                  {contactMethodsArray.fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-2 items-end border-b pb-2">
                      <FormField control={form.control} name={`contactMethods.${index}.type`} render={({ field }) => (
                        <FormItem><FormLabel>نوع وسيلة الاتصال</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="phone">هاتف</SelectItem>
                              <SelectItem value="mobile">موبايل</SelectItem>
                              <SelectItem value="email">بريد إلكتروني</SelectItem>
                              <SelectItem value="website">موقع إلكتروني</SelectItem>
                              <SelectItem value="facebook">فيسبوك</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`contactMethods.${index}.value`} render={({ field }) => (<FormItem><FormLabel>القيمة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => contactMethodsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 6: الحسابات البنكية */}
              <AccordionItem value="section-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-6">
                  6. الحسابات البنكية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">الحسابات البنكية</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => bankAccountsArray.append({ bankName: "", branchName: "", accountNumber: "", isDonationAccount: false })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة حساب
                    </Button>
                  </div>
                  {bankAccountsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">حساب {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => bankAccountsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name={`bankAccounts.${index}.bankName`} render={({ field }) => (<FormItem><FormLabel>اسم البنك</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`bankAccounts.${index}.branchName`} render={({ field }) => (<FormItem><FormLabel>اسم الفرع</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`bankAccounts.${index}.accountNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الحساب</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`bankAccounts.${index}.isDonationAccount`} render={({ field }) => (
                          <FormItem className="flex items-center gap-2 pt-6">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="!mt-0">حساب تبرعات</FormLabel>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 7: البرامج */}
              <AccordionItem value="section-7" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-7">
                  7. البرامج والأنشطة
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">البرامج</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => programsArray.append({ name: "", targetGroups: "", services: "", goals: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة برنامج
                    </Button>
                  </div>
                  {programsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">برنامج {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => programsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name={`programs.${index}.name`} render={({ field }) => (<FormItem><FormLabel>اسم البرنامج</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`programs.${index}.targetGroups`} render={({ field }) => (<FormItem><FormLabel>الفئات المستهدفة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`programs.${index}.goals`} render={({ field }) => (<FormItem><FormLabel>الأهداف</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>)} />
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">الأنشطة</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => activitiesArray.append({ name: "", activityType: "", goals: "", services: "", targetGroups: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة نشاط
                    </Button>
                  </div>
                  {activitiesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">نشاط {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => activitiesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`activities.${index}.name`} render={({ field }) => (<FormItem><FormLabel>اسم النشاط</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`activities.${index}.activityType`} render={({ field }) => (<FormItem><FormLabel>نوع النشاط</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`activities.${index}.targetGroups`} render={({ field }) => (<FormItem><FormLabel>الفئات المستهدفة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">البيانات المالية</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => financialDataArray.append({ year: "", closingBudget: "", budgetDocument: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة سنة مالية
                    </Button>
                  </div>
                  {financialDataArray.fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-4 gap-2 items-end border-b pb-2">
                      <FormField control={form.control} name={`financialData.${index}.year`} render={({ field }) => (<FormItem><FormLabel>السنة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`financialData.${index}.closingBudget`} render={({ field }) => (<FormItem><FormLabel>الميزانية الختامية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`financialData.${index}.budgetDocument`} render={({ field }) => (<FormItem><FormLabel>وثيقة الميزانية</FormLabel><FormControl><Input {...field} placeholder="رابط الملف" /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => financialDataArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 8: الموظفين والمتطوعين */}
              <AccordionItem value="section-8" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-8">
                  8. الموظفين والمتطوعين
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">الموظفين</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => employeesArray.append({ firstName: "", lastName: "", fatherName: "", motherName: "", nationalId: "", contactNumber: "", gender: "", governorate: "", birthDate: "", hasDisabilityCard: false, address: "", branch: "", position: "", work: "", employmentStartDate: "", insuranceNumber: "", employmentNumber: "", memberStatus: "", qualifications: "" })}>
                        <Plus className="w-4 h-4 ml-1" /> إضافة موظف
                      </Button>
                    </div>
                    {employeesArray.fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">موظف {index + 1}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => employeesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <FormField control={form.control} name={`employees.${index}.firstName`} render={({ field }) => (<FormItem><FormLabel>الاسم</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`employees.${index}.lastName`} render={({ field }) => (<FormItem><FormLabel>الكنية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`employees.${index}.fatherName`} render={({ field }) => (<FormItem><FormLabel>اسم الأب</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`employees.${index}.nationalId`} render={({ field }) => (<FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`employees.${index}.position`} render={({ field }) => (<FormItem><FormLabel>المنصب</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`employees.${index}.contactNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الاتصال</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">المتطوعين</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => volunteersArray.append({ firstName: "", lastName: "", fatherName: "", motherName: "", nationalId: "", contactNumber: "", gender: "", governorate: "", birthDate: "", hasDisabilityCard: false, address: "", branch: "", position: "", work: "", startDate: "", insuranceNumber: "", volunteerNumber: "", memberStatus: "" })}>
                        <Plus className="w-4 h-4 ml-1" /> إضافة متطوع
                      </Button>
                    </div>
                    {volunteersArray.fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">متطوع {index + 1}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => volunteersArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <FormField control={form.control} name={`volunteers.${index}.firstName`} render={({ field }) => (<FormItem><FormLabel>الاسم</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`volunteers.${index}.lastName`} render={({ field }) => (<FormItem><FormLabel>الكنية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`volunteers.${index}.fatherName`} render={({ field }) => (<FormItem><FormLabel>اسم الأب</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`volunteers.${index}.nationalId`} render={({ field }) => (<FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`volunteers.${index}.position`} render={({ field }) => (<FormItem><FormLabel>المنصب</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`volunteers.${index}.contactNumber`} render={({ field }) => (<FormItem><FormLabel>رقم الاتصال</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 9: الممتلكات */}
              <AccordionItem value="section-9" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-9">
                  9. الممتلكات
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">المركبات</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => vehiclesArray.append({ vehicleType: "", model: "", plateNumber: "", governorate: "", serialNumber: "", chassisNumber: "", manufacturingYear: "", fuelType: "", passengerCount: "", ownershipType: "", ownershipDocument: "", taxExempt: false })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة مركبة
                    </Button>
                  </div>
                  {vehiclesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">مركبة {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => vehiclesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`vehicles.${index}.vehicleType`} render={({ field }) => (<FormItem><FormLabel>نوع المركبة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`vehicles.${index}.model`} render={({ field }) => (<FormItem><FormLabel>الموديل</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`vehicles.${index}.plateNumber`} render={({ field }) => (<FormItem><FormLabel>رقم اللوحة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">العقارات</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => realEstateArray.append({ propertyNumber: "", propertyType: "", administrativeArea: "", governorate: "", ownershipType: "", ownershipDocument: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة عقار
                    </Button>
                  </div>
                  {realEstateArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">عقار {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => realEstateArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`realEstate.${index}.propertyNumber`} render={({ field }) => (<FormItem><FormLabel>رقم العقار</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`realEstate.${index}.propertyType`} render={({ field }) => (<FormItem><FormLabel>نوع العقار</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`realEstate.${index}.administrativeArea`} render={({ field }) => (<FormItem><FormLabel>المنطقة الإدارية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`realEstate.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`realEstate.${index}.ownershipType`} render={({ field }) => (<FormItem><FormLabel>نوع الملكية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`realEstate.${index}.ownershipDocument`} render={({ field }) => (<FormItem><FormLabel>وثيقة الملكية</FormLabel><FormControl><Input {...field} placeholder="رابط الملف" /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 10: إعدادات الدفع الإلكتروني */}
              <AccordionItem value="section-10" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-10">
                  10. إعدادات الدفع الإلكتروني
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <FormField control={form.control} name="syriatelCashEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">تفعيل سيريتل كاش</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="mtnCashEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">تفعيل MTN كاش</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 11: معلومات إضافية (Legacy) */}
              <AccordionItem value="section-11" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-11">
                  11. معلومات إضافية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المحافظة</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="presidentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رئيس المنظمة</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-president-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl><Input type="email" {...field} data-testid="edit-input-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl><Input {...field} data-testid="edit-input-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 12: البيانات الاختيارية */}
              <AccordionItem value="section-12" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-12">
                  12. البيانات الاختيارية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">فرص العمل</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => jobOpportunitiesArray.append({ workField: "", vacancyName: "", vacancyNumber: "", governorate: "", startDate: "", endDate: "", commitmentNature: "", jobPurpose: "", qualification: "", skills: "", experience: "", details: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة فرصة
                    </Button>
                  </div>
                  {jobOpportunitiesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">فرصة عمل {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => jobOpportunitiesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`jobOpportunities.${index}.vacancyName`} render={({ field }) => (<FormItem><FormLabel>اسم الشاغر</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`jobOpportunities.${index}.workField`} render={({ field }) => (<FormItem><FormLabel>مجال العمل</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`jobOpportunities.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`jobOpportunities.${index}.details`} render={({ field }) => (<FormItem><FormLabel>تفاصيل الوظيفة</FormLabel><FormControl><Textarea {...field} rows={6} placeholder="أدخل تفاصيل الوظيفة الكاملة هنا..." /></FormControl></FormItem>)} />
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">فرص التطوع</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => volunteerOpportunitiesArray.append({ workField: "", vacancyName: "", vacancyNumber: "", governorate: "", startDate: "", endDate: "", commitmentNature: "", volunteerPurpose: "", qualification: "", skills: "", experience: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة فرصة
                    </Button>
                  </div>
                  {volunteerOpportunitiesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">فرصة تطوع {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => volunteerOpportunitiesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`volunteerOpportunities.${index}.vacancyName`} render={({ field }) => (<FormItem><FormLabel>اسم الشاغر</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`volunteerOpportunities.${index}.workField`} render={({ field }) => (<FormItem><FormLabel>مجال العمل</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`volunteerOpportunities.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">الفعاليات</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => eventsArray.append({ image: "", eventName: "", invitationType: "", eventType: "", startDate: "", endDate: "", announcementDate: "", announcementEndDate: "", startDescription: "", endDescription: "", address: "", details: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة فعالية
                    </Button>
                  </div>
                  {eventsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">فعالية {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => eventsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`events.${index}.eventName`} render={({ field }) => (<FormItem><FormLabel>اسم الفعالية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`events.${index}.eventType`} render={({ field }) => (<FormItem><FormLabel>نوع الفعالية</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`events.${index}.address`} render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">حملات التبرع</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => donationCampaignsArray.append({ image: "", campaignName: "", campaignType: "", targetGroups: "", startDate: "", endDate: "", governorate: "", details: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة حملة
                    </Button>
                  </div>
                  {donationCampaignsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">حملة {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => donationCampaignsArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name={`donationCampaigns.${index}.campaignName`} render={({ field }) => (<FormItem><FormLabel>اسم الحملة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`donationCampaigns.${index}.campaignType`} render={({ field }) => (<FormItem><FormLabel>نوع الحملة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`donationCampaigns.${index}.governorate`} render={({ field }) => (<FormItem><FormLabel>المحافظة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">الخطط السنوية</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => annualPlansArray.append({ plan: "", tracking: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة خطة
                    </Button>
                  </div>
                  {annualPlansArray.fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-2 items-end border-b pb-2">
                      <FormField control={form.control} name={`annualPlans.${index}.plan`} render={({ field }) => (<FormItem><FormLabel>الخطة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`annualPlans.${index}.tracking`} render={({ field }) => (<FormItem><FormLabel>المتابعة</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => annualPlansArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">محاضر الاجتماعات</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => meetingMinutesArray.append({ meetingName: "", meetingDate: "", attendees: "", minutesFile: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة محضر
                    </Button>
                  </div>
                  {meetingMinutesArray.fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-5 gap-2 items-end border-b pb-2">
                      <FormField control={form.control} name={`meetingMinutes.${index}.meetingName`} render={({ field }) => (<FormItem><FormLabel>اسم الاجتماع</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`meetingMinutes.${index}.meetingDate`} render={({ field }) => (<FormItem><FormLabel>التاريخ</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`meetingMinutes.${index}.attendees`} render={({ field }) => (<FormItem><FormLabel>الحضور</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`meetingMinutes.${index}.minutesFile`} render={({ field }) => (<FormItem><FormLabel>ملف المحضر</FormLabel><FormControl><Input {...field} placeholder="رابط الملف" /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => meetingMinutesArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6">
                    <h4 className="font-medium">معرض الصور</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => photoGalleryArray.append({ image: "", title: "", details: "" })}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة صورة
                    </Button>
                  </div>
                  {photoGalleryArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">صورة {index + 1}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => photoGalleryArray.remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="flex gap-3 items-start">
                        <FormField control={form.control} name={`photoGallery.${index}.image`} render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ImageUploader value={field.value} onChange={field.onChange} size="sm" />
                            </FormControl>
                          </FormItem>
                        )} />
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <FormField control={form.control} name={`photoGallery.${index}.title`} render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name={`photoGallery.${index}.details`} render={({ field }) => (<FormItem><FormLabel>التفاصيل</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Section 13: إعدادات العرض */}
              <AccordionItem value="section-13" className="border rounded-lg px-4">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="edit-accordion-section-13">
                  13. إعدادات العرض
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <FormField control={form.control} name="showJobOpportunities"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">عرض فرص العمل</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="showVolunteerOpportunities"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">عرض فرص التطوع</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="showEvents"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">عرض الفعاليات</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="showDonationCampaigns"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">عرض حملات التبرع</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit">
                إلغاء
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-edit">
                {updateMutation.isPending ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
