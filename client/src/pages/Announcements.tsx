import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { usePublishedAnnouncements } from "@/hooks/use-announcements";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Megaphone, Newspaper, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Link } from "wouter";
import { stripHtml } from "@/lib/sanitize";
import headerPattern from "@/assets/images/header-pattern.svg";

const ITEMS_PER_PAGE = 12;

export default function Announcements() {
  const { data: announcements, isLoading } = usePublishedAnnouncements();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAnnouncements = announcements?.filter((announcement) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = announcement.title.toLowerCase().includes(searchLower);
    const contentMatch = stripHtml(announcement.content).toLowerCase().includes(searchLower);
    return titleMatch || contentMatch;
  });

  const featuredArticle = filteredAnnouncements?.[0];
  const secondaryArticles = filteredAnnouncements?.slice(1, 3) || [];
  const allRemainingArticles = filteredAnnouncements?.slice(3) || [];
  
  const totalPages = Math.ceil(allRemainingArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const remainingArticles = allRemainingArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

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
            opacity: 0.25,
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
              onChange={handleSearchChange}
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
                            {formatDate(featuredArticle.createdAt)}
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
                    <div className="grid grid-cols-2 gap-4">
                      {secondaryArticles.map((article) => (
                        <Link key={article.id} href={`/news/${article.id}`} data-testid={`link-secondary-article-${article.id}`}>
                          <article 
                            className="bg-white shadow-md overflow-hidden group cursor-pointer h-full flex flex-col"
                            data-testid={`secondary-article-${article.id}`}
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
                                  {formatDate(article.createdAt)}
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
                              {formatDate(article.createdAt)}
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

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="icon"
                              onClick={() => goToPage(page)}
                              data-testid={`button-page-${page}`}
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm text-muted-foreground mr-4">
                      صفحة {currentPage} من {totalPages}
                    </span>
                  </div>
                )}
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
