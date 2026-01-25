import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, UserCog } from "lucide-react";

interface UserData {
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
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
}

const GOVERNORATES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة"
];

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organizationName: "",
    governorate: "",
    registrationNumber: "",
    registrationDate: "",
    status: "active"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        organizationName: user.organizationName || "",
        governorate: user.governorate || "",
        registrationNumber: user.registrationNumber || "",
        registrationDate: user.registrationDate || "",
        status: user.status || "active"
      });
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${user?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المستخدم بنجاح"
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في التحديث",
        description: error.message || "حدث خطأ أثناء تحديث بيانات المستخدم",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            تعديل بيانات المستخدم: {user.username}
          </DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات المستخدم وحالة الحساب
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">الإسم</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="الإسم الأول"
                data-testid="input-edit-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">الكنية</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="الكنية"
                data-testid="input-edit-last-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="text-left"
                dir="ltr"
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+963..."
                className="text-left"
                dir="ltr"
                data-testid="input-edit-phone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">اسم المنظمة</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              placeholder="اسم المنظمة أو الجمعية"
              data-testid="input-edit-organization-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="governorate">المحافظة</Label>
              <Select
                value={formData.governorate}
                onValueChange={(value) => setFormData({ ...formData, governorate: value })}
              >
                <SelectTrigger data-testid="select-edit-governorate">
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {GOVERNORATES.map((gov) => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">رقم الإشهار</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="رقم الإشهار"
                data-testid="input-edit-registration-number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDate">تاريخ الإشهار</Label>
            <Input
              id="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
              className="text-left"
              dir="ltr"
              data-testid="input-edit-registration-date"
            />
          </div>

          <div className="flex items-center justify-between gap-3 p-3 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="status" className="cursor-pointer">الحساب فعّال</Label>
              <p className="text-xs text-muted-foreground">
                {formData.status === "active" 
                  ? "المستخدم يمكنه تسجيل الدخول" 
                  : "المستخدم لا يمكنه تسجيل الدخول"}
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "suspended" })}
              data-testid="switch-edit-status"
            />
          </div>

          {formData.status === "suspended" && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-sm text-destructive">
              تحذير: إيقاف الحساب سيمنع المستخدم من تسجيل الدخول إلى النظام
            </div>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending} data-testid="button-save-user">
              {updateUserMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
