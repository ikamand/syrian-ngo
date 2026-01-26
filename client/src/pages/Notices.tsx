import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download, Loader2, ExternalLink } from "lucide-react";
import { usePublicNotices } from "@/hooks/use-notices";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Notice } from "@shared/schema";

export default function Notices() {
  const { data: notices, isLoading } = usePublicNotices();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-xl md:text-3xl font-bold text-primary leading-relaxed">التعاميم</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              التعاميم والقرارات الرسمية الصادرة عن وزارة الشؤون الاجتماعية والعمل
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notices && notices.length > 0 ? (
            <div className="grid gap-4">
              {notices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => setSelectedNotice(notice)}
                  data-testid={`card-notice-${notice.id}`}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-4" dir="rtl">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            رقم التعميم: {notice.noticeNumber}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {notice.noticeDate}
                          </Badge>
                        </div>
                        {notice.title ? (
                          <h3 className="text-lg font-medium mb-1">{notice.title}</h3>
                        ) : (
                          <h3 className="text-lg font-medium mb-1">تعميم رقم {notice.noticeNumber}</h3>
                        )}
                        <p className="text-sm text-muted-foreground">
                          اضغط لعرض التفاصيل وتحميل الملف
                        </p>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNotice(notice);
                          }}
                          data-testid={`button-view-notice-${notice.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">لا توجد تعاميم حالياً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-right" dir="rtl">
              {selectedNotice?.title || `تعميم رقم ${selectedNotice?.noticeNumber}`}
            </DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4 py-4" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">رقم التعميم</p>
                  <p className="font-medium" data-testid="text-notice-number">{selectedNotice.noticeNumber}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">تاريخ التعميم</p>
                  <p className="font-medium" data-testid="text-notice-date">{selectedNotice.noticeDate}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <a
                  href={selectedNotice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="link-download-pdf"
                >
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    تحميل ملف PDF
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
