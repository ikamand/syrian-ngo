import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NgoInternalNotes } from "@/components/NgoInternalNotes";
import type { Ngo } from "@shared/schema";

interface NgoInternalNotesDialogProps {
  ngo: Ngo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NgoInternalNotesDialog({ ngo, open, onOpenChange }: NgoInternalNotesDialogProps) {
  const displayName = ngo?.arabicName || ngo?.name || "غير محدد";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto" dir="rtl" data-testid="dialog-ngo-internal-notes">
        {ngo ? (
          <>
            <DialogHeader className="text-right border-b pb-4">
              <DialogTitle className="text-xl font-bold text-primary">الملاحظات الداخلية</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {displayName}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <NgoInternalNotes ngoId={ngo.id} />
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            لم يتم تحديد منظمة
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
