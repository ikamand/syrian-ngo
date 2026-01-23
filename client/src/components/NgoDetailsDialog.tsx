import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Building2, MapPin, User, Mail, Phone, FileText, Calendar, Scale, Globe } from "lucide-react";
import type { Ngo } from "@shared/schema";

interface NgoDetailsDialogProps {
  ngo: Ngo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NgoDetailsDialog({ ngo, open, onOpenChange }: NgoDetailsDialogProps) {
  const getLegalFormLabel = (form: string) => {
    const forms: Record<string, string> = {
      "جمعية أهلية": "جمعية أهلية",
      "مؤسسة خيرية": "مؤسسة خيرية",
      "مؤسسة تنموية": "مؤسسة تنموية",
      "منظمة مجتمع مدني": "منظمة مجتمع مدني",
    };
    return forms[form] || form || "غير محدد";
  };

  const getScopeLabel = (scope: string) => {
    const scopes: Record<string, string> = {
      "نطاق محلي": "نطاق محلي",
      "نطاق محافظات": "نطاق محافظات",
      "نطاق وطني": "نطاق وطني",
    };
    return scopes[scope] || scope || "غير محدد";
  };

  const getFieldValue = (value: string | null | undefined, fallback: string = "غير محدد") => {
    return value && value.trim() ? value : fallback;
  };

  const displayName = ngo?.arabicName || ngo?.name || "غير محدد";
  const displayEnglishName = ngo?.englishName || "Not specified";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto" dir="rtl" data-testid="dialog-ngo-details">
        {ngo ? (
          <>
            <DialogHeader className="text-right border-b pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-primary">{displayName}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">{displayEnglishName}</DialogDescription>
                  </div>
                </div>
                <StatusBadge status={ngo.status as any} />
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem 
                  icon={<Scale className="w-4 h-4" />}
                  label="الشكل القانوني"
                  value={getLegalFormLabel(ngo.legalForm)}
                />
                <DetailItem 
                  icon={<Globe className="w-4 h-4" />}
                  label="نطاق العمل"
                  value={getScopeLabel(ngo.scope)}
                />
                <DetailItem 
                  icon={<MapPin className="w-4 h-4" />}
                  label="المدينة"
                  value={getFieldValue(ngo.city)}
                />
                <DetailItem 
                  icon={<User className="w-4 h-4" />}
                  label="اسم الرئيس"
                  value={getFieldValue(ngo.presidentName)}
                />
                <DetailItem 
                  icon={<Mail className="w-4 h-4" />}
                  label="البريد الإلكتروني"
                  value={getFieldValue(ngo.email)}
                />
                <DetailItem 
                  icon={<Phone className="w-4 h-4" />}
                  label="رقم الهاتف"
                  value={getFieldValue(ngo.phone)}
                />
                <DetailItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="تاريخ التقديم"
                  value={ngo.createdAt ? new Date(ngo.createdAt).toLocaleDateString("ar-SY", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "غير محدد"}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start gap-2 text-muted-foreground mb-2">
                  <FileText className="w-4 h-4 mt-1" />
                  <span className="text-sm font-medium">وصف المنظمة وأهدافها</span>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{getFieldValue(ngo.description, "لا يوجد وصف")}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <DialogHeader>
              <DialogTitle className="sr-only">تفاصيل المنظمة</DialogTitle>
              <DialogDescription className="sr-only">جاري تحميل تفاصيل المنظمة</DialogDescription>
            </DialogHeader>
            جاري التحميل...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/20 rounded-lg p-3 border" data-testid={`detail-${label}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
