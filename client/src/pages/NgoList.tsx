import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { NgoDetailsDialog } from "@/components/NgoDetailsDialog";
import type { Ngo } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [viewingNgo, setViewingNgo] = useState<Ngo | null>(null);

  const filteredNgos = (ngos || []).filter(ngo => 
    (ngo.arabicName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ngo.englishName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ngo.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getLegalFormLabel = (form: string) => {
    const forms: Record<string, string> = {
      "جمعية أهلية": "جمعية أهلية",
      "مؤسسة خيرية": "مؤسسة خيرية",
      "مؤسسة تنموية": "مؤسسة تنموية",
      "منظمة مجتمع مدني": "منظمة مجتمع مدني",
    };
    return forms[form] || form || "—";
  };

  const getScopeLabel = (scope: string) => {
    const scopes: Record<string, string> = {
      "نطاق محلي": "محلي",
      "نطاق محافظات": "محافظات",
      "نطاق وطني": "وطني",
    };
    return scopes[scope] || scope || "—";
  };

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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا توجد منظمات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-20">
            <div className="p-4 border-b bg-gray-50/50">
              <p className="text-sm text-muted-foreground">
                تم العثور على <span className="font-bold text-primary">{filteredNgos.length}</span> منظمة مرخصة
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="text-right font-bold">اسم المنظمة</TableHead>
                    <TableHead className="text-right font-bold">الشكل القانوني</TableHead>
                    <TableHead className="text-right font-bold">النطاق</TableHead>
                    <TableHead className="text-right font-bold">المدينة</TableHead>
                    <TableHead className="text-center font-bold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNgos.map((ngo) => (
                    <TableRow key={ngo.id} className="hover:bg-gray-50/50" data-testid={`row-ngo-${ngo.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{ngo.arabicName || "—"}</p>
                          <p className="text-sm text-muted-foreground">{ngo.englishName || ""}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{getLegalFormLabel(ngo.legalForm)}</TableCell>
                      <TableCell className="text-gray-600">{getScopeLabel(ngo.scope)}</TableCell>
                      <TableCell className="text-gray-600">{ngo.city || "—"}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingNgo(ngo)}
                          data-testid={`button-details-ngo-${ngo.id}`}
                        >
                          التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      <NgoDetailsDialog 
        ngo={viewingNgo} 
        open={!!viewingNgo} 
        onOpenChange={(open) => !open && setViewingNgo(null)} 
      />
    </div>
  );
}
