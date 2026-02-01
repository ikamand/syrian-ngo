import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2, ArrowLeft, Megaphone, Newspaper, Clock, Search } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Link } from "wouter";
import { stripHtml } from "@/lib/sanitize";

const starPatternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <polygon fill="white" points="30,5 35,20 50,20 38,30 42,45 30,35 18,45 22,30 10,20 25,20"/>
</svg>`;
const starPatternUri = `url("data:image/svg+xml,${encodeURIComponent(starPatternSvg)}")`;

export default function Announcements() {
  const { data: announcements, isLoading } = usePublishedAnnouncements();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnnouncements = announcements?.filter((announcement) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = announcement.title.toLowerCase().includes(searchLower);
    const contentMatch = stripHtml(announcement.content).toLowerCase().includes(searchLower);
    return titleMatch || contentMatch;
  });

  const featuredArticle = filteredAnnouncements?.[0];
  const secondaryArticles = filteredAnnouncements?.slice(1, 3) || [];
  const remainingArticles = filteredAnnouncements?.slice(3) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="bg-primary text-white py-8 border-b-4 border-secondary relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: starPatternUri,
            backgroundRepeat: 'repeat',
            backgroundSize: '60px 60px',
            opacity: 0.3,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">الأخبار والإعلانات</h1>
                <p className="text-white/80 text-sm">آخر المستجدات من وزارة الشؤون الاجتماعية والعمل</p>
              </div>
            </div>
            {announcements && announcements.length > 0 && (
              <div className="hidden md:block text-left">
                <div className="text-3xl font-bold text-secondary">{announcements.length}</div>
                <div className="text-sm text-white/70">خبر منشور</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 relative z-10" dir="rtl">
        <div className="bg-white shadow-md p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث في الأخبار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
              data-testid="input-search-announcements"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-muted-foreground">
              {filteredAnnouncements?.length === 0 ? (
                <span>لا توجد نتائج للبحث "{searchTerm}"</span>
              ) : (
                <span>تم العثور على {filteredAnnouncements?.length} نتيجة</span>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-white p-6 animate-pulse">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 aspect-video bg-gray-200" />
                <div className="lg:w-1/3 space-y-4">
                  <div className="h-4 bg-gray-200 w-1/4" />
                  <div className="h-8 bg-gray-200 w-full" />
                  <div className="h-4 bg-gray-200 w-full" />
                  <div className="h-4 bg-gray-200 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
          <div className="space-y-8" dir="rtl">
            {featuredArticle && (
              <section>
                <Link href={`/news/${featuredArticle.id}`}>
                  <article className="bg-white shadow-lg overflow-hidden group cursor-pointer" data-testid={`featured-article-${featuredArticle.id}`}>
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-2/3 relative overflow-hidden">
                        {featuredArticle.imageUrl ? (
                          <img
                            src={featuredArticle.imageUrl}
                            alt={featuredArticle.title}
                            className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Megaphone className="w-24 h-24 text-primary/20" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-secondary text-black px-4 py-1 font-bold text-sm">
                          خبر رئيسي
                        </div>
                      </div>
                      <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {featuredArticle.createdAt 
                              ? format(new Date(featuredArticle.createdAt), "d MMMM yyyy", { locale: ar })
                              : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredArticle.createdAt 
                              ? formatDistanceToNow(new Date(featuredArticle.createdAt), { locale: ar, addSuffix: true })
                              : ""}
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed line-clamp-4 mb-6">
                          {stripHtml(featuredArticle.content)}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <span>قراءة الخبر كاملاً</span>
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {secondaryArticles.length > 0 && (
              <section>
                <div className="grid md:grid-cols-2 gap-6">
                  {secondaryArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.id}`}>
                      <article className="bg-white shadow-sm overflow-hidden group cursor-pointer h-full" data-testid={`secondary-article-${article.id}`}>
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="sm:w-2/5 relative overflow-hidden">
                            {article.imageUrl ? (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-48 sm:h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <Megaphone className="w-12 h-12 text-primary/20" />
                              </div>
                            )}
                          </div>
                          <div className="sm:w-3/5 p-5 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {article.createdAt 
                                  ? format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })
                                  : ""}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-grow">
                              {stripHtml(article.content)}
                            </p>
                            <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">
                              <span>المزيد</span>
                              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {remainingArticles.length > 0 && (
              <section>
                <div className="border-b-2 border-primary mb-6 pb-2">
                  <h2 className="text-xl font-bold text-primary">المزيد من الأخبار</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {remainingArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.id}`}>
                      <article className="bg-white shadow-sm overflow-hidden group cursor-pointer h-full flex flex-col" data-testid={`article-${article.id}`}>
                        <div className="relative overflow-hidden">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                              <Megaphone className="w-10 h-10 text-primary/20" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {article.createdAt 
                                ? format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })
                                : ""}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug flex-grow">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-1 text-primary text-xs font-medium">
                            <span>اقرأ المزيد</span>
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-white" dir="rtl">
            {searchTerm ? (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">لا توجد نتائج للبحث "{searchTerm}"</p>
                <p className="text-sm mt-2">جرب البحث بكلمات مختلفة</p>
              </>
            ) : (
              <>
                <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">لا توجد أخبار حالياً</p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
