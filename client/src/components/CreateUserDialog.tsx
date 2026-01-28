import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, RefreshCw, UserPlus, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedPassword, setGeneratedPassword] = useState(generatePassword());
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdUsername, setCreatedUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organizationName: "",
    governorate: "",
    registrationNumber: "",
    registrationDate: ""
  });

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.trim().length < 1) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }
    
    setUsernameStatus("checking");
    try {
      const res = await fetch(`/api/auth/check-username/${encodeURIComponent(username.trim())}`, {
        credentials: "include"
      });
      const data = await res.json();
      setUsernameStatus(data.available ? "available" : "taken");
      setUsernameMessage(data.message);
    } catch {
      setUsernameStatus("idle");
      setUsernameMessage("");
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(formData.username);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsernameAvailability]);

  const createUserMutation = useMutation({
    mutationFn: async (data: typeof formData & { password: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return {};
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setCreatedUsername(formData.username);
      setShowCredentials(true);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast({ title: "خطأ", description: "اسم المستخدم مطلوب", variant: "destructive" });
      return;
    }
    
    if (usernameStatus === "taken") {
      toast({ title: "خطأ", description: "اسم المستخدم مستخدم مسبقاً. يرجى اختيار اسم آخر", variant: "destructive" });
      return;
    }
    
    createUserMutation.mutate({
      ...formData,
      password: generatedPassword
    });
  };

  const handleClose = () => {
    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organizationName: "",
      governorate: "",
      registrationNumber: "",
      registrationDate: ""
    });
    setGeneratedPassword(generatePassword());
    setShowCredentials(false);
    setCreatedUsername("");
    setUsernameStatus("idle");
    setUsernameMessage("");
    onOpenChange(false);
  };

  const copyCredentials = () => {
    const text = `اسم المستخدم: ${createdUsername}\nكلمة المرور: ${generatedPassword}`;
    navigator.clipboard.writeText(text);
    toast({ title: "تم النسخ", description: "تم نسخ بيانات الدخول" });
  };

  if (showCredentials) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              تم إنشاء الحساب بنجاح
            </DialogTitle>
            <DialogDescription>
              يرجى نسخ بيانات الدخول ومشاركتها مع المستخدم
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">اسم المستخدم:</span>
                <span className="font-mono font-bold">{createdUsername}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">كلمة المرور:</span>
                <span className="font-mono font-bold text-primary">{generatedPassword}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              احفظ هذه البيانات الآن. لن تتمكن من رؤية كلمة المرور مرة أخرى.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              إغلاق
            </Button>
            <Button onClick={copyCredentials} data-testid="button-copy-credentials">
              <Copy className="w-4 h-4 ml-2" />
              نسخ البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            إنشاء حساب مستخدم جديد
          </DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد. سيتم إنشاء كلمة مرور تلقائياً.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                  className={`text-left pl-10 ${
                    usernameStatus === "taken" ? "border-destructive focus-visible:ring-destructive" : 
                    usernameStatus === "available" ? "border-green-500 focus-visible:ring-green-500" : ""
                  }`}
                  dir="ltr"
                  data-testid="input-new-username"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" data-testid="icon-username-checking" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" data-testid="icon-username-available" />
                  )}
                  {usernameStatus === "taken" && (
                    <XCircle className="w-4 h-4 text-destructive" data-testid="icon-username-taken" />
                  )}
                </div>
              </div>
              {usernameStatus === "taken" && (
                <p className="text-sm text-destructive" data-testid="text-username-error">{usernameMessage}</p>
              )}
              {usernameStatus === "available" && (
                <p className="text-sm text-green-600" data-testid="text-username-success">{usernameMessage}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور (تلقائية)</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                  className="font-mono text-left"
                  dir="ltr"
                  data-testid="input-generated-password"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGeneratedPassword(generatePassword())}
                  title="إنشاء كلمة مرور جديدة"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">الإسم</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="الإسم الأول"
                data-testid="input-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">الكنية</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="الكنية"
                data-testid="input-last-name"
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
                data-testid="input-email"
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
                data-testid="input-phone"
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
              data-testid="input-organization-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="governorate">المحافظة</Label>
              <Select
                value={formData.governorate}
                onValueChange={(value) => setFormData({ ...formData, governorate: value })}
              >
                <SelectTrigger data-testid="select-governorate">
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
                data-testid="input-registration-number"
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
              data-testid="input-registration-date"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending} data-testid="button-create-user">
              {createUserMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <UserPlus className="w-4 h-4 ml-2" />
              )}
              إنشاء الحساب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
