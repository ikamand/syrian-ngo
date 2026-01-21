import { Navbar } from "@/components/Navbar";
import { useNgos } from "@/hooks/use-ngos";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NgoList() {
  const { data: ngos, isLoading } = useNgos();
  const [searchTerm, setSearchTerm] = useState("");

  const approvedNgos = ngos?.filter(ngo => ngo.status === "Approved") || [];
  const filteredNgos = approvedNgos.filter(ngo => 
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ngo.city.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg max-w-2xl mx-auto mb-10 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن اسم منظمة أو مدينة..." 
              className="pr-10 h-12 text-lg border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا توجد منظمات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredNgos.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">مرخصة</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={ngo.name}>{ngo.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{ngo.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{ngo.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{ngo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span dir="ltr" className="text-right">{ngo.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
