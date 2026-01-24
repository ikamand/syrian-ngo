import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useNgos, useUpdateNgoStatus, useDeleteNgo, useUpdateNgo } from "@/hooks/use-ngos";
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from "@/hooks/use-announcements";
import { useAllSiteContent, useUpsertSiteContent } from "@/hooks/use-site-content";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, X, Trash2, Save, Plus } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { NgoDetailsDialog } from "@/components/NgoDetailsDialog";
import type { Ngo } from "@shared/schema";

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
  const [viewingNgo, setViewingNgo] = useState<Ngo | null>(null);
  const { toast } = useToast();

  const { data: announcements, isLoading: isAnnouncementsLoading } = useAnnouncements();
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: updateAnnouncement, isPending: isAnnouncementUpdating } = useUpdateAnnouncement();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "", published: true });

  const { data: siteContent, isLoading: isSiteContentLoading } = useAllSiteContent();
  const { mutate: upsertSiteContent, isPending: isSiteContentUpdating } = useUpsertSiteContent();
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [contentForm, setContentForm] = useState({ key: "", title: "", content: "" });

  const predefinedContentKeys = [
    { key: "homepage_hero_title", label: "عنوان الصفحة الرئيسية" },
    { key: "homepage_hero_description", label: "وصف الصفحة الرئيسية" },
    { key: "homepage_about", label: "نبذة عن البوابة" },
    { key: "footer_contact", label: "معلومات التواصل" },
    { key: "registration_instructions", label: "تعليمات التسجيل" },
  ];

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

  const openCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({ title: "", content: "", published: true });
    setAnnouncementDialogOpen(true);
  };

  const openEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      published: announcement.published
    });
    setAnnouncementDialogOpen(true);
  };

  const handleAnnouncementSave = () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    if (editingAnnouncement) {
      updateAnnouncement({
        id: editingAnnouncement.id,
        data: announcementForm
      }, {
        onSuccess: () => {
          toast({ title: "تم التحديث", description: "تم تحديث الإعلان بنجاح" });
          setAnnouncementDialogOpen(false);
        }
      });
    } else {
      createAnnouncement(announcementForm, {
        onSuccess: () => {
          toast({ title: "تم الإنشاء", description: "تم إنشاء الإعلان بنجاح" });
          setAnnouncementDialogOpen(false);
        }
      });
    }
  };

  const handleAnnouncementDelete = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      deleteAnnouncement(id, {
        onSuccess: () => {
          toast({ title: "تم الحذف", description: "تم حذف الإعلان بنجاح" });
        }
      });
    }
  };

  const openEditContent = (content: any) => {
    setEditingContent(content);
    setContentForm({
      key: content.key,
      title: content.title,
      content: content.content
    });
    setContentDialogOpen(true);
  };

  const openCreateContent = (key: string, label: string) => {
    setEditingContent(null);
    setContentForm({
      key,
      title: label,
      content: ""
    });
    setContentDialogOpen(true);
  };

  const handleContentSave = () => {
    if (!contentForm.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء المحتوى",
        variant: "destructive"
      });
      return;
    }

    upsertSiteContent(contentForm, {
      onSuccess: () => {
        toast({ title: "تم الحفظ", description: "تم حفظ المحتوى بنجاح" });
        setContentDialogOpen(false);
      }
    });
  };

  const getContentByKey = (key: string) => {
    return siteContent?.find(c => c.key === key);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
          <p className="text-muted-foreground mt-1">إدارة المنظمات والإعلانات ومحتوى الموقع</p>
        </div>

        <Tabs defaultValue="ngos" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="ngos" data-testid="tab-ngos">
              المنظمات
            </TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">
              الإعلانات
            </TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">
              المحتوى
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ngos">
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between">
                <Input 
                  placeholder="بحث باسم المنظمة أو المدينة..." 
                  className="w-full md:w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-ngos"
                />
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
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
                        <TableRow key={ngo.id} data-testid={`row-ngo-${ngo.id}`}>
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
                                    size="icon" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(ngo.id)}
                                    disabled={isUpdating}
                                    title="موافقة"
                                    data-testid={`button-approve-${ngo.id}`}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="destructive"
                                    onClick={() => handleReject(ngo.id)}
                                    disabled={isUpdating}
                                    title="رفض"
                                    data-testid={`button-reject-${ngo.id}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setViewingNgo(ngo)}
                                data-testid={`button-details-ngo-${ngo.id}`}
                              >
                                التفاصيل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingNgo(ngo)}
                                data-testid={`button-edit-ngo-${ngo.id}`}
                              >
                                تعديل
                              </Button>
                              <Button 
                                size="icon" 
                                variant="destructive"
                                onClick={() => handleDelete(ngo.id)}
                                title="حذف"
                                data-testid={`button-delete-ngo-${ngo.id}`}
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
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">إدارة الإعلانات</h2>
                <Button onClick={openCreateAnnouncement} data-testid="button-create-announcement">
                  <Plus className="w-4 h-4 ml-2" />
                  إعلان جديد
                </Button>
              </div>

              {isAnnouncementsLoading ? (
                <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
              ) : announcements && announcements.length > 0 ? (
                <div className="grid gap-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} data-testid={`card-announcement-${announcement.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {announcement.createdAt && (
                                <span>{format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })}</span>
                              )}
                              {announcement.published ? (
                                <Badge variant="default" className="bg-green-600">منشور</Badge>
                              ) : (
                                <Badge variant="secondary">مسودة</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditAnnouncement(announcement)}
                              data-testid={`button-edit-announcement-${announcement.id}`}
                            >
                              تعديل
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleAnnouncementDelete(announcement.id)}
                              data-testid={`button-delete-announcement-${announcement.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 line-clamp-2">{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">لا توجد إعلانات حالياً</p>
                    <Button variant="outline" className="mt-4" onClick={openCreateAnnouncement}>
                      <Plus className="w-4 h-4 ml-2" />
                      إنشاء أول إعلان
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">إدارة محتوى الموقع</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                يمكنك تعديل النصوص المعروضة في صفحات الموقع المختلفة من هنا
              </p>

              {isSiteContentLoading ? (
                <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
              ) : (
                <div className="grid gap-4">
                  {predefinedContentKeys.map((item) => {
                    const existingContent = getContentByKey(item.key);
                    return (
                      <Card key={item.key} data-testid={`card-content-${item.key}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{item.label}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {existingContent ? (
                                  <span className="text-green-600">تم التعيين</span>
                                ) : (
                                  <span className="text-orange-500">لم يتم التعيين بعد</span>
                                )}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => existingContent 
                                ? openEditContent(existingContent) 
                                : openCreateContent(item.key, item.label)
                              }
                              data-testid={`button-edit-content-${item.key}`}
                            >
                              تعديل
                            </Button>
                          </div>
                        </CardHeader>
                        {existingContent && (
                          <CardContent>
                            <p className="text-foreground/80 line-clamp-2">{existingContent.content}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* NGO Edit Dialog */}
      <Dialog open={!!editingNgo} onOpenChange={(open) => !open && setEditingNgo(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المنظمة</DialogTitle>
          </DialogHeader>
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
                <Textarea 
                  value={editingNgo.description || ""} 
                  onChange={(e) => setEditingNgo({...editingNgo, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNgo(null)}>إلغاء</Button>
            <Button type="submit" onClick={handleEditSave}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "تعديل الإعلان" : "إعلان جديد"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان الإعلان</Label>
              <Input
                id="title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="أدخل عنوان الإعلان"
                data-testid="input-announcement-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">محتوى الإعلان</Label>
              <Textarea
                id="content"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                placeholder="أدخل محتوى الإعلان"
                className="min-h-[150px]"
                data-testid="input-announcement-content"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={announcementForm.published}
                onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, published: checked })}
                data-testid="switch-announcement-published"
              />
              <Label htmlFor="published">نشر الإعلان (سيظهر للزوار)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>إلغاء</Button>
            <Button 
              onClick={handleAnnouncementSave} 
              disabled={isCreating || isAnnouncementUpdating}
              data-testid="button-save-announcement"
            >
              <Save className="w-4 h-4 ml-2" />
              {editingAnnouncement ? "حفظ التغييرات" : "إنشاء الإعلان"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Edit Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المحتوى: {contentForm.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content-text">المحتوى</Label>
              <Textarea
                id="content-text"
                value={contentForm.content}
                onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                placeholder="أدخل المحتوى"
                className="min-h-[200px]"
                data-testid="input-content-text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContentDialogOpen(false)}>إلغاء</Button>
            <Button 
              onClick={handleContentSave} 
              disabled={isSiteContentUpdating}
              data-testid="button-save-content"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ المحتوى
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NGO Details Dialog */}
      <NgoDetailsDialog 
        ngo={viewingNgo} 
        open={!!viewingNgo} 
        onOpenChange={(open) => !open && setViewingNgo(null)} 
      />
    </div>
  );
}
