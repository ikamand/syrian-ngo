import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Search, Building2, Map, List } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SyriaMap } from "@/components/SyriaMap";
import { Button } from "@/components/ui/button";

export default function NgoList() {
  const { data: ngos, isLoading } = useQuery({
    queryKey: [api.ngos.listPublic.path],
    queryFn: async () => {
      const res = await fetch(api.ngos.listPublic.path);
      if (!res.ok) throw new Error("Failed to fetch NGOs");
      return api.ngos.listPublic.responses[200].parse(await res.json());
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(null);

  const VALID_GOVERNORATES = [
    "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", 
    "طرطوس", "إدلب", "الحسكة", "دير الزور", "الرقة", 
    "درعا", "السويداء", "القنيطرة"
  ];

  const normalizeGovernorate = (value: string): string | null => {
    if (!value) return null;
    const normalized = value.trim();
    // Exact match
    if (VALID_GOVERNORATES.includes(normalized)) return normalized;
    // Partial match (e.g., "محافظة دمشق" should match "دمشق")
    for (const gov of VALID_GOVERNORATES) {
      if (normalized.includes(gov)) return gov;
    }
    return null;
  };

  const getGovernoratesFromNgo = (ngo: NonNullable<typeof ngos>[0]): string[] => {
    const governorates = new Set<string>();
    
    // Collect from all services
    if (ngo.services && Array.isArray(ngo.services)) {
      for (const service of ngo.services) {
        const svc = service as { governorate?: string };
        const gov = normalizeGovernorate(svc.governorate || "");
        if (gov) governorates.add(gov);
      }
    }
    // Collect from all branches
    if (ngo.branches && Array.isArray(ngo.branches)) {
      for (const branch of ngo.branches) {
        const br = branch as { licensedGovernorate?: string };
        const gov = normalizeGovernorate(br.licensedGovernorate || "");
        if (gov) governorates.add(gov);
      }
    }
    // Collect from all service centers
    if (ngo.serviceCenters && Array.isArray(ngo.serviceCenters)) {
      for (const center of ngo.serviceCenters) {
        const ctr = center as { licensedGovernorate?: string };
        const gov = normalizeGovernorate(ctr.licensedGovernorate || "");
        if (gov) governorates.add(gov);
      }
    }
    // Fallback to city field only if it matches a valid governorate
    if (governorates.size === 0 && ngo.city) {
      const gov = normalizeGovernorate(ngo.city);
      if (gov) governorates.add(gov);
    }
    
    return Array.from(governorates);
  };

  const governoratesData = useMemo(() => {
    return VALID_GOVERNORATES.map(name => {
      const count = (ngos || []).filter(ngo => {
        const ngoGovs = getGovernoratesFromNgo(ngo);
        return ngoGovs.includes(name);
      }).length;
      
      return {
        id: name,
        name,
        nameEn: name,
        count
      };
    });
  }, [ngos]);

  const filteredNgos = useMemo(() => {
    let result = ngos || [];
    
    if (searchTerm) {
      result = result.filter(ngo => 
        (ngo.arabicName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (ngo.englishName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (ngo.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [ngos, searchTerm]);

  const governorateNgos = useMemo(() => {
    if (!selectedGovernorate) return [];
    return (ngos || []).filter(ngo => {
      const ngoGovs = getGovernoratesFromNgo(ngo);
      return ngoGovs.includes(selectedGovernorate);
    });
  }, [ngos, selectedGovernorate]);

  const handleGovernorateClick = (governorate: string) => {
    if (selectedGovernorate === governorate) {
      setSelectedGovernorate(null);
    } else {
      setSelectedGovernorate(governorate);
    }
  };

  const NgoGrid = ({ ngosList }: { ngosList: typeof ngos }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" dir="rtl">
      {(ngosList || []).map((ngo) => (
        <Link 
          key={ngo.id} 
          href={`/ngos/${ngo.id}`}
          data-testid={`link-ngo-${ngo.id}`}
          aria-label={`عرض ملف ${ngo.arabicName || ngo.name || 'المنظمة'}`}
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          <Card 
            className="p-6 overflow-visible hover-elevate cursor-pointer transition-all duration-200 h-full flex flex-col items-center justify-center text-center"
            data-testid={`card-ngo-${ngo.id}`}
          >
            {ngo.logo ? (
              <img 
                src={ngo.logo} 
                alt={ngo.arabicName || "شعار المنظمة"} 
                className="w-20 h-20 object-contain mb-4"
                data-testid={`img-ngo-logo-${ngo.id}`}
              />
            ) : (
              <div 
                className="w-20 h-20 border-2 border-dashed rounded-lg bg-gray-50 flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <Building2 className="w-10 h-10 text-gray-300" />
              </div>
            )}
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
              {ngo.arabicName || ngo.name || "—"}
            </h3>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">دليل المنظمات غير الحكومية</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            ابحث في قاعدة بيانات المنظمات المرخصة والمعتمدة رسمياً في الجمهورية العربية السورية
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="map" className="w-full" dir="rtl">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="map" className="flex items-center gap-2" data-testid="tab-map-view">
              <Map className="w-4 h-4" />
              عرض الخريطة
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2" data-testid="tab-list-view">
              <List className="w-4 h-4" />
              عرض القائمة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" data-testid="content-map-view">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-primary mb-4 text-center">خريطة توزيع المنظمات</h2>
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
                  </div>
                ) : (
                  <SyriaMap 
                    governoratesData={governoratesData}
                    onGovernorateClick={handleGovernorateClick}
                    selectedGovernorate={selectedGovernorate}
                  />
                )}
              </Card>

              <div>
                {selectedGovernorate ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-primary">
                        منظمات {selectedGovernorate}
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedGovernorate(null)}
                        data-testid="button-clear-selection"
                      >
                        إلغاء التحديد
                      </Button>
                    </div>
                    
                    {governorateNgos.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>لا توجد منظمات مسجلة في هذه المحافظة</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {governorateNgos.map((ngo) => (
                          <Link 
                            key={ngo.id}
                            href={`/ngos/${ngo.id}`}
                            className="block"
                            data-testid={`map-ngo-link-${ngo.id}`}
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                              {ngo.logo ? (
                                <img 
                                  src={ngo.logo} 
                                  alt={ngo.arabicName || "شعار"} 
                                  className="w-12 h-12 object-contain rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">
                                  {ngo.arabicName || ngo.name || "—"}
                                </h3>
                                {ngo.city && (
                                  <p className="text-xs text-muted-foreground">{ngo.city}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                ) : (
                  <Card className="p-6">
                    <h2 className="text-lg font-bold text-primary mb-4">إحصائيات المنظمات</h2>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold text-primary mb-2">{ngos?.length || 0}</div>
                      <p className="text-muted-foreground">منظمة مسجلة</p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-muted-foreground text-center">
                        انقر على أي محافظة في الخريطة لعرض المنظمات المسجلة فيها
                      </p>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="font-semibold text-sm mb-3">التوزيع حسب المحافظة:</h3>
                      {governoratesData
                        .filter(g => g.count > 0)
                        .sort((a, b) => b.count - a.count)
                        .map(gov => (
                          <div 
                            key={gov.name} 
                            className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => handleGovernorateClick(gov.name)}
                            data-testid={`governorate-stat-${gov.name}`}
                          >
                            <span>{gov.name}</span>
                            <span className="font-bold text-primary">{gov.count}</span>
                          </div>
                        ))
                      }
                      {governoratesData.filter(g => g.count > 0).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          لا توجد منظمات مسجلة حالياً
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" data-testid="content-list-view">
            <div className="bg-white p-4 rounded-xl shadow-lg max-w-2xl mx-auto mb-10 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="ابحث عن اسم منظمة أو مدينة..." 
                  className="pr-10 h-12 text-lg border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-ngo"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            ) : filteredNgos.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">لا توجد منظمات مطابقة لبحثك</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    تم العثور على <span className="font-bold text-primary">{filteredNgos.length}</span> منظمة مرخصة
                  </p>
                </div>
                <NgoGrid ngosList={filteredNgos} />
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
