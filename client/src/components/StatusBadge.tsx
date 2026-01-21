import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Pending" | "Approved" | "Rejected";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Approved: "bg-green-50 text-green-700 border-green-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    Pending: Clock,
    Approved: CheckCircle2,
    Rejected: XCircle,
  };

  const labels = {
    Pending: "قيد المراجعة",
    Approved: "تمت الموافقة",
    Rejected: "مرفوض",
  };

  const Icon = icons[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-colors",
        styles[status],
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{labels[status]}</span>
    </div>
  );
}
