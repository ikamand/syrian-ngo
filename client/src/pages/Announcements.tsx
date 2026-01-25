import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Calendar, Loader2, ArrowLeft, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Link } from "wouter";

export default function Announcements() {
  const { data: announcements, isLoading } = usePublishedAnnouncements();

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Newspaper className="w-8 h-8" />
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" dir="rtl">
              {announcements.map((announcement) => (
                <Link key={announcement.id} href={`/news/${announcement.id}`}>
                  <Card 
                    className="h-full hover-elevate cursor-pointer group transition-all duration-200 overflow-hidden" 
                    data-testid={`announcement-card-${announcement.id}`}
                  >
                    {announcement.imageUrl ? (
                      <div className="relative w-full aspect-video overflow-hidden bg-muted">
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Megaphone className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {announcement.createdAt 
                            ? format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })
                            : ""}
                        </span>
                      </div>
                      <h2 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium pt-2">
                        <span>اقرأ المزيد</span>
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Newspaper className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">لا توجد أخبار حالياً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
