import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

interface ResetUserPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: number; username: string } | null;
}

export function ResetUserPasswordDialog({ open, onOpenChange, user }: ResetUserPasswordDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSet, setPasswordSet] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
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

      setPasswordSet(true);
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
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setPasswordSet(false);
    setCopied(false);
    onOpenChange(false);
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

  const handleOpen = () => {
    if (!passwordSet) {
      setNewPassword(generatePassword());
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? handleOpen() : handleClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
          <DialogDescription>
            إعادة تعيين كلمة المرور للمستخدم: <strong>{user?.username}</strong>
          </DialogDescription>
        </DialogHeader>
        
        {!passwordSet ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <div className="flex gap-2">
                <Input
                  id="newPassword"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="input-reset-password"
                />
                <Button type="button" variant="outline" onClick={() => setNewPassword(generatePassword())}>
                  توليد
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                يمكنك تعديل كلمة المرور أو توليد واحدة جديدة
              </p>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} data-testid="button-reset-password-submit">
                {isSubmitting ? "جاري الحفظ..." : "تعيين كلمة المرور"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">تم تعيين كلمة المرور الجديدة بنجاح:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border font-mono text-lg" dir="ltr">
                  {newPassword}
                </code>
                <Button type="button" size="icon" variant="outline" onClick={copyToClipboard} data-testid="button-copy-password">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-amber-700 mt-2">
                تأكد من إبلاغ المستخدم بكلمة المرور الجديدة. لن تظهر مرة أخرى.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} data-testid="button-close-reset-dialog">
                إغلاق
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
