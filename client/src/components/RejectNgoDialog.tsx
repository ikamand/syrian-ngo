import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

interface RejectNgoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ngoName: string;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
}

export function RejectNgoDialog({
  open,
  onOpenChange,
  ngoName,
  onConfirm,
  isPending = false
}: RejectNgoDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            رفض المنظمة
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-muted-foreground">
            أنت على وشك رفض طلب تسجيل المنظمة: <strong className="text-foreground">{ngoName}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">سبب الرفض *</Label>
            <Textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="يرجى ذكر سبب الرفض ليتمكن المستخدم من اتخاذ الإجراءات التصحيحية اللازمة..."
              className="min-h-[120px]"
              data-testid="input-rejection-reason"
            />
            <p className="text-xs text-muted-foreground">
              سيتم إبلاغ المستخدم بسبب الرفض ليتمكن من تصحيح المعلومات وإعادة التقديم
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            data-testid="button-cancel-rejection"
          >
            إلغاء
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
            data-testid="button-confirm-rejection"
          >
            تأكيد الرفض
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
