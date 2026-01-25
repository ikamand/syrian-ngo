import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Search, Building2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

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

  const filteredNgos = (ngos || []).filter(ngo => 
    (ngo.arabicName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ngo.englishName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ngo.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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

      <main className="container mx-auto px-4 -mt-6">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20" dir="rtl">
              {filteredNgos.map((ngo) => (
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
          </>
        )}
      </main>
    </div>
  );
}
