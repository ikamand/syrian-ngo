import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquarePlus, StickyNote, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NgoNote {
  id: number;
  ngoId: number;
  authorId: number;
  content: string;
  createdAt: string;
  authorName: string;
}

interface NgoInternalNotesProps {
  ngoId: number;
}

export function NgoInternalNotes({ ngoId }: NgoInternalNotesProps) {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const { data: notes, isLoading } = useQuery<NgoNote[]>({
    queryKey: ['/api/admin/ngos', ngoId, 'notes'],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ngos/${ngoId}/notes`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
    enabled: !!ngoId,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/admin/ngos/${ngoId}/notes`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ngos', ngoId, 'notes'] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الملاحظة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الملاحظة",
        variant: "destructive",
      });
    },
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote.trim());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <StickyNote className="w-5 h-5" />
        <h4 className="font-semibold">الملاحظات الداخلية</h4>
        <span className="text-xs text-muted-foreground">(للمسؤولين فقط)</span>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="أضف ملاحظة جديدة..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[80px] resize-none"
          data-testid="textarea-new-note"
        />
        <Button
          onClick={handleAddNote}
          disabled={!newNote.trim() || addNoteMutation.isPending}
          className="gap-2"
          data-testid="button-add-note"
        >
          {addNoteMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquarePlus className="w-4 h-4" />
          )}
          إضافة ملاحظة
        </Button>
      </div>

      <div className="space-y-3 mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-muted/30 rounded-lg p-4 border-r-4 border-primary/30"
              data-testid={`note-item-${note.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-foreground">{note.authorName}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            لا توجد ملاحظات حتى الآن
          </div>
        )}
      </div>
    </div>
  );
}
