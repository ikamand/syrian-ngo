import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useNgos, useUpdateNgoStatus, useDeleteNgo } from "@/hooks/use-ngos";
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from "@/hooks/use-announcements";
import { useNotices, useCreateNotice, useUpdateNotice, useDeleteNotice } from "@/hooks/use-notices";
import { useAllSiteContent, useUpsertSiteContent } from "@/hooks/use-site-content";
import { useFooterLinks, useCreateFooterLink, useUpdateFooterLink, useDeleteFooterLink } from "@/hooks/use-footer-links";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, X, Trash2, Save, Plus, Key, Users, UserPlus, Pencil, Upload, ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResetUserPasswordDialog } from "@/components/ResetUserPasswordDialog";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { EditUserDialog } from "@/components/EditUserDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { stripHtml } from "@/lib/sanitize";
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
import { NgoEditDialog } from "@/components/NgoEditDialog";
import type { Ngo } from "@shared/schema";
import { useEffect } from "react";

// Users management type - defined outside component
interface AdminUser {
  id: number;
  username: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  organizationName?: string | null;
  governorate?: string | null;
  registrationNumber?: string | null;
  registrationDate?: string | null;
  status?: string;
  createdAt?: string | null;
}

export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: ngos, isLoading: isNgosLoading } = useNgos();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateNgoStatus();
  const { mutate: deleteNgo } = useDeleteNgo();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingNgo, setEditingNgo] = useState<Ngo | null>(null);
  const [viewingNgo, setViewingNgo] = useState<Ngo | null>(null);
  const { toast } = useToast();

  const { data: allUsers, isLoading: isUsersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });
  const [resetPasswordUser, setResetPasswordUser] = useState<{ id: number; username: string } | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  
  // Handle redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation("/login");
    } else if (!isAuthLoading && user && user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [user, isAuthLoading, setLocation]);

  const { data: announcements, isLoading: isAnnouncementsLoading } = useAnnouncements();
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: updateAnnouncement, isPending: isAnnouncementUpdating } = useUpdateAnnouncement();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "", imageUrl: "", published: true });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: noticesData, isLoading: isNoticesLoading } = useNotices();
  const { mutate: createNotice, isPending: isNoticeCreating } = useCreateNotice();
  const { mutate: updateNotice, isPending: isNoticeUpdating } = useUpdateNotice();
  const { mutate: deleteNotice } = useDeleteNotice();
  const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [noticeForm, setNoticeForm] = useState({ noticeNumber: "", noticeDate: "", title: "", pdfUrl: "" });
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const { data: siteContent, isLoading: isSiteContentLoading } = useAllSiteContent();
  const { mutate: upsertSiteContent, isPending: isSiteContentUpdating } = useUpsertSiteContent();
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [contentForm, setContentForm] = useState({ key: "", title: "", content: "", richText: false });
  const [isUploadingContentPdf, setIsUploadingContentPdf] = useState(false);

  const { data: footerLinksData, isLoading: isFooterLinksLoading } = usePublicFooterLinks();
  const { mutate: createFooterLink, isPending: isFooterLinkCreating } = useCreateFooterLink();
  const { mutate: updateFooterLink, isPending: isFooterLinkUpdating } = useUpdateFooterLink();
  const { mutate: deleteFooterLink } = useDeleteFooterLink();
  const [footerLinkDialogOpen, setFooterLinkDialogOpen] = useState(false);
  const [footerLinkDialogMode, setFooterLinkDialogMode] = useState<"list" | "form">("list");
  const [editingFooterLink, setEditingFooterLink] = useState<any>(null);
  const [footerLinkForm, setFooterLinkForm] = useState({ title: "", url: "", sortOrder: 0 });

  const predefinedContentKeys = [
    { key: "footer_contact", label: "معلومات التواصل", richText: false },
    { key: "registration_instructions", label: "تعليمات التسجيل", richText: false },
    { key: "association_law", label: "قانون الجمعيات والمؤسسات الخاصة (قانون 93 لعام 1958)", richText: true, pdfKey: "association_law_pdf" },
    { key: "executive_regulations", label: "اللائحة التنفيذية (قانون الجمعيات)", richText: true, pdfKey: "executive_regulations_pdf" },
  ];

  // Show nothing while loading or if user isn't an admin (useEffect handles redirect)
  if (isAuthLoading || !user || user.role !== "admin") {
    return null;
  }

  const filteredNgos = ngos?.filter(ngo => {
    const name = ngo.arabicName || ngo.name || "";
    const city = ngo.city || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.toLowerCase().includes(searchTerm.toLowerCase());
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

  
  const openCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({ title: "", content: "", imageUrl: "", published: true });
    setAnnouncementDialogOpen(true);
  };

  const openEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      imageUrl: announcement.imageUrl || "",
      published: announcement.published
    });
    setAnnouncementDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يتجاوز 5 ميغابايت",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const requestUrlResponse = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type
        }),
      });

      if (!requestUrlResponse.ok) {
        throw new Error("فشل الحصول على رابط الرفع");
      }

      const { uploadURL, objectPath } = await requestUrlResponse.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("فشل رفع الصورة");
      }

      setAnnouncementForm(prev => ({ ...prev, imageUrl: objectPath }));
      toast({
        title: "تم الرفع",
        description: "تم رفع الصورة بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل رفع الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
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

  const openCreateNotice = () => {
    setEditingNotice(null);
    setNoticeForm({ noticeNumber: "", noticeDate: "", title: "", pdfUrl: "" });
    setNoticeDialogOpen(true);
  };

  const openEditNotice = (notice: any) => {
    setEditingNotice(notice);
    setNoticeForm({
      noticeNumber: notice.noticeNumber,
      noticeDate: notice.noticeDate,
      title: notice.title || "",
      pdfUrl: notice.pdfUrl
    });
    setNoticeDialogOpen(true);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف PDF صالح",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "خطأ",
        description: "حجم الملف يتجاوز 10 ميغابايت",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingPdf(true);
    try {
      const requestUrlResponse = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type
        }),
      });

      if (!requestUrlResponse.ok) {
        throw new Error("فشل الحصول على رابط الرفع");
      }

      const { uploadURL, objectPath } = await requestUrlResponse.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("فشل رفع الملف");
      }

      setNoticeForm(prev => ({ ...prev, pdfUrl: objectPath }));
      toast({
        title: "تم الرفع",
        description: "تم رفع ملف PDF بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل رفع الملف، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleNoticeSave = () => {
    if (!noticeForm.noticeNumber.trim() || !noticeForm.noticeDate.trim() || !noticeForm.pdfUrl.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء رقم التعميم وتاريخه ورفع ملف PDF",
        variant: "destructive"
      });
      return;
    }

    if (editingNotice) {
      updateNotice({
        id: editingNotice.id,
        data: noticeForm
      }, {
        onSuccess: () => {
          toast({ title: "تم التحديث", description: "تم تحديث التعميم بنجاح" });
          setNoticeDialogOpen(false);
        }
      });
    } else {
      createNotice(noticeForm, {
        onSuccess: () => {
          toast({ title: "تم الإنشاء", description: "تم إنشاء التعميم بنجاح" });
          setNoticeDialogOpen(false);
        }
      });
    }
  };

  const handleNoticeDelete = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التعميم؟")) {
      deleteNotice(id, {
        onSuccess: () => {
          toast({ title: "تم الحذف", description: "تم حذف التعميم بنجاح" });
        }
      });
    }
  };

  const openEditContent = (content: any, richText: boolean = false) => {
    setEditingContent(content);
    setContentForm({
      key: content.key,
      title: content.title,
      content: content.content,
      richText
    });
    setContentDialogOpen(true);
  };

  const openCreateContent = (key: string, label: string, richText: boolean = false) => {
    setEditingContent(null);
    setContentForm({
      key,
      title: label,
      content: "",
      richText
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

  const openCreateFooterLink = () => {
    setEditingFooterLink(null);
    const nextOrder = footerLinksData?.length ? Math.max(...footerLinksData.map(l => l.sortOrder)) + 1 : 1;
    setFooterLinkForm({ title: "", url: "", sortOrder: nextOrder });
    setFooterLinkDialogMode("form");
  };

  const openEditFooterLink = (link: any) => {
    setEditingFooterLink(link);
    setFooterLinkForm({
      title: link.title,
      url: link.url,
      sortOrder: link.sortOrder
    });
    setFooterLinkDialogMode("form");
  };

  const openFooterLinksManager = () => {
    setFooterLinkDialogMode("list");
    setEditingFooterLink(null);
    setFooterLinkForm({ title: "", url: "", sortOrder: 0 });
    setFooterLinkDialogOpen(true);
  };

  const closeFooterLinkDialog = () => {
    setFooterLinkDialogOpen(false);
    setFooterLinkDialogMode("list");
    setEditingFooterLink(null);
    setFooterLinkForm({ title: "", url: "", sortOrder: 0 });
  };

  const backToFooterLinkList = () => {
    setFooterLinkDialogMode("list");
    setEditingFooterLink(null);
    setFooterLinkForm({ title: "", url: "", sortOrder: 0 });
  };

  const handleFooterLinkSave = () => {
    if (!footerLinkForm.title.trim() || !footerLinkForm.url.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (editingFooterLink) {
      updateFooterLink({
        id: editingFooterLink.id,
        data: footerLinkForm
      }, {
        onSuccess: () => {
          toast({ title: "تم التحديث", description: "تم تحديث الرابط بنجاح" });
          backToFooterLinkList();
        }
      });
    } else {
      createFooterLink(footerLinkForm, {
        onSuccess: () => {
          toast({ title: "تم الإنشاء", description: "تم إضافة الرابط بنجاح" });
          backToFooterLinkList();
        }
      });
    }
  };

  const handleFooterLinkDelete = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
      deleteFooterLink(id, {
        onSuccess: () => {
          toast({ title: "تم الحذف", description: "تم حذف الرابط بنجاح" });
        }
      });
    }
  };

  const handleContentPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, pdfKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف PDF صالح",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "خطأ",
        description: "حجم الملف يتجاوز 10 ميغابايت",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingContentPdf(true);
    try {
      const requestUrlResponse = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type
        }),
      });

      if (!requestUrlResponse.ok) {
        throw new Error("فشل الحصول على رابط الرفع");
      }

      const { uploadURL, objectPath } = await requestUrlResponse.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("فشل رفع الملف");
      }

      upsertSiteContent({ key: pdfKey, title: pdfKey, content: objectPath }, {
        onSuccess: () => {
          toast({
            title: "تم الرفع",
            description: "تم رفع ملف PDF بنجاح"
          });
        }
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل رفع الملف، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsUploadingContentPdf(false);
    }
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
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="ngos" data-testid="tab-ngos">
              المنظمات
            </TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">
              الإعلانات
            </TabsTrigger>
            <TabsTrigger value="notices" data-testid="tab-notices">
              التعاميم
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              المستخدمين
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
                      <TableHead className="text-right">الشكل القانوني</TableHead>
                      <TableHead className="text-right">النطاق</TableHead>
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
                          <TableCell className="font-medium text-primary">{ngo.arabicName || ngo.name || "غير محدد"}</TableCell>
                          <TableCell>{ngo.legalForm || "—"}</TableCell>
                          <TableCell>{ngo.scope || "—"}</TableCell>
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
                    <Card key={announcement.id} className="overflow-hidden" data-testid={`card-announcement-${announcement.id}`}>
                      <div className="flex flex-col md:flex-row">
                        {announcement.imageUrl && (
                          <div className="w-full md:w-48 h-32 md:h-auto shrink-0 bg-muted">
                            <img 
                              src={announcement.imageUrl} 
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                                  {announcement.createdAt && (
                                    <span>{format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })}</span>
                                  )}
                                  {announcement.published ? (
                                    <Badge variant="default" className="bg-green-600">منشور</Badge>
                                  ) : (
                                    <Badge variant="secondary">مسودة</Badge>
                                  )}
                                  {announcement.imageUrl && (
                                    <Badge variant="outline">
                                      <ImageIcon className="w-3 h-3 ml-1" />
                                      صورة
                                    </Badge>
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
                            <p className="text-foreground/80 line-clamp-2">{stripHtml(announcement.content)}</p>
                          </CardContent>
                        </div>
                      </div>
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

          <TabsContent value="notices">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">إدارة التعاميم</h2>
                <Button onClick={openCreateNotice} data-testid="button-create-notice">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة تعميم جديد
                </Button>
              </div>

              {isNoticesLoading ? (
                <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
              ) : noticesData && noticesData.length > 0 ? (
                <div className="grid gap-4">
                  {noticesData.map((notice) => (
                    <Card key={notice.id} data-testid={`card-notice-${notice.id}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">رقم التعميم: {notice.noticeNumber}</Badge>
                              <Badge variant="secondary">{notice.noticeDate}</Badge>
                            </div>
                            {notice.title && (
                              <h3 className="text-lg font-medium mb-1">{notice.title}</h3>
                            )}
                            <p className="text-sm text-muted-foreground truncate">
                              {notice.pdfUrl}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditNotice(notice)}
                              data-testid={`button-edit-notice-${notice.id}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleNoticeDelete(notice.id)}
                              data-testid={`button-delete-notice-${notice.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">لا توجد تعاميم حالياً</p>
                    <Button variant="outline" className="mt-4" onClick={openCreateNotice}>
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة أول تعميم
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold">إدارة المستخدمين</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    إنشاء وتعديل حسابات المستخدمين وإدارة حالة الحسابات
                  </p>
                </div>
                <Button onClick={() => setCreateUserOpen(true)} data-testid="button-create-user">
                  <UserPlus className="w-4 h-4 ml-2" />
                  إنشاء حساب جديد
                </Button>
              </div>

              {isUsersLoading ? (
                <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
              ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                  <Table className="table-fixed w-full">
                    <colgroup>
                      <col className="w-[100px]" />
                      <col className="w-[120px]" />
                      <col className="w-[160px]" />
                      <col className="w-[100px]" />
                      <col className="w-[100px]" />
                      <col className="w-[80px]" />
                      <col className="w-[80px]" />
                      <col className="w-[180px]" />
                    </colgroup>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم المستخدم</TableHead>
                        <TableHead className="text-right">الإسم الكامل</TableHead>
                        <TableHead className="text-right">المنظمة</TableHead>
                        <TableHead className="text-right">المحافظة</TableHead>
                        <TableHead className="text-right">رقم الإشهار</TableHead>
                        <TableHead className="text-center">الدور</TableHead>
                        <TableHead className="text-center">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((u) => (
                        <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                          <TableCell className="font-medium font-mono text-right" dir="ltr" style={{ unicodeBidi: "isolate" }}>{u.username}</TableCell>
                          <TableCell className="text-right truncate">
                            {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "-"}
                          </TableCell>
                          <TableCell className="text-right truncate">{u.organizationName || "-"}</TableCell>
                          <TableCell className="text-right">{u.governorate || "-"}</TableCell>
                          <TableCell className="text-right" dir="ltr" style={{ unicodeBidi: "isolate" }}>{u.registrationNumber || "-"}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                              {u.role === "admin" ? "مدير" : "مستخدم"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={u.status === "suspended" ? "destructive" : "outline"}>
                              {u.status === "suspended" ? "متوقف" : "فعّال"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUser(u)}
                                data-testid={`button-edit-user-${u.id}`}
                              >
                                <Pencil className="w-4 h-4 ml-1" />
                                تعديل
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setResetPasswordUser({ id: u.id, username: u.username })}
                                data-testid={`button-reset-password-${u.id}`}
                              >
                                <Key className="w-4 h-4 ml-1" />
                                كلمة المرور
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                    const existingPdf = item.pdfKey ? getContentByKey(item.pdfKey) : null;
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
                            <div className="flex gap-2">
                              {item.pdfKey && (
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleContentPdfUpload(e, item.pdfKey!)}
                                    disabled={isUploadingContentPdf}
                                    data-testid={`input-upload-pdf-${item.key}`}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isUploadingContentPdf}
                                    data-testid={`button-upload-pdf-${item.key}`}
                                  >
                                    {isUploadingContentPdf ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Upload className="w-4 h-4 ml-1" />
                                        {existingPdf ? "تغيير PDF" : "رفع PDF"}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => existingContent 
                                  ? openEditContent(existingContent, item.richText) 
                                  : openCreateContent(item.key, item.label, item.richText)
                                }
                                data-testid={`button-edit-content-${item.key}`}
                              >
                                تعديل
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {existingContent && (
                            <p className="text-foreground/80 line-clamp-2">{item.richText ? stripHtml(existingContent.content) : existingContent.content}</p>
                          )}
                          {existingPdf && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <span>ملف PDF: تم الرفع</span>
                              <a 
                                href={`/api/files/${existingPdf.content}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                معاينة
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  <Card className="border shadow-sm">
                    <CardHeader>
                      <div className="flex flex-row items-center justify-between gap-2">
                        <CardTitle className="text-lg">روابط هامة</CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={openFooterLinksManager}
                          data-testid="button-edit-content-footer-links"
                        >
                          تعديل
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isFooterLinksLoading ? (
                        <p className="text-foreground/80">جاري التحميل...</p>
                      ) : footerLinksData && footerLinksData.length > 0 ? (
                        <p className="text-foreground/80">
                          {footerLinksData.length} روابط مضافة
                        </p>
                      ) : (
                        <p className="text-muted-foreground">لا توجد روابط مضافة</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </main>

      {/* NGO Edit Dialog */}
      <NgoEditDialog
        ngo={editingNgo}
        open={!!editingNgo}
        onOpenChange={(open) => !open && setEditingNgo(null)}
        onSuccess={() => setEditingNgo(null)}
      />

      {/* Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "تعديل الخبر" : "خبر جديد"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان الخبر</Label>
              <Input
                id="title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="أدخل عنوان الخبر"
                data-testid="input-announcement-title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>صورة الخبر (اختياري)</Label>
              <div className="space-y-3">
                {announcementForm.imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                    <img 
                      src={announcementForm.imageUrl} 
                      alt="صورة الخبر" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 left-2"
                      onClick={() => setAnnouncementForm(prev => ({ ...prev, imageUrl: "" }))}
                      data-testid="button-remove-image"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center py-4">
                      {isUploadingImage ? (
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">اضغط لرفع صورة</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG حتى 5MB</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      data-testid="input-announcement-image"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">محتوى الخبر</Label>
              <RichTextEditor
                value={announcementForm.content}
                onChange={(content) => setAnnouncementForm({ ...announcementForm, content })}
                placeholder="أدخل محتوى الخبر"
                minHeight="200px"
                data-testid="input-announcement-content"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-3 border rounded-lg">
              <Label htmlFor="published" className="cursor-pointer">نشر الخبر (سيظهر للزوار)</Label>
              <Switch
                id="published"
                dir="ltr"
                checked={announcementForm.published}
                onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, published: checked })}
                data-testid="switch-announcement-published"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>إلغاء</Button>
            <Button 
              onClick={handleAnnouncementSave} 
              disabled={isCreating || isAnnouncementUpdating || isUploadingImage}
              data-testid="button-save-announcement"
            >
              <Save className="w-4 h-4 ml-2" />
              {editingAnnouncement ? "حفظ التغييرات" : "إنشاء الخبر"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notices Dialog */}
      <Dialog open={noticeDialogOpen} onOpenChange={setNoticeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingNotice ? "تعديل التعميم" : "تعميم جديد"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="noticeNumber">رقم التعميم</Label>
              <Input
                id="noticeNumber"
                value={noticeForm.noticeNumber}
                onChange={(e) => setNoticeForm({ ...noticeForm, noticeNumber: e.target.value })}
                placeholder="أدخل رقم التعميم"
                data-testid="input-notice-number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="noticeDate">تاريخ التعميم</Label>
              <Input
                id="noticeDate"
                type="date"
                value={noticeForm.noticeDate}
                onChange={(e) => setNoticeForm({ ...noticeForm, noticeDate: e.target.value })}
                data-testid="input-notice-date"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="noticeTitle">عنوان التعميم (اختياري)</Label>
              <Input
                id="noticeTitle"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                placeholder="أدخل عنوان التعميم"
                data-testid="input-notice-title"
              />
            </div>

            <div className="grid gap-2">
              <Label>ملف PDF</Label>
              <div className="space-y-3">
                {noticeForm.pdfUrl ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 truncate">
                      <Upload className="w-4 h-4 text-primary" />
                      <span className="text-sm truncate">{noticeForm.pdfUrl}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => setNoticeForm(prev => ({ ...prev, pdfUrl: "" }))}
                      data-testid="button-remove-pdf"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center py-4">
                      {isUploadingPdf ? (
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">اضغط لرفع ملف PDF</p>
                          <p className="text-xs text-muted-foreground mt-1">حتى 10MB</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      disabled={isUploadingPdf}
                      data-testid="input-notice-pdf"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoticeDialogOpen(false)}>إلغاء</Button>
            <Button 
              onClick={handleNoticeSave} 
              disabled={isNoticeCreating || isNoticeUpdating || isUploadingPdf}
              data-testid="button-save-notice"
            >
              <Save className="w-4 h-4 ml-2" />
              {editingNotice ? "حفظ التغييرات" : "إضافة التعميم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Edit Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المحتوى: {contentForm.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content-text">المحتوى</Label>
              {contentForm.richText ? (
                <RichTextEditor
                  value={contentForm.content}
                  onChange={(content) => setContentForm({ ...contentForm, content })}
                  placeholder="أدخل المحتوى"
                  minHeight="300px"
                  data-testid="input-content-richtext"
                />
              ) : (
                <Textarea
                  id="content-text"
                  value={contentForm.content}
                  onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                  placeholder="أدخل المحتوى"
                  className="min-h-[200px]"
                  data-testid="input-content-text"
                />
              )}
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

      {/* Footer Links Management Dialog */}
      <Dialog open={footerLinkDialogOpen} onOpenChange={closeFooterLinkDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {footerLinkDialogMode === "list" ? (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>إدارة الروابط الهامة</DialogTitle>
                  <Button onClick={openCreateFooterLink} size="sm" data-testid="button-add-footer-link">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة رابط
                  </Button>
                </div>
              </DialogHeader>
              <div className="py-4">
                {isFooterLinksLoading ? (
                  <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>
                ) : footerLinksData?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">لا توجد روابط مضافة</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الترتيب</TableHead>
                          <TableHead>العنوان</TableHead>
                          <TableHead>الرابط</TableHead>
                          <TableHead className="text-left">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {footerLinksData?.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell>{link.sortOrder}</TableCell>
                            <TableCell className="font-medium">{link.title}</TableCell>
                            <TableCell>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm"
                              >
                                {link.url.length > 30 ? link.url.substring(0, 30) + "..." : link.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditFooterLink(link)}
                                  data-testid={`button-edit-footer-link-${link.id}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleFooterLinkDelete(link.id)}
                                  className="text-destructive hover:text-destructive"
                                  data-testid={`button-delete-footer-link-${link.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeFooterLinkDialog}>إغلاق</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{editingFooterLink ? "تعديل الرابط" : "إضافة رابط جديد"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="link-title">العنوان</Label>
                  <Input
                    id="link-title"
                    value={footerLinkForm.title}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, title: e.target.value })}
                    placeholder="مثال: وزارة الشؤون الاجتماعية"
                    data-testid="input-footer-link-title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="link-url">الرابط (URL)</Label>
                  <Input
                    id="link-url"
                    type="url"
                    dir="ltr"
                    value={footerLinkForm.url}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, url: e.target.value })}
                    placeholder="https://example.gov.sy"
                    data-testid="input-footer-link-url"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="link-order">ترتيب العرض</Label>
                  <Input
                    id="link-order"
                    type="number"
                    min="0"
                    value={footerLinkForm.sortOrder}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, sortOrder: parseInt(e.target.value) || 0 })}
                    data-testid="input-footer-link-order"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={backToFooterLinkList}>رجوع</Button>
                <Button 
                  onClick={handleFooterLinkSave} 
                  disabled={isFooterLinkCreating || isFooterLinkUpdating}
                  data-testid="button-save-footer-link"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {editingFooterLink ? "حفظ التغييرات" : "إضافة الرابط"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* NGO Details Dialog */}
      <NgoDetailsDialog 
        ngo={viewingNgo} 
        open={!!viewingNgo} 
        onOpenChange={(open) => !open && setViewingNgo(null)} 
      />

      {/* Reset User Password Dialog */}
      <ResetUserPasswordDialog
        open={!!resetPasswordUser}
        onOpenChange={(open) => !open && setResetPasswordUser(null)}
        user={resetPasswordUser}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />
    </div>
  );
}
