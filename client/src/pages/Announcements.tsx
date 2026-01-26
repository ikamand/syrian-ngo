import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Card } from "@/components/ui/card";
import { Calendar, Loader2, ArrowLeft, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Link } from "wouter";
import { stripHtml } from "@/lib/sanitize";

export default function Announcements() {
  const { data: announcements, isLoading } = usePublishedAnnouncements();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">الأخبار والإعلانات</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            آخر الأخبار والإعلانات الصادرة عن وزارة الشؤون الاجتماعية والعمل
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : announcements && announcements.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{announcements.length}</span> خبر وإعلان
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
              {announcements.map((announcement) => (
                <Link key={announcement.id} href={`/news/${announcement.id}`}>
                  <Card 
                    className="bg-white rounded-xl shadow-sm overflow-visible hover-elevate cursor-pointer group transition-all duration-200 h-full" 
                    data-testid={`announcement-card-${announcement.id}`}
                  >
                    {announcement.imageUrl ? (
                      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-gray-100">
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Megaphone className="w-14 h-14 text-primary/30" />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {announcement.createdAt 
                            ? format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })
                            : ""}
                        </span>
                      </div>
                      <h2 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {announcement.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {stripHtml(announcement.content)}
                      </p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium pt-2">
                        <span>اقرأ المزيد</span>
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا توجد أخبار حالياً</p>
          </div>
        )}
      </main>
    </div>
  );
}
