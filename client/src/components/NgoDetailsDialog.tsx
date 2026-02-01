import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Download } from "lucide-react";
import type { Ngo } from "@shared/schema";
import { sanitizeHtml } from "@/lib/sanitize";
import { NgoInternalNotes } from "@/components/NgoInternalNotes";

interface NgoDetailsDialogProps {
  ngo: Ngo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showInternalNotes?: boolean;
}

export function NgoDetailsDialog({ ngo, open, onOpenChange, showInternalNotes = false }: NgoDetailsDialogProps) {
  const getFieldValue = (value: string | null | undefined, fallback: string = "غير محدد") => {
    return value && value.trim() ? value : fallback;
  };

  const displayName = ngo?.arabicName || ngo?.name || "غير محدد";
  const displayEnglishName = ngo?.englishName || "Not specified";

  const BooleanBadge = ({ value }: { value: boolean | null | undefined }) => (
    value ? (
      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
        <Check className="w-3 h-3 ml-1" />
        نعم
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
        <X className="w-3 h-3 ml-1" />
        لا
      </Badge>
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto" dir="rtl" data-testid="dialog-ngo-details">
        {ngo ? (
          <>
            <DialogHeader className="text-right border-b pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {ngo.logo && (
                    <img
                      src={ngo.logo}
                      alt={displayName}
                      className="w-16 h-16 object-contain border rounded-lg bg-white"
                      data-testid="img-ngo-logo"
                    />
                  )}
                  <div>
                    <DialogTitle className="text-xl font-bold text-primary">{displayName}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">{displayEnglishName}</DialogDescription>
                  </div>
                </div>
                <StatusBadge status={ngo.status as any} />
              </div>
            </DialogHeader>

            {/* Approval Chain & Rejection Info */}
            {(ngo.status === "AdminApproved" || ngo.status === "Approved" || ngo.status === "Rejected") && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">سجل الموافقات</h4>
                <div className="space-y-2 text-sm">
                  {ngo.approvedByAdminAt && (
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-100">موافقة أولية</Badge>
                      <span className="text-muted-foreground">
                        بواسطة المدير رقم #{ngo.approvedByAdminId}
                        {ngo.approvedByAdminAt && ` - ${new Date(ngo.approvedByAdminAt).toLocaleDateString("ar-SY")}`}
                      </span>
                    </div>
                  )}
                  {ngo.approvedBySuperAdminAt && (
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">موافقة نهائية</Badge>
                      <span className="text-muted-foreground">
                        بواسطة المشرف الأعلى رقم #{ngo.approvedBySuperAdminId}
                        {ngo.approvedBySuperAdminAt && ` - ${new Date(ngo.approvedBySuperAdminAt).toLocaleDateString("ar-SY")}`}
                      </span>
                    </div>
                  )}
                  {ngo.status === "Rejected" && ngo.rejectionReason && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">مرفوض</Badge>
                        {ngo.rejectedById && (
                          <span className="text-muted-foreground text-xs">
                            بواسطة المسؤول رقم #{ngo.rejectedById}
                            {ngo.rejectedAt && ` - ${new Date(ngo.rejectedAt).toLocaleDateString("ar-SY")}`}
                          </span>
                        )}
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <span className="text-sm font-medium text-red-700">سبب الرفض:</span>
                        <p className="text-sm text-red-600 mt-1">{ngo.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Accordion type="multiple" defaultValue={["section-1"]} className="w-full">
              {/* Section 1: معلومات التأسيس */}
              <AccordionItem value="section-1">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                  معلومات التأسيس
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem label="معرف المنظمة" value={getFieldValue(ngo.orgIdentifier)} />
                    <DetailItem label="الاسم العربي" value={getFieldValue(ngo.arabicName)} />
                    <DetailItem label="الاسم الإنكليزي" value={getFieldValue(ngo.englishName)} />
                    <DetailItem label="الشكل القانوني" value={getFieldValue(ngo.legalForm)} />
                  </div>
                  
                  <h4 className="font-medium text-sm text-muted-foreground border-t pt-3">معلومات الإشهار</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem label="نطاق العمل" value={getFieldValue(ngo.scope)} />
                    <DetailItem label="حالة المنظمة" value={getFieldValue(ngo.orgStatus)} />
                    <DetailItem label="رقم قرار الإشهار" value={getFieldValue(ngo.publicationNumber)} />
                    <DetailItem label="تاريخ قرار الإشهار" value={getFieldValue(ngo.publicationDate)} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
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

                  {(ngo.internalRegulationsDoc || ngo.publicationDecisionDoc || ngo.publicBenefitDoc) && (
                    <div className="border-t pt-3">
                      <span className="text-sm font-medium text-muted-foreground block mb-2">وثائق المنظمة</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {ngo.internalRegulationsDoc && (
                          <Button
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => window.open(ngo.internalRegulationsDoc!, "_blank")}
                            data-testid="button-download-internal-regulations"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate">وثيقة النظام الداخلي</span>
                            <Download className="h-3 w-3 mr-auto" />
                          </Button>
                        )}
                        {ngo.publicationDecisionDoc && (
                          <Button
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => window.open(ngo.publicationDecisionDoc!, "_blank")}
                            data-testid="button-download-publication-decision"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate">وثيقة قرار الإشهار</span>
                            <Download className="h-3 w-3 mr-auto" />
                          </Button>
                        )}
                        {ngo.publicBenefitDoc && (
                          <Button
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => window.open(ngo.publicBenefitDoc!, "_blank")}
                            data-testid="button-download-public-benefit"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate">وثيقة النفع العام</span>
                            <Download className="h-3 w-3 mr-auto" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {ngo.description && (
                    <div className="border-t pt-3">
                      <span className="text-sm font-medium text-muted-foreground block mb-2">نبذة عن المنظمة</span>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(ngo.description) }} />
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: التصنيفات والخدمات */}
              {((ngo.classifications && (ngo.classifications as any[]).length > 0) || 
                (ngo.services && (ngo.services as any[]).length > 0)) && (
                <AccordionItem value="section-2">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    التصنيفات والخدمات
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {ngo.classifications && (ngo.classifications as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">التصنيفات</h4>
                        <div className="flex flex-wrap gap-2">
                          {(ngo.classifications as any[]).map((c, i) => (
                            <Badge key={i} variant="outline">{c.type}: {c.name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {ngo.services && (ngo.services as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">الخدمات</h4>
                        <div className="space-y-2">
                          {(ngo.services as any[]).map((s, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3 text-sm">
                              <div className="font-medium">{s.serviceType} - {s.specialty}</div>
                              <div className="text-muted-foreground">{s.serviceDescription}</div>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span>الفئة: {s.targetGroup}</span>
                                <span>المحافظة: {s.governorate}</span>
                                <span>الحالة: {s.availabilityStatus}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 3: المراكز الخدمية */}
              {ngo.serviceCenters && (ngo.serviceCenters as any[]).length > 0 && (
                <AccordionItem value="section-3">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    المراكز الخدمية ({(ngo.serviceCenters as any[]).length})
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    {(ngo.serviceCenters as any[]).map((center, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3">
                        <div className="font-medium text-sm">{center.name}</div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                          <span>النوع: {center.centerType}</span>
                          <span>رقم الترخيص: {center.licenseNumber}</span>
                          <span>المحافظة: {center.licensedGovernorate}</span>
                          <span>العنوان: {center.detailedAddress}</span>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 4: الفروع والمكاتب */}
              {ngo.branches && (ngo.branches as any[]).length > 0 && (
                <AccordionItem value="section-4">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    الفروع والمكاتب ({(ngo.branches as any[]).length})
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    {(ngo.branches as any[]).map((branch, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3">
                        <div className="font-medium text-sm">{branch.branchType} - {branch.licensedGovernorate}</div>
                        <div className="text-xs text-muted-foreground mt-1">{branch.address}</div>
                        {branch.offeredServices && (
                          <div className="text-xs text-muted-foreground mt-1">الخدمات: {branch.offeredServices}</div>
                        )}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 5: العلاقة مع الوزارة */}
              {ngo.financialData && (ngo.financialData as any[]).length > 0 && (
                <AccordionItem value="section-5">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    البيانات المالية ({(ngo.financialData as any[]).length})
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {(ngo.financialData as any[]).map((fd, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                        <span className="font-medium text-sm">سنة {fd.year}</span>
                        <span className="text-sm text-muted-foreground">{fd.closingBudget}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 6: معلومات التواصل */}
              {ngo.contactMethods && (ngo.contactMethods as any[]).length > 0 && (
                <AccordionItem value="section-6">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    معلومات التواصل ({(ngo.contactMethods as any[]).length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(ngo.contactMethods as any[]).map((cm, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{cm.type}</span>
                          <span className="font-medium text-sm">{cm.value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 7: الحسابات البنكية */}
              {ngo.bankAccounts && (ngo.bankAccounts as any[]).length > 0 && (
                <AccordionItem value="section-7">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    الحسابات البنكية ({(ngo.bankAccounts as any[]).length})
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {(ngo.bankAccounts as any[]).map((ba, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{ba.bankName} - {ba.branchName}</span>
                          {ba.isDonationAccount && <Badge variant="outline">حساب تبرعات</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">رقم الحساب: {ba.accountNumber}</div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 8: البرامج والأنشطة */}
              {((ngo.programs && (ngo.programs as any[]).length > 0) || 
                (ngo.activities && (ngo.activities as any[]).length > 0)) && (
                <AccordionItem value="section-8">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    البرامج والأنشطة
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {ngo.programs && (ngo.programs as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">البرامج</h4>
                        <div className="space-y-2">
                          {(ngo.programs as any[]).map((p, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3">
                              <div className="font-medium text-sm">{p.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">الأهداف: {p.goals}</div>
                              <div className="text-xs text-muted-foreground">الفئات المستهدفة: {p.targetGroups}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ngo.activities && (ngo.activities as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">الأنشطة</h4>
                        <div className="space-y-2">
                          {(ngo.activities as any[]).map((a, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3">
                              <div className="font-medium text-sm">{a.name} ({a.activityType})</div>
                              <div className="text-xs text-muted-foreground mt-1">الأهداف: {a.goals}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 9: الموظفون والمتطوعون */}
              {((ngo.employees && (ngo.employees as any[]).length > 0) || 
                (ngo.volunteers && (ngo.volunteers as any[]).length > 0)) && (
                <AccordionItem value="section-9">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    الوضع الإداري والتنظيمي
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {ngo.employees && (ngo.employees as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">الموظفون ({(ngo.employees as any[]).length})</h4>
                        <div className="space-y-2">
                          {(ngo.employees as any[]).map((e, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                              <span className="font-medium text-sm">{e.firstName} {e.lastName}</span>
                              <span className="text-sm text-muted-foreground">{e.position}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ngo.volunteers && (ngo.volunteers as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">المتطوعون ({(ngo.volunteers as any[]).length})</h4>
                        <div className="space-y-2">
                          {(ngo.volunteers as any[]).map((v, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                              <span className="font-medium text-sm">{v.firstName} {v.lastName}</span>
                              <span className="text-sm text-muted-foreground">{v.position}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 10: الممتلكات */}
              {((ngo.vehicles && (ngo.vehicles as any[]).length > 0) || 
                (ngo.realEstate && (ngo.realEstate as any[]).length > 0)) && (
                <AccordionItem value="section-10">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    الممتلكات
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {ngo.vehicles && (ngo.vehicles as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">الآليات ({(ngo.vehicles as any[]).length})</h4>
                        <div className="space-y-2">
                          {(ngo.vehicles as any[]).map((v, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3">
                              <div className="font-medium text-sm">{v.vehicleType} - {v.model}</div>
                              <div className="text-xs text-muted-foreground mt-1">رقم اللوحة: {v.plateNumber}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ngo.realEstate && (ngo.realEstate as any[]).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">العقارات ({(ngo.realEstate as any[]).length})</h4>
                        <div className="space-y-2">
                          {(ngo.realEstate as any[]).map((r, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-3">
                              <div className="font-medium text-sm">{r.propertyType} - {r.governorate}</div>
                              <div className="text-xs text-muted-foreground mt-1">رقم العقار: {r.propertyNumber}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section 11: فرص عمل و تطوع */}
              {((ngo.jobOpportunities && (ngo.jobOpportunities as any[]).length > 0) ||
                (ngo.volunteerOpportunities && (ngo.volunteerOpportunities as any[]).length > 0) ||
                (ngo.events && (ngo.events as any[]).length > 0) ||
                (ngo.donationCampaigns && (ngo.donationCampaigns as any[]).length > 0) ||
                (ngo.photoGallery && (ngo.photoGallery as any[]).length > 0) ||
                (ngo.statistics && (ngo.statistics as any[]).length > 0) ||
                (ngo.networking && (ngo.networking as any[]).length > 0)) && (
              <AccordionItem value="section-11">
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-trigger-section-11">
                  فرص عمل و تطوع
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  {/* فرص العمل */}
                  {ngo.jobOpportunities && (ngo.jobOpportunities as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">فرص العمل ({(ngo.jobOpportunities as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.jobOpportunities as any[]).map((job, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{job.vacancyName || job.jobTitle}</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                              {job.workField && <span>مجال العمل: {job.workField}</span>}
                              {job.vacancyNumber && <span>رقم الشاغر: {job.vacancyNumber}</span>}
                              {job.governorate && <span>المحافظة: {job.governorate}</span>}
                              {job.startDate && <span>تاريخ البدء: {job.startDate}</span>}
                              {job.endDate && <span>تاريخ الانتهاء: {job.endDate}</span>}
                              {job.commitmentNature && <span>طبيعة الالتزام: {job.commitmentNature}</span>}
                              {job.jobPurpose && <span>الغرض الوظيفي: {job.jobPurpose}</span>}
                              {job.qualification && <span>المؤهلات: {job.qualification}</span>}
                              {job.skills && <span>المهارات: {job.skills}</span>}
                              {job.experience && <span>الخبرة: {job.experience}</span>}
                            </div>
                            {job.details && (
                              <div className="mt-3 pt-3 border-t border-muted">
                                <div className="text-xs font-medium text-muted-foreground mb-1">تفاصيل الوظيفة:</div>
                                <div className="text-sm bg-background/50 rounded p-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.details) }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* فرص التطوع */}
                  {ngo.volunteerOpportunities && (ngo.volunteerOpportunities as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">فرص التطوع ({(ngo.volunteerOpportunities as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.volunteerOpportunities as any[]).map((vol, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{vol.workField}</div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                              {vol.volunteerType && <span>نوع التطوع: {vol.volunteerType}</span>}
                            </div>
                            {vol.details && <div className="text-xs text-muted-foreground mt-1">التفاصيل: <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(vol.details) }} /></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الفعاليات */}
                  {ngo.events && (ngo.events as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">الفعاليات ({(ngo.events as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.events as any[]).map((event, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{event.eventName}</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                              {event.eventType && <span>نوع الفعالية: {event.eventType}</span>}
                              {event.invitationType && <span>نوع الدعوة: {event.invitationType}</span>}
                              {event.address && <span>العنوان: {event.address}</span>}
                              {event.startDate && <span>تاريخ البدء: {event.startDate}</span>}
                              {event.endDate && <span>تاريخ الانتهاء: {event.endDate}</span>}
                            </div>
                            {event.details && <div className="text-xs text-muted-foreground mt-1">التفاصيل: <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.details) }} /></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* حملات التبرع */}
                  {ngo.donationCampaigns && (ngo.donationCampaigns as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">حملات التبرع ({(ngo.donationCampaigns as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.donationCampaigns as any[]).map((campaign, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{campaign.campaignName}</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                              {campaign.campaignType && <span>نوع الحملة: {campaign.campaignType}</span>}
                              {campaign.targetGroups && <span>الفئات المستهدفة: {campaign.targetGroups}</span>}
                              {campaign.governorate && <span>المحافظة: {campaign.governorate}</span>}
                              {campaign.startDate && <span>تاريخ البدء: {campaign.startDate}</span>}
                              {campaign.endDate && <span>تاريخ الانتهاء: {campaign.endDate}</span>}
                            </div>
                            {campaign.details && <div className="text-xs text-muted-foreground mt-1">التفاصيل: <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(campaign.details) }} /></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* معرض الصور */}
                  {ngo.photoGallery && (ngo.photoGallery as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">معرض الصور ({(ngo.photoGallery as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.photoGallery as any[]).map((photo, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{photo.title}</div>
                            {photo.details && <div className="text-xs text-muted-foreground mt-1">{photo.details}</div>}
                            {photo.image && <div className="text-xs text-muted-foreground mt-1">رابط الصورة: {photo.image}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الإحصائيات */}
                  {ngo.statistics && (ngo.statistics as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">الإحصائيات ({(ngo.statistics as any[]).length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(ngo.statistics as any[]).map((stat, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-primary">{stat.count}</div>
                            <div className="text-sm text-muted-foreground">{stat.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* التشبيك */}
                  {ngo.networking && (ngo.networking as any[]).length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 border-b pb-2">التشبيك ({(ngo.networking as any[]).length})</h4>
                      <div className="space-y-2">
                        {(ngo.networking as any[]).map((net, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{net.need || net.needType}</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                              {net.needType && <span>نوع الاحتياج: {net.needType}</span>}
                              {net.classification && <span>التصنيف: {net.classification}</span>}
                              {net.count && <span>العدد: {net.count}</span>}
                            </div>
                            {net.description && <div className="text-xs text-muted-foreground mt-1">الوصف: <span className="prose prose-sm max-w-none inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(net.description) }} /></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Legacy fields for backward compatibility */}
              {(ngo.city || ngo.presidentName || ngo.email || ngo.phone) && (
                <AccordionItem value="section-legacy">
                  <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                    معلومات إضافية
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ngo.city && <DetailItem label="المدينة" value={ngo.city} />}
                      {ngo.presidentName && <DetailItem label="اسم الرئيس" value={ngo.presidentName} />}
                      {ngo.email && <DetailItem label="البريد الإلكتروني" value={ngo.email} />}
                      {ngo.phone && <DetailItem label="رقم الهاتف" value={ngo.phone} />}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      تاريخ التقديم: {ngo.createdAt ? new Date(ngo.createdAt).toLocaleDateString("ar-SY", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "غير محدد"}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Internal Notes Section - Admin Only */}
            {showInternalNotes && ngo && (
              <div className="mt-6 pt-6 border-t">
                <NgoInternalNotes ngoId={ngo.id} />
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <DialogHeader>
              <DialogTitle className="sr-only">تفاصيل المنظمة</DialogTitle>
              <DialogDescription className="sr-only">جاري تحميل تفاصيل المنظمة</DialogDescription>
            </DialogHeader>
            جاري التحميل...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/20 rounded-lg p-3 border" data-testid={`detail-${label}`}>
      <span className="text-xs font-medium text-muted-foreground block mb-1">{label}</span>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
