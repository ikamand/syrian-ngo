import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Loader2, ArrowRight, Building2, MapPin, Phone, Mail, Globe, Check, X, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Ngo } from "@shared/schema";

export default function NgoProfile() {
  const [match, params] = useRoute("/ngos/:id");
  const ngoId = params?.id;

  const { data: ngo, isLoading, error } = useQuery<Ngo>({
    queryKey: ['/api/ngos', ngoId],
    queryFn: async () => {
      const res = await fetch(`/api/ngos/${ngoId}`);
      if (!res.ok) throw new Error("Failed to fetch NGO");
      return res.json();
    },
    enabled: !!ngoId,
  });

  const getFieldValue = (value: string | null | undefined, fallback: string = "غير محدد") => {
    return value && value.trim() ? value : fallback;
  };

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

  if (!match) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/ngos">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary" data-testid="button-back-ngos">
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
                      {ngo.orgStatus && (
                        <Badge className={
                          ngo.orgStatus === "فعالة" ? "bg-green-100 text-green-700" :
                          ngo.orgStatus === "معلقة" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        }>{ngo.orgStatus}</Badge>
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{ngo.description}</p>
                    </div>
                  </div>
                )}

                <Accordion type="multiple" defaultValue={["basic-info", "contact"]} className="w-full space-y-3">
                  <AccordionItem value="basic-info" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-basic-info">
                      المعلومات الأساسية
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="معرف المنظمة" value={getFieldValue(ngo.orgIdentifier)} />
                        <InfoItem label="رقم قرار الإشهار" value={getFieldValue(ngo.publicationNumber)} />
                        <InfoItem label="تاريخ قرار الإشهار" value={getFieldValue(ngo.publicationDate)} icon={<Calendar className="w-4 h-4" />} />
                        <InfoItem label="المدينة" value={getFieldValue(ngo.city)} icon={<MapPin className="w-4 h-4" />} />
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

                  {(ngo.contactMethods && (ngo.contactMethods as any[]).length > 0) && (
                    <AccordionItem value="contact" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-contact">
                        معلومات التواصل
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

                  {(ngo.classifications && (ngo.classifications as any[]).length > 0) && (
                    <AccordionItem value="classifications" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-classifications">
                        التصنيفات
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

                  {(ngo.services && (ngo.services as any[]).length > 0) && (
                    <AccordionItem value="services" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline" data-testid="accordion-services">
                        الخدمات المقدمة
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(ngo.services as any[]).map((service, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium mb-1">{service.serviceType}</div>
                            <div className="text-sm text-muted-foreground">{service.serviceDescription}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {service.targetGroup && <Badge variant="secondary" className="text-xs">{service.targetGroup}</Badge>}
                              {service.governorate && <Badge variant="outline" className="text-xs">{service.governorate}</Badge>}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {(ngo.photoGallery && (ngo.photoGallery as any[]).length > 0) && (
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
