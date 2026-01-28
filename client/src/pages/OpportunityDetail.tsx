import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Briefcase, Users, MapPin, Calendar, Building2, Clock, GraduationCap, Wrench, Award } from "lucide-react";

interface OpportunityDetail {
  id: string;
  type: 'job' | 'volunteer';
  ngoId: number;
  ngoName: string;
  vacancyName: string;
  vacancyNumber?: string;
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
}

export default function OpportunityDetail() {
  const params = useParams<{ id: string }>();
  const opportunityId = params.id;

  const { data: opportunity, isLoading, error } = useQuery<OpportunityDetail>({
    queryKey: ['/api/public/opportunities', opportunityId],
    enabled: !!opportunityId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">الفرصة غير موجودة</p>
              <Link href="/opportunities">
                <Button variant="outline" data-testid="button-back-to-opportunities">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  العودة للفرص
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isJob = opportunity.type === 'job';
  const purpose = isJob ? opportunity.jobPurpose : opportunity.volunteerPurpose;

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto space-y-6" data-testid={`opportunity-detail-${opportunityId}`}>
          <Link href="/opportunities">
            <Button variant="ghost" className="mb-4" data-testid="button-back-to-opportunities">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للفرص
            </Button>
          </Link>

          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {isJob ? (
                      <Briefcase className="w-6 h-6 text-primary" />
                    ) : (
                      <Users className="w-6 h-6 text-primary" />
                    )}
                    <Badge variant={isJob ? 'default' : 'secondary'} className="text-sm">
                      {isJob ? 'فرصة عمل' : 'فرصة تطوع'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-primary leading-relaxed" data-testid="opportunity-title">
                    {opportunity.vacancyName || opportunity.workField || 'فرصة جديدة'}
                  </CardTitle>
                  <Link href={`/ngos/${opportunity.ngoId}`}>
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-ngo-name">
                      <Building2 className="w-5 h-5" />
                      <span className="text-lg">{opportunity.ngoName}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="metadata-grid">
                {opportunity.governorate && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-governorate">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">المحافظة</p>
                      <p className="font-medium" data-testid="text-governorate">{opportunity.governorate}</p>
                    </div>
                  </div>
                )}

                {opportunity.startDate && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-start-date">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ البدء</p>
                      <p className="font-medium" data-testid="text-start-date">{opportunity.startDate}</p>
                    </div>
                  </div>
                )}

                {opportunity.endDate && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-end-date">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ الانتهاء</p>
                      <p className="font-medium" data-testid="text-end-date">{opportunity.endDate}</p>
                    </div>
                  </div>
                )}

                {opportunity.commitmentNature && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-commitment">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">طبيعة الالتزام</p>
                      <p className="font-medium" data-testid="text-commitment">{opportunity.commitmentNature}</p>
                    </div>
                  </div>
                )}

                {opportunity.workField && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-work-field">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">مجال العمل</p>
                      <p className="font-medium" data-testid="text-work-field">{opportunity.workField}</p>
                    </div>
                  </div>
                )}

                {opportunity.vacancyNumber && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg" data-testid="card-vacancy-number">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">رقم الشاغر</p>
                      <p className="font-medium" data-testid="text-vacancy-number">{opportunity.vacancyNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {purpose && (
                <div className="border-t pt-6" data-testid="section-purpose">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    {isJob ? 'الغرض من الوظيفة' : 'الغرض من التطوع'}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap" data-testid="text-purpose">
                    {purpose}
                  </p>
                </div>
              )}

              {opportunity.qualification && (
                <div className="border-t pt-6" data-testid="section-qualification">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    المؤهلات المطلوبة
                  </h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap" data-testid="text-qualification">
                    {opportunity.qualification}
                  </p>
                </div>
              )}

              {opportunity.skills && (
                <div className="border-t pt-6" data-testid="section-skills">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    المهارات المطلوبة
                  </h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap" data-testid="text-skills">
                    {opportunity.skills}
                  </p>
                </div>
              )}

              {(isJob && (opportunity.experience || opportunity.employmentType || opportunity.education || opportunity.classification)) && (
                <div className="border-t pt-6" data-testid="section-job-details">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    تفاصيل الوظيفة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {opportunity.experience && (
                      <div className="p-3 bg-muted/50 rounded-lg" data-testid="card-experience">
                        <p className="text-xs text-muted-foreground mb-1">الخبرة</p>
                        <p className="font-medium" data-testid="text-experience">{opportunity.experience}</p>
                      </div>
                    )}
                    {opportunity.employmentType && (
                      <div className="p-3 bg-muted/50 rounded-lg" data-testid="card-employment-type">
                        <p className="text-xs text-muted-foreground mb-1">نوع التوظيف</p>
                        <p className="font-medium" data-testid="text-employment-type">{opportunity.employmentType}</p>
                      </div>
                    )}
                    {opportunity.education && (
                      <div className="p-3 bg-muted/50 rounded-lg" data-testid="card-education">
                        <p className="text-xs text-muted-foreground mb-1">التعليم</p>
                        <p className="font-medium" data-testid="text-education">{opportunity.education}</p>
                      </div>
                    )}
                    {opportunity.classification && (
                      <div className="p-3 bg-muted/50 rounded-lg" data-testid="card-classification">
                        <p className="text-xs text-muted-foreground mb-1">التصنيف</p>
                        <p className="font-medium" data-testid="text-classification">{opportunity.classification}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {opportunity.details && (
                <div className="border-t pt-6" data-testid="section-details">
                  <h3 className="text-lg font-semibold mb-3">التفاصيل الإضافية</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap" data-testid="text-details">
                    {opportunity.details}
                  </p>
                </div>
              )}

              <div className="border-t pt-6">
                <Link href={`/ngos/${opportunity.ngoId}`}>
                  <Button className="w-full md:w-auto" data-testid="button-view-ngo">
                    <Building2 className="w-4 h-4 ml-2" />
                    عرض ملف المنظمة
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
    </div>
  );
}
