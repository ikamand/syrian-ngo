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
import { Loader2, Save, UserCog, Key, Copy, Check, RefreshCw } from "lucide-react";

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
  currentUserId?: number;
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

export function EditUserDialog({ open, onOpenChange, user, currentUserId }: EditUserDialogProps) {
  const isEditingSelf = user?.id === currentUserId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleResetPassword = async () => {
    if (!user || !newPassword || newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await fetch("/api/admin/reset-user-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "حدث خطأ");
      }

      setPasswordResetSuccess(true);
      toast({
        title: "تم بنجاح",
        description: "تم إعادة تعيين كلمة المرور بنجاح",
      });
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err.message || "فشل في إعادة تعيين كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    toast({
      title: "تم النسخ",
      description: "تم نسخ كلمة المرور إلى الحافظة",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
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

  // Reset form and password state when dialog opens or user changes
  useEffect(() => {
    if (open && user) {
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
      // Reset password state when dialog opens or user changes
      setNewPassword("");
      setPasswordResetSuccess(false);
      setCopied(false);
      setIsResettingPassword(false);
    }
  }, [open, user]);

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

          {/* Organization fields - only show for regular users, not admins */}
          {user.role === "user" && (
            <>
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
            </>
          )}

          <div className={`flex items-center justify-between gap-3 p-3 border rounded-lg ${isEditingSelf ? "opacity-50" : ""}`}>
            <div className="space-y-1">
              <Label htmlFor="status" className={isEditingSelf ? "" : "cursor-pointer"}>الحساب فعّال</Label>
              <p className="text-xs text-muted-foreground">
                {isEditingSelf 
                  ? "لا يمكنك تعطيل حسابك الخاص"
                  : formData.status === "active" 
                    ? "المستخدم يمكنه تسجيل الدخول" 
                    : "المستخدم لا يمكنه تسجيل الدخول"}
              </p>
            </div>
            <Switch
              id="status"
              dir="ltr"
              checked={formData.status === "active"}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "suspended" })}
              disabled={isEditingSelf}
              data-testid="switch-edit-status"
            />
          </div>

          {formData.status === "suspended" && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-sm text-destructive">
              تحذير: إيقاف الحساب سيمنع المستخدم من تسجيل الدخول إلى النظام
            </div>
          )}

          {/* Password Reset Section - not shown when editing self */}
          {!isEditingSelf && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">إعادة تعيين كلمة المرور</Label>
              </div>
              
              {!passwordResetSuccess ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="كلمة المرور الجديدة"
                      className="text-left"
                      dir="ltr"
                      data-testid="input-new-password"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setNewPassword(generatePassword())}
                      title="توليد كلمة مرور"
                      data-testid="button-generate-password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword || !newPassword}
                    data-testid="button-reset-password"
                  >
                    {isResettingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-1" />
                    ) : (
                      <Key className="w-4 h-4 ml-1" />
                    )}
                    تعيين كلمة المرور
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">تم تعيين كلمة المرور الجديدة:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white px-3 py-2 rounded border font-mono text-sm" dir="ltr">
                      {newPassword}
                    </code>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline" 
                      onClick={copyToClipboard}
                      data-testid="button-copy-password"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    تأكد من إبلاغ المستخدم بكلمة المرور الجديدة
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit-user">
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
