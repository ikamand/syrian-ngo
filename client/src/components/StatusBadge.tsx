import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, UserCheck } from "lucide-react";

interface StatusBadgeProps {
  status: "Pending" | "AdminApproved" | "Approved" | "Rejected";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    AdminApproved: "bg-blue-50 text-blue-700 border-blue-200",
    Approved: "bg-green-50 text-green-700 border-green-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const icons: Record<string, typeof Clock> = {
    Pending: Clock,
    AdminApproved: UserCheck,
    Approved: CheckCircle2,
    Rejected: XCircle,
  };

  const labels: Record<string, string> = {
    Pending: "قيد المراجعة",
    AdminApproved: "بانتظار المشرف الأعلى",
    Approved: "تمت الموافقة",
    Rejected: "مرفوض",
  };

  const Icon = icons[status] || Clock;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-colors",
        styles[status] || styles.Pending,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{labels[status] || status}</span>
    </div>
  );
}
