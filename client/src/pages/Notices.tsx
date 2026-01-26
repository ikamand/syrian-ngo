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
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl font-bold">التعاميم</h1>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            التعاميم والقرارات الرسمية الصادرة عن وزارة الشؤون الاجتماعية والعمل
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="max-w-4xl mx-auto grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notices && notices.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{notices.length}</span> تعميم
              </p>
            </div>
            <div className="grid gap-4">
              {notices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className="bg-white rounded-xl shadow-sm overflow-visible hover-elevate cursor-pointer transition-all"
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
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا توجد تعاميم حالياً</p>
          </div>
        )}
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
