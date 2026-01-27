import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/sanitize";
import type { Announcement } from "@shared/schema";

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function truncateText(text: string, maxLength: number): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + "...";
}

export function FeaturedNewsSlider() {
  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements/published"],
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const latestNews = announcements.slice(0, 3);

  const nextSlide = useCallback(() => {
    if (latestNews.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % latestNews.length);
  }, [latestNews.length]);

  const prevSlide = useCallback(() => {
    if (latestNews.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + latestNews.length) % latestNews.length);
  }, [latestNews.length]);

  useEffect(() => {
    if (!isAutoPlaying || latestNews.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, latestNews.length]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="animate-pulse bg-gray-200 h-80" />
        </div>
      </section>
    );
  }

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
            <Newspaper className="w-8 h-8" />
            آخر الأخبار
          </h2>
          <Link href="/announcements">
            <Button variant="outline" className="gap-2" data-testid="link-view-all-news">
              عرض جميع الأخبار
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div 
          className="relative overflow-hidden bg-white shadow-lg"
          dir="ltr"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div 
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {latestNews.map((news) => (
              <div key={news.id} className="w-full flex-shrink-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 h-64 md:h-80 bg-gray-200 relative overflow-hidden">
                    {news.imageUrl ? (
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Newspaper className="w-20 h-20 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-right" dir="rtl">
                    <span className="text-sm text-muted-foreground mb-2">
                      {news.createdAt ? new Date(news.createdAt).toLocaleDateString('ar-SY', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                      {truncateText(news.content, 200)}
                    </p>
                    <Link href={`/news/${news.id}`}>
                      <Button variant="default" className="self-start" data-testid={`link-read-more-${news.id}`}>
                        اقرأ المزيد
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {latestNews.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 shadow"
                onClick={nextSlide}
                data-testid="button-news-next"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 shadow"
                onClick={prevSlide}
                data-testid="button-news-prev"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {latestNews.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 transition-all ${
                      index === currentSlide ? "bg-primary w-6" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    data-testid={`button-news-indicator-${index}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
