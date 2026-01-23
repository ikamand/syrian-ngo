import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useNgos, useUpdateNgo } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit2, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { NgoDetailsDialog } from "@/components/NgoDetailsDialog";
import type { Ngo } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: ngos, isLoading: isNgosLoading } = useNgos();
  const { mutate: updateNgo } = useUpdateNgo();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNgo, setEditingNgo] = useState<any>(null);
  const [viewingNgo, setViewingNgo] = useState<Ngo | null>(null);

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

  const handleEditSave = () => {
    if (editingNgo) {
      updateNgo({ id: editingNgo.id, data: editingNgo });
      setEditingNgo(null);
    }
  };

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
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setEditingNgo(ngo)}
                    >
                      <Edit2 className="w-4 h-4" />
                      تعديل
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setViewingNgo(ngo)}
                      data-testid={`button-details-${ngo.id}`}
                    >
                      <Eye className="w-4 h-4" />
                      التفاصيل
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingNgo} onOpenChange={(open) => !open && setEditingNgo(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المنظمة</DialogTitle>
          </DialogHeader>
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-700">
              تنبيه: سيؤدي تعديل بيانات المنظمة إلى إعادة حالة الطلب إلى "قيد المراجعة" لحين موافقة المسؤول مرة أخرى.
            </p>
          </div>
          {editingNgo && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">اسم المنظمة (بالعربي)</label>
                  <Input 
                    value={editingNgo.arabicName || ""} 
                    onChange={(e) => setEditingNgo({...editingNgo, arabicName: e.target.value, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">اسم المنظمة (بالإنكليزي)</label>
                  <Input 
                    value={editingNgo.englishName || ""} 
                    onChange={(e) => setEditingNgo({...editingNgo, englishName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">الشكل القانوني</label>
                  <Select 
                    value={editingNgo.legalForm || ""} 
                    onValueChange={(val) => setEditingNgo({...editingNgo, legalForm: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشكل القانوني" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جمعية أهلية">جمعية أهلية</SelectItem>
                      <SelectItem value="مؤسسة تنموية">مؤسسة تنموية</SelectItem>
                      <SelectItem value="فرع منظمة دولية">فرع منظمة دولية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">نطاق العمل</label>
                  <Select 
                    value={editingNgo.scope || ""} 
                    onValueChange={(val) => setEditingNgo({...editingNgo, scope: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نطاق العمل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نطاق محلي">نطاق محلي</SelectItem>
                      <SelectItem value="نطاق محافظات">نطاق محافظات</SelectItem>
                      <SelectItem value="نطاق وطني">نطاق وطني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">المحافظة (المقر الرئيسي)</label>
                  <Select 
                    value={editingNgo.city || ""} 
                    onValueChange={(val) => setEditingNgo({...editingNgo, city: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus", "Idlib", "Raqqa", "Deir ez-Zor", "Al-Hasakah", "Daraa", "As-Suwayda", "Quneitra", "Rif Dimashq"].map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">اسم رئيس مجلس الإدارة</label>
                  <Input 
                    value={editingNgo.presidentName || ""} 
                    onChange={(e) => setEditingNgo({...editingNgo, presidentName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input 
                    type="email"
                    value={editingNgo.email || ""} 
                    onChange={(e) => setEditingNgo({...editingNgo, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">رقم التواصل</label>
                  <Input 
                    value={editingNgo.phone || ""} 
                    onChange={(e) => setEditingNgo({...editingNgo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">وصف أهداف المنظمة</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingNgo.description || ""} 
                  onChange={(e) => setEditingNgo({...editingNgo, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNgo(null)}>إلغاء</Button>
            <Button type="submit" onClick={handleEditSave}>حفظ التغييرات وإرسال للمراجعة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <NgoDetailsDialog 
        ngo={viewingNgo} 
        open={!!viewingNgo} 
        onOpenChange={(open) => !open && setViewingNgo(null)} 
      />
    </div>
  );
}
