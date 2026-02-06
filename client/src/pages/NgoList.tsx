import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Search, Building2, Map, List, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SyriaMapLeaflet } from "@/components/SyriaMapLeaflet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import headerPattern from "@assets/header-pattern.svg";

const CLASSIFICATION_OPTIONS = [
  "تعليم وتمكين",
  "البيئة",
  "الأعمال الخيرية",
  "التنمية والإسكان",
  "الخدمات الاجتماعية",
  "الثقافة والرياضة والتسلية والفنون",
  "الترويج للعمل التطوعي",
  "القانون والدفاع والحقوق",
  "الصحة",
];

const ITEMS_PER_PAGE = 16;

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
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [selectedFilterGovernorate, setSelectedFilterGovernorate] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

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
    // Check headquartersGovernorate field first (primary source)
    if (ngo.headquartersGovernorate) {
      const gov = normalizeGovernorate(ngo.headquartersGovernorate);
      if (gov) governorates.add(gov);
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

  // Extract branch locations with valid coordinates for map markers
  const branchLocations = useMemo(() => {
    const locations: {
      ngoId: number;
      ngoName: string;
      branchType: string;
      governorate: string;
      latitude: number;
      longitude: number;
      offeredServices?: string;
    }[] = [];

    (ngos || []).forEach(ngo => {
      if (ngo.branches && Array.isArray(ngo.branches)) {
        ngo.branches.forEach((branch: any) => {
          const lat = parseFloat(branch.latitude);
          const lng = parseFloat(branch.longitude);
          // Only include branches with valid coordinates within Syria's approximate bounds
          if (!isNaN(lat) && !isNaN(lng) && lat > 32 && lat < 38 && lng > 35 && lng < 43) {
            locations.push({
              ngoId: ngo.id,
              ngoName: ngo.arabicName || ngo.name || "منظمة",
              branchType: branch.branchType || "",
              governorate: branch.licensedGovernorate || "",
              latitude: lat,
              longitude: lng,
              offeredServices: branch.offeredServices || ""
            });
          }
        });
      }
    });

    return locations;
  }, [ngos]);

  // Extract headquarters locations with valid coordinates for map markers
  const headquartersLocations = useMemo(() => {
    const locations: {
      ngoId: number;
      ngoName: string;
      governorate: string;
      latitude: number;
      longitude: number;
    }[] = [];

    (ngos || []).forEach(ngo => {
      const lat = parseFloat(ngo.headquartersLatitude || "");
      const lng = parseFloat(ngo.headquartersLongitude || "");
      // Only include NGOs with valid coordinates within Syria's approximate bounds
      if (!isNaN(lat) && !isNaN(lng) && lat > 32 && lat < 38 && lng > 35 && lng < 43) {
        locations.push({
          ngoId: ngo.id,
          ngoName: ngo.arabicName || ngo.name || "منظمة",
          governorate: ngo.headquartersGovernorate || "",
          latitude: lat,
          longitude: lng
        });
      }
    });

    return locations;
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

    if (selectedClassification) {
      result = result.filter(ngo => {
        if (ngo.classifications && Array.isArray(ngo.classifications)) {
          return (ngo.classifications as Array<{ type?: string; name?: string }>).some(
            c => c.name === selectedClassification
          );
        }
        return false;
      });
    }

    if (selectedFilterGovernorate) {
      result = result.filter(ngo => {
        const ngoGovs = getGovernoratesFromNgo(ngo);
        return ngoGovs.includes(selectedFilterGovernorate);
      });
    }
    
    return result;
  }, [ngos, searchTerm, selectedClassification, selectedFilterGovernorate]);

  const totalPages = Math.ceil(filteredNgos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNgos = filteredNgos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

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
    setVisibleCount(50); // Reset visible count when changing selection
  };

  // NGOs to display in sidebar (filtered by governorate or all)
  const sidebarNgos = useMemo(() => {
    if (selectedGovernorate) {
      return governorateNgos;
    }
    return ngos || [];
  }, [ngos, selectedGovernorate, governorateNgos]);

  const visibleNgos = sidebarNgos.slice(0, visibleCount);
  const hasMore = visibleCount < sidebarNgos.length;

  const NgoGrid = ({ ngosList }: { ngosList: typeof ngos }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir="rtl">
      {(ngosList || []).map((ngo) => (
        <Link 
          key={ngo.id} 
          href={`/ngos/${ngo.id}`}
          data-testid={`link-ngo-${ngo.id}`}
          aria-label={`عرض ملف ${ngo.arabicName || ngo.name || 'المنظمة'}`}
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Card 
            className="bg-white border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] overflow-hidden cursor-pointer transition-all duration-300 group h-full flex flex-col"
            data-testid={`card-ngo-${ngo.id}`}
          >
            <CardContent className="p-0 flex flex-col h-full">
              <div className="h-2 bg-primary/80 group-hover:bg-primary transition-colors" />
              <div className="p-6 flex flex-col items-center flex-1 text-center">
                {ngo.logo ? (
                  <div className="w-20 h-20 mb-4 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center">
                    <img 
                      src={ngo.logo} 
                      alt={ngo.arabicName || "شعار المنظمة"} 
                      className="max-w-full max-h-full object-contain"
                      data-testid={`img-ngo-logo-${ngo.id}`}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-20 h-20 border-2 border-dashed rounded-lg bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors"
                    aria-hidden="true"
                  >
                    <Building2 className="w-10 h-10 text-gray-300 group-hover:text-primary/40" />
                  </div>
                )}
                
                <div className="flex-1 w-full">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                    {ngo.arabicName || ngo.name || "—"}
                  </h3>
                  {ngo.city && (
                    <p className="text-xs text-muted-foreground font-medium">
                      {ngo.city}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-center text-primary font-bold text-xs gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                  <span>عرض الملف التعريفي</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-8 border-b-4 border-secondary relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${headerPattern})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center bottom',
            opacity: 0.25,
            filter: 'invert(1)',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">دليل المنظمات غير الحكومية</h1>
              <p className="text-white/80 text-sm">ابحث في قاعدة بيانات المنظمات المرخصة والمعتمدة رسمياً في الجمهورية العربية السورية</p>
            </div>
          </div>
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
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <Card className="p-0 flex-1 w-full overflow-hidden border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] bg-white">
                <div className="h-2 bg-primary/80" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-primary mb-4 text-center">خريطة توزيع المنظمات</h2>
                  {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
                    </div>
                  ) : (
                    <SyriaMapLeaflet 
                      governoratesData={governoratesData}
                      onGovernorateClick={handleGovernorateClick}
                      selectedGovernorate={selectedGovernorate}
                      branchLocations={branchLocations}
                      headquartersLocations={headquartersLocations}
                    />
                  )}
                </div>
              </Card>

              <div className="w-full lg:w-[350px] shrink-0 sticky top-24">
                <Card className="p-0 h-full max-h-[600px] flex flex-col border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
                  <div className="h-2 bg-primary/80" />
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h2 className="text-lg font-bold text-primary">
                        {selectedGovernorate ? `منظمات ${selectedGovernorate}` : "جميع المنظمات"}
                      </h2>
                      {selectedGovernorate && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedGovernorate(null);
                            setVisibleCount(50);
                          }}
                          data-testid="button-clear-selection"
                          className="hover:bg-primary/5 text-primary font-bold"
                        >
                          إلغاء التحديد
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 font-medium">
                      عرض <span className="text-primary font-bold">{visibleNgos.length}</span> من أصل <span className="text-primary font-bold">{sidebarNgos.length}</span> منظمة
                    </p>
                    
                    {isLoading ? (
                      <div className="text-center py-12 text-muted-foreground flex-1 flex flex-col justify-center">
                        <div className="animate-pulse">جاري التحميل...</div>
                      </div>
                    ) : sidebarNgos.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground flex-1 flex flex-col justify-center">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>{selectedGovernorate ? "لا توجد منظمات مسجلة في هذه المحافظة" : "لا توجد منظمات مسجلة"}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                          {visibleNgos.map((ngo) => (
                            <Link 
                              key={ngo.id}
                              href={`/ngos/${ngo.id}`}
                              className="block"
                              data-testid={`map-ngo-link-${ngo.id}`}
                            >
                              <div className="flex items-center gap-4 p-4 rounded-xl border-none shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.12)] cursor-pointer bg-white transition-all duration-300 group">
                                {ngo.logo ? (
                                  <div className="w-12 h-12 p-1 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center shrink-0">
                                    <img 
                                      src={ngo.logo} 
                                      alt={ngo.arabicName || "شعار"} 
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                                    <Building2 className="w-6 h-6 text-gray-400 group-hover:text-primary/40" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors truncate leading-tight">
                                    {ngo.arabicName || ngo.name || "—"}
                                  </h3>
                                  {ngo.city && (
                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{ngo.city}</p>
                                  )}
                                </div>
                                <ChevronLeft className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                        {hasMore && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVisibleCount(prev => prev + 50)}
                            className="mt-4 w-full"
                            data-testid="button-show-more-ngos"
                          >
                            عرض المزيد ({sidebarNgos.length - visibleCount} متبقي)
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" data-testid="content-list-view">
            <div className="bg-white p-4 rounded-xl shadow-lg max-w-4xl mx-auto mb-10 space-y-3" dir="rtl">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="ابحث عن اسم منظمة أو مدينة..." 
                  className="pr-10 h-12 text-lg border-gray-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  data-testid="input-search-ngo"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Select
                    value={selectedClassification || "all"}
                    onValueChange={(val) => {
                      setSelectedClassification(val === "all" ? null : val);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger data-testid="select-filter-classification">
                      <SelectValue placeholder="تصنيف المنظمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التصنيفات</SelectItem>
                      {CLASSIFICATION_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Select
                    value={selectedFilterGovernorate || "all"}
                    onValueChange={(val) => {
                      setSelectedFilterGovernorate(val === "all" ? null : val);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger data-testid="select-filter-governorate">
                      <SelectValue placeholder="المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المحافظات</SelectItem>
                      {VALID_GOVERNORATES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(selectedClassification || selectedFilterGovernorate) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClassification(null);
                      setSelectedFilterGovernorate(null);
                      setCurrentPage(1);
                    }}
                    className="shrink-0"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-4 h-4 ml-1" />
                    مسح الفلاتر
                  </Button>
                )}
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
                    {totalPages > 1 && (
                      <span className="mr-2">
                        (عرض {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredNgos.length)})
                      </span>
                    )}
                  </p>
                </div>
                <NgoGrid ngosList={paginatedNgos} />
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="icon"
                              onClick={() => goToPage(page)}
                              data-testid={`button-page-${page}`}
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm text-muted-foreground mr-4">
                      صفحة {currentPage} من {totalPages}
                    </span>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
