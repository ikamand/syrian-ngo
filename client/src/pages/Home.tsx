import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Building2, FileCheck, Users, ArrowLeft, Calendar, Briefcase, Heart, Megaphone } from "lucide-react";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FeaturedNewsSlider } from "@/components/FeaturedNewsSlider";
import { usePublicFooterLinks } from "@/hooks/use-footer-links";

import emblemUrl from "@assets/emblem-of-syria-seeklogo_1769035838735.png";
import headerPattern from "@assets/header-pattern.svg";

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image: string;
}

function QuickLinkCard({ title, description, href, icon, image }: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <div className="group relative h-64 overflow-hidden cursor-pointer" data-testid={`quicklink-${href.replace('/', '')}`}>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-white/80 text-sm line-clamp-2">{description}</p>
          <div className="flex items-center gap-1 text-secondary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
            <span>استكشف</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: footerLinks } = usePublicFooterLinks();
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <HeroSlideshow />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">عن منصة تشارك</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              المنصة الوطنية الإلكترونية للمنظمات غير الحكومية التي هي صلة الوصل المباشرة والشفافة بين الجهات المانحة والمتبرعين من داخل وخارج سوريا من جهة وبين المؤسسات والجمعيات المعنية بإيصال المساعدات وتنفيذ البرامج التنموية من جهة آخرى.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">استكشف المنصة</h2>
            <p className="text-muted-foreground">تصفح أقسام المنصة المختلفة</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              title="دليل المنظمات"
              description="استعرض المنظمات المسجلة والمرخصة"
              href="/ngos"
              icon={<Building2 className="w-6 h-6" />}
              image="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2074&auto=format&fit=crop"
            />
            <QuickLinkCard
              title="فرص العمل والتطوع"
              description="اكتشف فرص العمل والتطوع المتاحة"
              href="/opportunities"
              icon={<Briefcase className="w-6 h-6" />}
              image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2087&auto=format&fit=crop"
            />
            <QuickLinkCard
              title="الفعاليات"
              description="تابع الفعاليات والأنشطة القادمة"
              href="/events"
              icon={<Calendar className="w-6 h-6" />}
              image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            />
            <QuickLinkCard
              title="حملات التبرع"
              description="ساهم في دعم المجتمع"
              href="/donation-campaigns"
              icon={<Heart className="w-6 h-6" />}
              image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>
      <FeaturedNewsSlider />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">خدمات المنصة</h2>
            <p className="text-muted-foreground">تقدّم المنصة مجموعة من الخدمات الرقمية التي تنظّم عمل الجمعيات وتسهّل التواصل مع الوزارة.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileCheck className="w-10 h-10 text-primary" />}
              title="ترخيص وإشهار إلكتروني"
              description="تقديم طلبات ترخيص المنظمات والجمعيات بشكل إلكتروني كامل دون الحاجة للمراجعة الورقية."
            />
            <FeatureCard 
              icon={<Users className="w-10 h-10 text-primary" />}
              title="دليل المنظمات الأهلية"
              description="يمكنك استعراض بيانات المنظمات غير الحكومية المرخصة، والتعرّف على أنشطتها ومجالات عملها."
            />
            <FeatureCard 
              icon={<Megaphone className="w-10 h-10 text-primary" />}
              title="منبر المنظمات"
              description="نشر أخبار المنظمات، الإعلان عن حملات التبرع، فرص العمل والتطوع، والأنشطة المجتمعية."
            />
          </div>
        </div>
      </section>
      <section className="py-16 bg-primary text-white relative overflow-hidden">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">30+</div>
              <div className="text-primary-foreground/80 font-medium">فئة مستهدفة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">14</div>
              <div className="text-primary-foreground/80 font-medium">محافظة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">792</div>
              <div className="text-primary-foreground/80 font-medium">عدد المعاملات</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">820</div>
              <div className="text-primary-foreground/80 font-medium">منظمة مشهرة</div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-800 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={emblemUrl} 
                  alt="Syrian National Emblem" 
                  className="h-12 w-auto drop-shadow-lg"
                />
                <span className="text-lg font-bold text-white">بوابة المنظمات</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                منصة حكومية رسمية تهدف لتنظيم وتسهيل عمل المنظمات غير الحكومية في الجمهورية العربية السورية.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-secondary transition-colors">الرئيسية</Link></li>
                <li><Link href="/ngos" className="hover:text-secondary transition-colors">دليل المنظمات</Link></li>
                <li><Link href="/announcements" className="hover:text-secondary transition-colors">الأخبار</Link></li>
                <li><Link href="/login" className="hover:text-secondary transition-colors">تسجيل الدخول</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">روابط هامة</h3>
              <ul className="space-y-2 text-sm">
                {footerLinks && footerLinks.length > 0 ? (
                  footerLinks.map((link) => (
                    <li key={link.id}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-secondary transition-colors"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <a href="http://www.mosal.gov.sy" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                        وزارة الشؤون الإجتماعية والعمل
                      </a>
                    </li>
                    <li>
                      <a href="http://www.moh.gov.sy" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                        وزارة الصحة
                      </a>
                    </li>
                    <li>
                      <a href="http://www.pmo.gov.sy" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                        رئاسة مجلس الوزراء
                      </a>
                    </li>
                    <li>
                      <a href="http://moed.gov.sy" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                        وزارة التربية والتعليم
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-2 text-sm">
                <li>دمشق، الجمهورية العربية السورية</li>
                <li>هاتف: 0112314151 / 0112325221</li>
                <li>البريد: info@mosal.gov.sy</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500">
            © 2026 بوابة المنظمات غير الحكومية - جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover-elevate transition-shadow duration-300">
      <CardHeader className="space-y-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/5 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
