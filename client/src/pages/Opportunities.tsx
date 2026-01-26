import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Search, MapPin, Building2, Calendar, Loader2, Filter, Clock, ArrowLeft } from "lucide-react";

interface Opportunity {
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
}

const SYRIAN_GOVERNORATES = [
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
  "القنيطرة"
];

export default function Opportunities() {
  const [activeTab, setActiveTab] = useState<'all' | 'job' | 'volunteer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all');
  const [selectedCommitment, setSelectedCommitment] = useState<string>('all');

  const { data: opportunities, isLoading } = useQuery<Opportunity[]>({
    queryKey: ['/api/public/opportunities'],
  });

  const organizations = useMemo(() => {
    if (!opportunities) return [];
    const orgs = new Set(opportunities.map(o => o.ngoName));
    return Array.from(orgs).sort();
  }, [opportunities]);

  const commitmentTypes = useMemo(() => {
    if (!opportunities) return [];
    const types = new Set(opportunities.map(o => o.commitmentNature).filter(Boolean));
    return Array.from(types).sort() as string[];
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];
    
    return opportunities.filter(opp => {
      if (activeTab !== 'all' && opp.type !== activeTab) return false;
      
      if (selectedGovernorate !== 'all' && opp.governorate !== selectedGovernorate) return false;
      
      if (selectedOrganization !== 'all' && opp.ngoName !== selectedOrganization) return false;

      if (selectedCommitment !== 'all' && opp.commitmentNature !== selectedCommitment) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          opp.vacancyName,
          opp.workField,
          opp.ngoName,
          opp.details,
          opp.skills,
          opp.qualification
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(query)) return false;
      }
      
      return true;
    });
  }, [opportunities, activeTab, selectedGovernorate, selectedOrganization, selectedCommitment, searchQuery]);

  const jobCount = opportunities?.filter(o => o.type === 'job').length || 0;
  const volunteerCount = opportunities?.filter(o => o.type === 'volunteer').length || 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">فرص العمل والتطوع</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            تصفح فرص العمل والتطوع المتاحة لدى المنظمات غير الحكومية المسجلة
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} dir="rtl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3 gap-1">
                <TabsTrigger value="all" className="gap-2" data-testid="tab-all">
                  الكل
                  <Badge variant="secondary" className="text-xs">{opportunities?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="job" className="gap-2" data-testid="tab-job">
                  <Briefcase className="w-4 h-4" />
                  فرص العمل
                  <Badge variant="secondary" className="text-xs">{jobCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="volunteer" className="gap-2" data-testid="tab-volunteer">
                  <Users className="w-4 h-4" />
                  فرص التطوع
                  <Badge variant="secondary" className="text-xs">{volunteerCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن فرصة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                      data-testid="input-search"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                      <SelectTrigger className="w-full sm:w-48" data-testid="select-governorate">
                        <MapPin className="w-4 h-4 ml-2" />
                        <SelectValue placeholder="المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل المحافظات</SelectItem>
                        {SYRIAN_GOVERNORATES.map(gov => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                      <SelectTrigger className="w-full sm:w-48" data-testid="select-organization">
                        <Building2 className="w-4 h-4 ml-2" />
                        <SelectValue placeholder="المنظمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل المنظمات</SelectItem>
                        {organizations.map(org => (
                          <SelectItem key={org} value={org}>{org}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {commitmentTypes.length > 0 && (
                      <Select value={selectedCommitment} onValueChange={setSelectedCommitment}>
                        <SelectTrigger className="w-full sm:w-48" data-testid="select-commitment">
                          <Clock className="w-4 h-4 ml-2" />
                          <SelectValue placeholder="طبيعة الالتزام" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل أنواع الالتزام</SelectItem>
                          {commitmentTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2" dir="rtl">
                {filteredOpportunities.map((opp) => (
                  <Card key={opp.id} className="hover-elevate transition-shadow" data-testid={`opportunity-card-${opp.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <Link href={`/opportunities/${opp.id}`} data-testid={`link-opportunity-title-${opp.id}`}>
                            <CardTitle className="text-lg text-primary leading-relaxed hover:underline cursor-pointer">
                              {opp.vacancyName || opp.workField || 'فرصة جديدة'}
                            </CardTitle>
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>{opp.ngoName}</span>
                          </div>
                        </div>
                        <Badge variant={opp.type === 'job' ? 'default' : 'secondary'}>
                          {opp.type === 'job' ? 'وظيفة' : 'تطوع'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {opp.governorate && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{opp.governorate}</span>
                          </div>
                        )}
                        {opp.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{opp.startDate}</span>
                          </div>
                        )}
                        {opp.commitmentNature && (
                          <Badge variant="outline" className="text-xs">{opp.commitmentNature}</Badge>
                        )}
                      </div>

                      {opp.workField && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">مجال العمل: </span>
                          <span>{opp.workField}</span>
                        </div>
                      )}

                      {(opp.jobPurpose || opp.volunteerPurpose) && (
                        <div className="text-sm line-clamp-2">
                          <span className="text-muted-foreground">الغرض: </span>
                          <span>{opp.jobPurpose || opp.volunteerPurpose}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t flex justify-between items-center">
                        <Link href={`/opportunities/${opp.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-opportunity-${opp.id}`}>
                            عرض التفاصيل
                            <ArrowLeft className="w-4 h-4 mr-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Filter className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">لا توجد فرص متاحة حالياً</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    جرب تغيير معايير البحث أو الفلترة
                  </p>
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
