import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2, ChevronLeft, FileText } from "lucide-react";
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
          <h1 className="text-3xl font-bold mb-4">التعاميم</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className="bg-white border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] overflow-hidden cursor-pointer transition-all duration-300 group"
                  onClick={() => setSelectedNotice(notice)}
                  data-testid={`card-notice-${notice.id}`}
                >
                  <CardContent className="p-0" dir="rtl">
                    <div className="h-2 bg-primary/80 group-hover:bg-primary transition-colors" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-primary/70">{notice.noticeDate}</span>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">التعميم رقم {notice.noticeNumber}</span>
                        <h3 className="text-lg font-bold mt-1 text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {notice.title || `تعميم رقم ${notice.noticeNumber}`}
                        </h3>
                      </div>

                      <div className="flex items-center text-primary font-bold text-xs gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
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
