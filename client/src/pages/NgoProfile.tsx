import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Loader2, ArrowRight, Building2, MapPin, Phone, Mail, Globe, Check, X, Calendar, Briefcase, Users, Car, Home, DollarSign, FileText, Target, Award, Building, Landmark, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Ngo } from "@shared/schema";
import { sanitizeHtml } from "@/lib/sanitize";
import { useAuth } from "@/hooks/use-auth";

export default function NgoProfile() {
  const [match, params] = useRoute("/ngos/:id");
  const ngoId = params?.id;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: ngo, isLoading, error } = useQuery<Ngo>({
    queryKey: ['/api/ngos/public', ngoId],
    queryFn: async () => {
      const res = await fetch(`/api/ngos/public/${ngoId}`);
      if (!res.ok) throw new Error("Failed to fetch NGO");
      return res.json();
    },
    enabled: !!ngoId,
  });

  const getFieldValue = (value: string | null | undefined, fallback: string = "غير محدد") => {
    return value && value.trim() ? value : fallback;
  };

  const hasData = (arr: any[] | null | undefined) => arr && Array.isArray(arr) && arr.length > 0;

  const BooleanBadge = ({ value }: { value: boolean | null | undefined }) => (
    value ? (
      <Badge variant="default" className="bg-green-100 text-green-700 no-default-hover-elevate">
        <Check className="w-3 h-3 ml-1" />
        نعم
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600 no-default-hover-elevate">
        <X className="w-3 h-3 ml-1" />
        لا
      </Badge>
    )
  );

  if (!match) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/ngos">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground" data-testid="button-back-ngos">
            <ArrowRight className="w-4 h-4" />
            العودة لدليل المنظمات
          </Button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error || !ngo ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">المنظمة غير موجودة</h2>
            <p className="text-muted-foreground">لم يتم العثور على المنظمة المطلوبة</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-primary/10 mb-6">
              <CardHeader className="border-b bg-white rounded-t-xl pb-6">
                <div className="flex items-start gap-6">
                  {ngo.logo ? (
                    <img 
                      src={ngo.logo} 
                      alt={ngo.arabicName || "Logo"} 
                      className="w-24 h-24 object-contain border rounded-xl bg-white shadow-sm"
                      data-testid="img-ngo-profile-logo"
                    />
                  ) : (
                    <div className="w-24 h-24 border rounded-xl bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-primary mb-2" data-testid="text-ngo-name">
                      {ngo.arabicName || ngo.name || "غير محدد"}
                    </CardTitle>
                    {ngo.englishName && (
                      <p className="text-muted-foreground mb-3" data-testid="text-ngo-english-name">{ngo.englishName}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {ngo.legalForm && (
                        <Badge variant="outline">{ngo.legalForm}</Badge>
                      )}
                      {ngo.scope && (
                        <Badge variant="secondary">{ngo.scope}</Badge>
                      )}
                      {ngo.headquartersGovernorate && (
                        <Badge variant="outline" data-testid="text-headquarters-governorate">{ngo.headquartersGovernorate}</Badge>
                      )}
                      {ngo.orgStatus && (
                        <Badge className={`no-default-hover-elevate ${
                          ngo.orgStatus === "فعالة" ? "bg-green-100 text-green-700" :
                          ngo.orgStatus === "معلقة" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{ngo.orgStatus}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {ngo.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">نبذة عن المنظمة</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(ngo.description) }} />
                    </div>
                  </div>
                )}

                <Accordion type="multiple" defaultValue={["basic-info", "contact"]} className="w-full space-y-3">
                  {/* Basic Info Section */}
                  <AccordionItem value="basic-info" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-basic-info">
                      <span className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        المعلومات الأساسية
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="معرف المنظمة" value={getFieldValue(ngo.orgIdentifier)} />
                        <InfoItem label="رقم قرار الإشهار" value={getFieldValue(ngo.publicationNumber)} />
                        <InfoItem label="تاريخ قرار الإشهار" value={getFieldValue(ngo.publicationDate)} icon={<Calendar className="w-4 h-4" />} />
                        <InfoItem label="المدينة" value={getFieldValue(ngo.city)} icon={<MapPin className="w-4 h-4" />} />
                        {ngo.presidentName && <InfoItem label="رئيس المنظمة" value={ngo.presidentName} />}
                        {ngo.email && <InfoItem label="البريد الإلكتروني" value={ngo.email} icon={<Mail className="w-4 h-4" />} />}
                        {ngo.phone && <InfoItem label="الهاتف" value={ngo.phone} icon={<Phone className="w-4 h-4" />} />}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">صفة النفع العام:</span>
                          <BooleanBadge value={ngo.hasPublicBenefit} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">نظام داخلي:</span>
                          <BooleanBadge value={ngo.hasInternalRegulations} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">نظام نساء:</span>
                          <BooleanBadge value={ngo.hasWomenPolicy} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">نظام تطوع:</span>
                          <BooleanBadge value={ngo.hasVolunteerPolicy} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">هيكل تنظيمي:</span>
                          <BooleanBadge value={ngo.hasOrgStructure} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Documents Section */}
                  {(ngo.internalRegulationsDoc || ngo.publicationDecisionDoc || ngo.publicBenefitDoc) && (
                    <AccordionItem value="documents" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-documents">
                        <span className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          الوثائق
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ngo.internalRegulationsDoc && (
                            <a 
                              href={ngo.internalRegulationsDoc} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-sm"
                              data-testid="link-internal-regulations-doc"
                            >
                              <FileText className="w-4 h-4 text-primary" />
                              <span>النظام الداخلي</span>
                            </a>
                          )}
                          {ngo.publicationDecisionDoc && (
                            <a 
                              href={ngo.publicationDecisionDoc} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-sm"
                              data-testid="link-publication-decision-doc"
                            >
                              <FileText className="w-4 h-4 text-primary" />
                              <span>قرار الإشهار</span>
                            </a>
                          )}
                          {ngo.publicBenefitDoc && (
                            <a 
                              href={ngo.publicBenefitDoc} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-sm"
                              data-testid="link-public-benefit-doc"
                            >
                              <FileText className="w-4 h-4 text-primary" />
                              <span>صفة النفع العام</span>
                            </a>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Contact Methods Section */}
                  {hasData(ngo.contactMethods as any[]) && (
                    <AccordionItem value="contact" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-contact">
                        <span className="flex items-center gap-2">
                          <Phone className="w-5 h-5" />
                          معلومات التواصل
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(ngo.contactMethods as any[]).map((method, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              {method.type === "هاتف" || method.type === "جوال" ? (
                                <Phone className="w-4 h-4 text-muted-foreground" />
                              ) : method.type === "بريد إلكتروني" ? (
                                <Mail className="w-4 h-4 text-muted-foreground" />
                              ) : method.type === "موقع إلكتروني" ? (
                                <Globe className="w-4 h-4 text-muted-foreground" />
                              ) : null}
                              <span className="text-sm font-medium">{method.type}:</span>
                              <span className="text-sm">{method.value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Classifications Section */}
                  {hasData(ngo.classifications as any[]) && (
                    <AccordionItem value="classifications" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-classifications">
                        <span className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          التصنيفات
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="flex flex-wrap gap-2">
                          {(ngo.classifications as any[]).map((c, i) => (
                            <Badge key={i} variant="outline">{c.type}: {c.name}</Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Services Section */}
                  {hasData(ngo.services as any[]) && (
                    <AccordionItem value="services" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-services">
                        <span className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          الخدمات المقدمة
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.services as any[]).map((service, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-1">{service.serviceType}</div>
                            {service.serviceDescription && <div className="text-sm text-muted-foreground mb-2">{service.serviceDescription}</div>}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {service.specialty && <div><span className="text-muted-foreground">التخصص:</span> {service.specialty}</div>}
                              {service.targetGroup && <div><span className="text-muted-foreground">الفئة المستهدفة:</span> {service.targetGroup}</div>}
                              {service.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {service.governorate}</div>}
                              {service.serviceTiming && <div><span className="text-muted-foreground">توقيت الخدمة:</span> {service.serviceTiming}</div>}
                              {service.availabilityStatus && <div><span className="text-muted-foreground">حالة التوفر:</span> {service.availabilityStatus}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Service Centers Section */}
                  {hasData(ngo.serviceCenters as any[]) && (
                    <AccordionItem value="service-centers" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-service-centers">
                        <span className="flex items-center gap-2">
                          <Building className="w-5 h-5" />
                          المراكز الخدمية
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.serviceCenters as any[]).map((center, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{center.name}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {center.centerType && <div><span className="text-muted-foreground">النوع:</span> {center.centerType}</div>}
                              {center.licenseNumber && <div><span className="text-muted-foreground">رقم الترخيص:</span> {center.licenseNumber}</div>}
                              {center.licensedGovernorate && <div><span className="text-muted-foreground">المحافظة:</span> {center.licensedGovernorate}</div>}
                              {center.detailedAddress && <div className="col-span-2"><span className="text-muted-foreground">العنوان:</span> {center.detailedAddress}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Branches Section */}
                  {hasData(ngo.branches as any[]) && (
                    <AccordionItem value="branches" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-branches">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          الفروع والمكاتب
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.branches as any[]).map((branch, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{branch.branchType}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {branch.licensedGovernorate && <div><span className="text-muted-foreground">المحافظة:</span> {branch.licensedGovernorate}</div>}
                              {branch.address && <div><span className="text-muted-foreground">العنوان:</span> {branch.address}</div>}
                              {branch.offeredServices && <div className="col-span-2"><span className="text-muted-foreground">الخدمات:</span> {branch.offeredServices}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Programs Section */}
                  {hasData(ngo.programs as any[]) && (
                    <AccordionItem value="programs" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-programs">
                        <span className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          البرامج
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.programs as any[]).map((program, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{program.name}</div>
                            <div className="space-y-1 text-sm">
                              {program.goals && <div><span className="text-muted-foreground">الأهداف:</span> {program.goals}</div>}
                              {program.targetGroups && <div><span className="text-muted-foreground">الفئات المستهدفة:</span> {program.targetGroups}</div>}
                              {program.services && <div><span className="text-muted-foreground">الخدمات:</span> {program.services}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Activities Section */}
                  {hasData(ngo.activities as any[]) && (
                    <AccordionItem value="activities" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-activities">
                        <span className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          الأنشطة
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.activities as any[]).map((activity, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{activity.name}</div>
                            <div className="space-y-1 text-sm">
                              {activity.activityType && <div><span className="text-muted-foreground">النوع:</span> {activity.activityType}</div>}
                              {activity.goals && <div><span className="text-muted-foreground">الأهداف:</span> {activity.goals}</div>}
                              {activity.services && <div><span className="text-muted-foreground">الخدمات:</span> {activity.services}</div>}
                              {activity.targetGroups && <div><span className="text-muted-foreground">الفئات المستهدفة:</span> {activity.targetGroups}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Job Opportunities Section (only if showJobOpportunities is true) */}
                  {ngo.showJobOpportunities && hasData(ngo.jobOpportunities as any[]) && (
                    <AccordionItem value="job-opportunities" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-job-opportunities">
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          فرص العمل
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.jobOpportunities as any[]).map((job, i) => (
                          <div key={i} className="p-4 bg-muted/30 rounded-lg" data-testid={`job-opportunity-${i}`}>
                            <div className="font-medium text-lg mb-2">{job.vacancyName}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {job.workField && <div><span className="text-muted-foreground">مجال العمل:</span> {job.workField}</div>}
                              {job.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {job.governorate}</div>}
                              {job.vacancyNumber && <div><span className="text-muted-foreground">عدد الشواغر:</span> {job.vacancyNumber}</div>}
                              {job.commitmentNature && <div><span className="text-muted-foreground">طبيعة الالتزام:</span> {job.commitmentNature}</div>}
                              {job.startDate && <div><span className="text-muted-foreground">تاريخ البدء:</span> {job.startDate}</div>}
                              {job.endDate && <div><span className="text-muted-foreground">تاريخ الانتهاء:</span> {job.endDate}</div>}
                              {job.qualification && <div className="col-span-2"><span className="text-muted-foreground">المؤهلات:</span> {job.qualification}</div>}
                              {job.skills && <div className="col-span-2"><span className="text-muted-foreground">المهارات:</span> {job.skills}</div>}
                              {job.experience && <div className="col-span-2"><span className="text-muted-foreground">الخبرة:</span> {job.experience}</div>}
                              {job.jobPurpose && <div className="col-span-2"><span className="text-muted-foreground">الهدف من الوظيفة:</span> {job.jobPurpose}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Volunteer Opportunities Section (only if showVolunteerOpportunities is true) */}
                  {ngo.showVolunteerOpportunities && hasData(ngo.volunteerOpportunities as any[]) && (
                    <AccordionItem value="volunteer-opportunities" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-volunteer-opportunities">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          فرص التطوع
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.volunteerOpportunities as any[]).map((vol, i) => (
                          <div key={i} className="p-4 bg-muted/30 rounded-lg" data-testid={`volunteer-opportunity-${i}`}>
                            <div className="font-medium text-lg mb-2">{vol.vacancyName}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {vol.workField && <div><span className="text-muted-foreground">مجال العمل:</span> {vol.workField}</div>}
                              {vol.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {vol.governorate}</div>}
                              {vol.vacancyNumber && <div><span className="text-muted-foreground">عدد الشواغر:</span> {vol.vacancyNumber}</div>}
                              {vol.commitmentNature && <div><span className="text-muted-foreground">طبيعة الالتزام:</span> {vol.commitmentNature}</div>}
                              {vol.startDate && <div><span className="text-muted-foreground">تاريخ البدء:</span> {vol.startDate}</div>}
                              {vol.endDate && <div><span className="text-muted-foreground">تاريخ الانتهاء:</span> {vol.endDate}</div>}
                              {vol.qualification && <div className="col-span-2"><span className="text-muted-foreground">المؤهلات:</span> {vol.qualification}</div>}
                              {vol.skills && <div className="col-span-2"><span className="text-muted-foreground">المهارات:</span> {vol.skills}</div>}
                              {vol.experience && <div className="col-span-2"><span className="text-muted-foreground">الخبرة:</span> {vol.experience}</div>}
                              {vol.volunteerPurpose && <div className="col-span-2"><span className="text-muted-foreground">الهدف من التطوع:</span> {vol.volunteerPurpose}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Employees Section */}
                  {isAdmin && hasData(ngo.employees as any[]) && (
                    <AccordionItem value="employees" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-employees">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          الموظفون ({(ngo.employees as any[]).length})
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.employees as any[]).map((emp, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="font-medium mb-2">{emp.firstName} {emp.lastName}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {emp.position && <div><span className="text-muted-foreground">المنصب:</span> {emp.position}</div>}
                              {emp.work && <div><span className="text-muted-foreground">العمل:</span> {emp.work}</div>}
                              {emp.branch && <div><span className="text-muted-foreground">الفرع:</span> {emp.branch}</div>}
                              {emp.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {emp.governorate}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Volunteers Section */}
                  {isAdmin && hasData(ngo.volunteers as any[]) && (
                    <AccordionItem value="volunteers" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-volunteers">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          المتطوعون ({(ngo.volunteers as any[]).length})
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.volunteers as any[]).map((vol, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="font-medium mb-2">{vol.firstName} {vol.lastName}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {vol.position && <div><span className="text-muted-foreground">المنصب:</span> {vol.position}</div>}
                              {vol.work && <div><span className="text-muted-foreground">العمل:</span> {vol.work}</div>}
                              {vol.branch && <div><span className="text-muted-foreground">الفرع:</span> {vol.branch}</div>}
                              {vol.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {vol.governorate}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Bank Accounts Section */}
                  {isAdmin && hasData(ngo.bankAccounts as any[]) && (
                    <AccordionItem value="bank-accounts" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-bank-accounts">
                        <span className="flex items-center gap-2">
                          <Landmark className="w-5 h-5" />
                          الحسابات البنكية
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.bankAccounts as any[]).map((account, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {account.bankName && <div><span className="text-muted-foreground">البنك:</span> {account.bankName}</div>}
                              {account.branchName && <div><span className="text-muted-foreground">الفرع:</span> {account.branchName}</div>}
                              {account.accountNumber && <div><span className="text-muted-foreground">رقم الحساب:</span> {account.accountNumber}</div>}
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">حساب تبرعات:</span>
                                <BooleanBadge value={account.isDonationAccount} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Vehicles Section */}
                  {isAdmin && hasData(ngo.vehicles as any[]) && (
                    <AccordionItem value="vehicles" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-vehicles">
                        <span className="flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          المركبات
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.vehicles as any[]).map((vehicle, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="font-medium mb-2">{vehicle.vehicleType} - {vehicle.model}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {vehicle.plateNumber && <div><span className="text-muted-foreground">رقم اللوحة:</span> {vehicle.plateNumber}</div>}
                              {vehicle.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {vehicle.governorate}</div>}
                              {vehicle.manufacturingYear && <div><span className="text-muted-foreground">سنة الصنع:</span> {vehicle.manufacturingYear}</div>}
                              {vehicle.fuelType && <div><span className="text-muted-foreground">نوع الوقود:</span> {vehicle.fuelType}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Real Estate Section */}
                  {isAdmin && hasData(ngo.realEstate as any[]) && (
                    <AccordionItem value="real-estate" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-real-estate">
                        <span className="flex items-center gap-2">
                          <Home className="w-5 h-5" />
                          العقارات
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.realEstate as any[]).map((property, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {property.propertyType && <div><span className="text-muted-foreground">نوع العقار:</span> {property.propertyType}</div>}
                              {property.propertyNumber && <div><span className="text-muted-foreground">رقم العقار:</span> {property.propertyNumber}</div>}
                              {property.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {property.governorate}</div>}
                              {property.administrativeArea && <div><span className="text-muted-foreground">المنطقة الإدارية:</span> {property.administrativeArea}</div>}
                              {property.ownershipType && <div><span className="text-muted-foreground">نوع الملكية:</span> {property.ownershipType}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Financial Data Section */}
                  {isAdmin && hasData(ngo.financialData as any[]) && (
                    <AccordionItem value="financial-data" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-financial-data">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          البيانات المالية
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.financialData as any[]).map((data, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {data.year && <div><span className="text-muted-foreground">السنة:</span> {data.year}</div>}
                              {data.closingBudget && <div><span className="text-muted-foreground">الميزانية الختامية:</span> {data.closingBudget}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Annual Plans Section */}
                  {isAdmin && hasData(ngo.annualPlans as any[]) && (
                    <AccordionItem value="annual-plans" className="border rounded-lg px-4 bg-muted/10">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-annual-plans">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          الخطط السنوية
                          <Badge variant="outline" className="mr-auto border-primary/20 text-primary flex gap-1 items-center">
                            <Lock className="w-3 h-3" />
                            للمسؤولين فقط
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.annualPlans as any[]).map((plan, i) => (
                          <div key={i} className="p-3 bg-white/50 border rounded-lg">
                            <div className="space-y-2 text-sm">
                              {plan.plan && <div><span className="text-muted-foreground">الخطة:</span> {plan.plan}</div>}
                              {plan.tracking && <div><span className="text-muted-foreground">المتابعة:</span> {plan.tracking}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* UN Cooperation Section */}
                  {hasData(ngo.unCooperation as any[]) && (
                    <AccordionItem value="un-cooperation" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-un-cooperation">
                        <span className="flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          التعاون مع الأمم المتحدة
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.unCooperation as any[]).map((coop, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="space-y-2 text-sm">
                              {coop.basicInfo && <div><span className="text-muted-foreground">المعلومات الأساسية:</span> {coop.basicInfo}</div>}
                              {coop.projectSector && <div><span className="text-muted-foreground">قطاع المشروع:</span> {coop.projectSector}</div>}
                              {coop.projectGoals && <div><span className="text-muted-foreground">أهداف المشروع:</span> {coop.projectGoals}</div>}
                              {coop.governorates && <div><span className="text-muted-foreground">المحافظات:</span> {coop.governorates}</div>}
                              {coop.financialData && <div><span className="text-muted-foreground">البيانات المالية:</span> {coop.financialData}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Meeting Minutes Section */}
                  {hasData(ngo.meetingMinutes as any[]) && (
                    <AccordionItem value="meeting-minutes" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-meeting-minutes">
                        <span className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          محاضر الاجتماعات
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.meetingMinutes as any[]).map((meeting, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{meeting.meetingName}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {meeting.meetingDate && <div><span className="text-muted-foreground">التاريخ:</span> {meeting.meetingDate}</div>}
                              {meeting.attendees && <div><span className="text-muted-foreground">الحضور:</span> {meeting.attendees}</div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Events Section (only if showEvents is true) */}
                  {ngo.showEvents && hasData(ngo.events as any[]) && (
                    <AccordionItem value="events" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-events">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          الفعاليات
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.events as any[]).map((event, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-2">{event.eventName}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {event.eventType && <div><span className="text-muted-foreground">نوع الفعالية:</span> {event.eventType}</div>}
                              {event.invitationType && <div><span className="text-muted-foreground">نوع الدعوة:</span> {event.invitationType}</div>}
                              {event.startDate && <div><span className="text-muted-foreground">تاريخ البدء:</span> {event.startDate}</div>}
                              {event.endDate && <div><span className="text-muted-foreground">تاريخ الانتهاء:</span> {event.endDate}</div>}
                              {event.announcementDate && <div><span className="text-muted-foreground">تاريخ الإعلان:</span> {event.announcementDate}</div>}
                              {event.announcementEndDate && <div><span className="text-muted-foreground">انتهاء الإعلان:</span> {event.announcementEndDate}</div>}
                              {event.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {event.governorate}</div>}
                              {event.address && <div className="col-span-2"><span className="text-muted-foreground">العنوان:</span> {event.address}</div>}
                              {event.startDescription && <div className="col-span-2"><span className="text-muted-foreground">وصف البداية:</span> {event.startDescription}</div>}
                              {event.endDescription && <div className="col-span-2"><span className="text-muted-foreground">وصف النهاية:</span> {event.endDescription}</div>}
                              {event.details && <div className="col-span-2"><span className="text-muted-foreground">التفاصيل:</span> <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.details) }} /></div>}
                            </div>
                            {event.image && (
                              <img src={event.image} alt={event.eventName} className="w-full h-32 object-cover rounded-lg mt-2" />
                            )}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Statistics Section */}
                  {hasData(ngo.statistics as any[]) && (
                    <AccordionItem value="statistics" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-statistics">
                        <span className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          الإحصائيات
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(ngo.statistics as any[]).map((stat, i) => (
                            <div key={i} className="p-4 bg-muted/30 rounded-lg text-center">
                              <div className="text-2xl font-bold text-primary">{stat.count}</div>
                              <div className="text-sm text-muted-foreground">{stat.title}</div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Donation Campaigns Section (only if showDonationCampaigns is true) */}
                  {ngo.showDonationCampaigns && hasData(ngo.donationCampaigns as any[]) && (
                    <AccordionItem value="donation-campaigns" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-donation-campaigns">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          حملات التبرع
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.donationCampaigns as any[]).map((campaign, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg" data-testid={`donation-campaign-${i}`}>
                            <div className="font-medium mb-2">{campaign.campaignName}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {campaign.campaignType && <div><span className="text-muted-foreground">نوع الحملة:</span> {campaign.campaignType}</div>}
                              {campaign.targetGroups && <div><span className="text-muted-foreground">الفئات المستهدفة:</span> {campaign.targetGroups}</div>}
                              {campaign.startDate && <div><span className="text-muted-foreground">تاريخ البدء:</span> {campaign.startDate}</div>}
                              {campaign.endDate && <div><span className="text-muted-foreground">تاريخ الانتهاء:</span> {campaign.endDate}</div>}
                              {campaign.governorate && <div><span className="text-muted-foreground">المحافظة:</span> {campaign.governorate}</div>}
                              {campaign.details && <div className="col-span-2"><span className="text-muted-foreground">التفاصيل:</span> <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(campaign.details) }} /></div>}
                            </div>
                            {campaign.image && (
                              <img src={campaign.image} alt={campaign.campaignName} className="w-full h-32 object-cover rounded-lg mt-2" />
                            )}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Networking Section */}
                  {hasData(ngo.networking as any[]) && (
                    <AccordionItem value="networking" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-networking">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          التشبيك
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.networking as any[]).map((net, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {net.needType && <div><span className="text-muted-foreground">نوع الحاجة:</span> {net.needType}</div>}
                              {net.classification && <div><span className="text-muted-foreground">التصنيف:</span> {net.classification}</div>}
                              {net.need && <div><span className="text-muted-foreground">الحاجة:</span> {net.need}</div>}
                              {net.count && <div><span className="text-muted-foreground">العدد:</span> {net.count}</div>}
                              {net.description && <div className="col-span-2"><span className="text-muted-foreground">الوصف:</span> <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(net.description) }} /></div>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Photo Gallery Section */}
                  {hasData(ngo.photoGallery as any[]) && (
                    <AccordionItem value="gallery" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-gallery">
                        معرض الصور
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(ngo.photoGallery as any[]).map((photo, i) => (
                            <div key={i} className="group">
                              <img 
                                src={photo.image} 
                                alt={photo.title || `صورة ${i + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                                data-testid={`img-gallery-${i}`}
                              />
                              {photo.title && (
                                <p className="text-xs text-center mt-1 text-muted-foreground">{photo.title}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
