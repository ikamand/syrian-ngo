import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useNgos, useUpdateNgoStatus, useDeleteNgo, useUpdateNgo } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, X, Search, Filter, Trash2, Edit2, Save } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: ngos, isLoading: isNgosLoading } = useNgos();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateNgoStatus();
  const { mutate: deleteNgo } = useDeleteNgo();
  const { mutate: updateNgo } = useUpdateNgo();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingNgo, setEditingNgo] = useState<any>(null);
  const { toast } = useToast();

  if (isAuthLoading) return null;

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const filteredNgos = ngos?.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ngo.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ngo.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleApprove = (id: number) => {
    updateStatus({ id, status: "Approved" });
  };

  const handleReject = (id: number) => {
    updateStatus({ id, status: "Rejected" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المنظمة؟")) {
      deleteNgo(id);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
          <p className="text-muted-foreground mt-1">مراجعة وإدارة كافة المنظمات</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث باسم المنظمة أو المدينة..." 
                className="pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="Pending">قيد المراجعة</SelectItem>
                  <SelectItem value="Approved">مقبول</SelectItem>
                  <SelectItem value="Rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-right">اسم المنظمة</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">رئيس المنظمة</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isNgosLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">جاري التحميل...</TableCell>
                  </TableRow>
                ) : filteredNgos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">لا توجد نتائج</TableCell>
                  </TableRow>
                ) : (
                  filteredNgos.map((ngo) => (
                    <TableRow key={ngo.id}>
                      <TableCell className="font-medium text-primary">{ngo.name}</TableCell>
                      <TableCell>{ngo.city}</TableCell>
                      <TableCell>{ngo.presidentName}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={ngo.status as any} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {ngo.status === "Pending" && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                onClick={() => handleApprove(ngo.id)}
                                disabled={isUpdating}
                                title="موافقة"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={() => handleReject(ngo.id)}
                                disabled={isUpdating}
                                title="رفض"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingNgo(ngo)}
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete(ngo.id)}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingNgo} onOpenChange={(open) => !open && setEditingNgo(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المنظمة</DialogTitle>
          </DialogHeader>
          {editingNgo && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">اسم المنظمة</label>
                <Input 
                  value={editingNgo.name} 
                  onChange={(e) => setEditingNgo({...editingNgo, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">المدينة</label>
                <Input 
                  value={editingNgo.city} 
                  onChange={(e) => setEditingNgo({...editingNgo, city: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">رئيس المنظمة</label>
                <Input 
                  value={editingNgo.presidentName} 
                  onChange={(e) => setEditingNgo({...editingNgo, presidentName: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditSave}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
