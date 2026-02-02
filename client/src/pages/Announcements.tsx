import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2, Megaphone, Newspaper, Search } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Link } from "wouter";
import { stripHtml } from "@/lib/sanitize";
import headerPattern from "@assets/header-pattern.svg";

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
  const subArticles = filteredAnnouncements?.slice(1) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="bg-primary text-white py-8 border-b-4 border-secondary relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${headerPattern})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center bottom',
            opacity: 0.5,
            filter: 'invert(1)',
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
          <div className="space-y-8" dir="rtl">
            {featuredArticle && (
              <section>
                <Link href={`/news/${featuredArticle.id}`} data-testid={`link-featured-article-${featuredArticle.id}`}>
                  <article 
                    className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer shadow-lg"
                    data-testid={`featured-article-${featuredArticle.id}`}
                  >
                    {featuredArticle.imageUrl ? (
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Megaphone className="w-32 h-32 text-white/20" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10 text-white">
                      <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {featuredArticle.createdAt 
                            ? format(new Date(featuredArticle.createdAt), "d MMMM yyyy", { locale: ar })
                            : ""}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-secondary transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-white/90 leading-relaxed line-clamp-3 max-w-3xl text-sm md:text-base">
                        {stripHtml(featuredArticle.content)}
                      </p>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {subArticles.length > 0 && (
              <section>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.id}`} data-testid={`link-article-${article.id}`}>
                      <article 
                        className="bg-white shadow-md overflow-hidden group cursor-pointer h-full flex flex-col"
                        data-testid={`article-${article.id}`}
                      >
                        <div className="relative overflow-hidden aspect-video">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <Megaphone className="w-12 h-12 text-primary/30" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {article.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {article.createdAt 
                                ? format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })
                                : ""}
                            </span>
                          </div>
                          
                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                            {stripHtml(article.content)}
                          </p>
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
