import { Navbar } from "@/components/Navbar";
import { useAnnouncement } from "@/hooks/use-announcements";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Loader2, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useRoute, Link } from "wouter";

export default function AnnouncementDetail() {
  const [, params] = useRoute("/news/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: announcement, isLoading, isError } = useAnnouncement(id);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/announcements">
            <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back-to-news">
              <ArrowRight className="w-4 h-4" />
              <span>العودة للأخبار</span>
            </Button>
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError || !announcement ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Newspaper className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">لم يتم العثور على الخبر</p>
                <Link href="/announcements">
                  <Button variant="outline" className="mt-4">
                    العودة للأخبار
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <article className="space-y-6" dir="rtl" data-testid={`article-${announcement.id}`}>
              {announcement.imageUrl && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                    data-testid="article-image"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary leading-relaxed" data-testid="article-title">
                  {announcement.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={announcement.createdAt?.toString()}>
                    {announcement.createdAt
                      ? format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ar })
                      : ""}
                  </time>
                </div>
              </div>

              <Card>
                <CardContent className="py-8">
                  <div 
                    className="prose prose-lg max-w-none text-foreground/90 leading-loose whitespace-pre-wrap"
                    data-testid="article-content"
                  >
                    {announcement.content}
                  </div>
                </CardContent>
              </Card>

              <div className="pt-6 border-t">
                <Link href="/announcements">
                  <Button variant="outline" className="gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>عرض جميع الأخبار</span>
                  </Button>
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
