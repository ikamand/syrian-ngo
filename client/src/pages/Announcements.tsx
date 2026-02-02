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
  const secondaryArticles = filteredAnnouncements?.slice(1, 3) || [];
  const remainingArticles = filteredAnnouncements?.slice(3) || [];

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
          <div className="space-y-6" dir="rtl">
            {featuredArticle && (
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Link href={`/news/${featuredArticle.id}`} data-testid={`link-featured-article-${featuredArticle.id}`}>
                    <article 
                      className="relative h-[300px] lg:h-full min-h-[400px] overflow-hidden group cursor-pointer shadow-md"
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
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {featuredArticle.createdAt 
                              ? format(new Date(featuredArticle.createdAt), "d MMMM yyyy", { locale: ar })
                              : ""}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight group-hover:text-secondary transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-white/90 leading-relaxed line-clamp-3 text-sm">
                          {stripHtml(featuredArticle.content)}
                        </p>
                      </div>
                    </article>
                  </Link>

                  {secondaryArticles.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {secondaryArticles.map((article) => (
                        <Link key={article.id} href={`/news/${article.id}`} data-testid={`link-secondary-article-${article.id}`}>
                          <article 
                            className="relative h-[200px] overflow-hidden group cursor-pointer shadow-md flex-1"
                            data-testid={`secondary-article-${article.id}`}
                          >
                            {article.imageUrl ? (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center">
                                <Megaphone className="w-16 h-16 text-white/20" />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            
                            <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                              <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {article.createdAt 
                                    ? format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })
                                    : ""}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                                {article.title}
                              </h3>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {remainingArticles.length > 0 && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {remainingArticles.map((article) => (
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
                              <Megaphone className="w-10 h-10 text-primary/30" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {article.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Calendar className="w-3 h-3" />
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
