import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Announcements() {
  const { data: announcements, isLoading } = usePublishedAnnouncements();

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Megaphone className="w-8 h-8" />
              <h1 className="text-xl md:text-3xl font-bold">الأخبار والإعلانات</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              آخر الأخبار والإعلانات الصادرة عن وزارة الشؤون الاجتماعية والعمل
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : announcements && announcements.length > 0 ? (
            <div className="space-y-6" dir="rtl">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="hover-elevate" data-testid={`announcement-card-${announcement.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg md:text-xl text-primary leading-relaxed">
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {announcement.createdAt 
                            ? format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })
                            : ""}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">لا توجد إعلانات حالياً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
