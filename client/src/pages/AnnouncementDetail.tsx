import { Navbar } from "@/components/Navbar";
import { useAnnouncement } from "@/hooks/use-announcements";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Loader2, Newspaper, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useRoute, Link } from "wouter";
import { sanitizeHtml } from "@/lib/sanitize";

export default function AnnouncementDetail() {
  const [, params] = useRoute("/news/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: announcement, isLoading, isError } = useAnnouncement(id);

  const handleShare = () => {
    if (navigator.share && announcement) {
      navigator.share({
        title: announcement.title,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/announcements">
            <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground" data-testid="button-back-to-news">
              <ArrowRight className="w-4 h-4" />
              <span>العودة للأخبار</span>
            </Button>
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError || !announcement ? (
            <div className="py-20 text-center">
              <Newspaper className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg mb-4">لم يتم العثور على الخبر</p>
              <Link href="/announcements">
                <Button variant="outline">
                  العودة للأخبار
                </Button>
              </Link>
            </div>
          ) : (
            <article className="space-y-8" dir="rtl" data-testid={`article-${announcement.id}`}>
              {announcement.imageUrl && (
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                    data-testid="article-image"
                  />
                </div>
              )}

              <header className="space-y-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug" data-testid="article-title">
                  {announcement.title}
                </h1>
              </header>

              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-loose prose-headings:text-gray-900 prose-headings:font-bold prose-p:mb-6 prose-li:text-gray-700 prose-ul:list-disc prose-ol:list-decimal prose-a:text-primary prose-a:underline"
                data-testid="article-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.content) }}
              />

              <footer className="pt-8 mt-8 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ النشر:</span>
                    <time dateTime={announcement.createdAt?.toString()} className="font-medium text-gray-700">
                      {announcement.createdAt
                        ? format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })
                        : ""}
                    </time>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-muted-foreground"
                    onClick={handleShare}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة</span>
                  </Button>
                </div>
              </footer>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
