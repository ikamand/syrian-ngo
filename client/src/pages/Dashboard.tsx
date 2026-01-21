import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useNgos } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: ngos, isLoading: isNgosLoading } = useNgos();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (isAuthLoading) return null;

  if (!user) {
    setLocation("/login");
    return null;
  }

  const myNgos = ngos?.filter(ngo => ngo.createdBy === user.id) || [];
  const filteredNgos = myNgos.filter(ngo => 
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ngo.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-1">إدارة طلبات المنظمات الخاصة بك</p>
          </div>
          <Link href="/ngos/new">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              تسجيل منظمة جديدة
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myNgos.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">قيد المراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {myNgos.filter(n => n.status === "Pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">تمت الموافقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {myNgos.filter(n => n.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="بحث في طلباتك..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs border-none bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="divide-y">
            {isNgosLoading ? (
              <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>
            ) : filteredNgos.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">لا توجد طلبات</h3>
                <p className="text-gray-500 mb-6">لم تقم بتقديم أي طلبات لتسجيل منظمات بعد.</p>
                <Link href="/ngos/new">
                  <Button variant="outline">بدء طلب جديد</Button>
                </Link>
              </div>
            ) : (
              filteredNgos.map((ngo) => (
                <div key={ngo.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-primary">{ngo.name}</h3>
                      <StatusBadge status={ngo.status as any} />
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span>المدينة: {ngo.city}</span>
                      <span>•</span>
                      <span>الرئيس: {ngo.presidentName}</span>
                      <span>•</span>
                      <span>تاريخ التقديم: {new Date(ngo.createdAt!).toLocaleDateString("ar-SY")}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">التفاصيل</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
